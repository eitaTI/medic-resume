# Task 2: Migração Prisma + Server Actions com Jira

❌ **Pendente** — `prisma/schema.prisma`, migration e `actions/submissoes.ts`

## Objetivo

Adicionar a coluna de sincronização `jiraSyncStatus` no schema e integrar a criação do
card Jira na aprovação de forma **fail-open** (a aprovação não depende do Jira), além de
uma action de retry `sincronizarJira`.

## Passo 1 — Schema + Migration

Em `prisma/schema.prisma`, no model `Clinica`, adicionar:

```prisma
jiraSyncStatus String? // PENDENTE | SINCRONIZADO | ERRO
```

Gerar a migration (seguir padrão das fases 1 e 7):

```bash
pnpm prisma migrate dev --name add_jira_sync_status
```

Isso cria a migration e atualiza o cliente Prisma. A coluna `jiraIssueKey: String?`
já existe e permanece.

## Passo 2 — Alterações em `actions/submissoes.ts`

### `aprovarSubmissao(id: number)` — fail-open

Implementação alvo (manter o padrão de sessão e erro já existente):

```ts
import { criarCardJira } from '@/lib/jira'

export async function aprovarSubmissao(id: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    const clinica = await prisma.clinica.findUnique({
      where: { id },
      include: { exames: true, dispositivos: true },
    })
    if (!clinica) return { erro: 'Submissão não encontrada' }

    // 1) Aprova primeiro (não depende do Jira)
    await prisma.clinica.update({
      where: { id },
      data: {
        status: 'APROVADA',
        reviewedAt: new Date(),
        jiraSyncStatus: 'PENDENTE',
      },
    })

    // 2) Tenta criar o card Jira (fail-open)
    let jiraIssueKey: string | null = null
    let jiraErro: string | null = null
    try {
      jiraIssueKey = await criarCardJira({
        id: clinica.id,
        nomeClinica: clinica.nomeClinica,
        nomeEmpresa: clinica.nomeEmpresa,
        nomeTitular: clinica.nomeTitular,
        emailTitular: clinica.emailTitular,
        quantidadeMedicos: clinica.quantidadeMedicos,
        exames: clinica.exames,
        dispositivos: clinica.dispositivos,
      })
    } catch (e) {
      jiraErro = e instanceof Error ? e.message : 'Erro desconhecido ao criar card Jira'
    }

    await prisma.clinica.update({
      where: { id },
      data: {
        jiraIssueKey,
        jiraSyncStatus: jiraIssueKey ? 'SINCRONIZADO' : 'ERRO',
      },
    })

    revalidatePath('/admin')
    if (jiraErro) return { sucesso: true, jiraIssueKey: null, jiraErro }
    return { sucesso: true, jiraIssueKey }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}
```

### `sincronizarJira(id: number)` — nova action de retry

```ts
export async function sincronizarJira(id: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    const clinica = await prisma.clinica.findUnique({
      where: { id },
      include: { exames: true, dispositivos: true },
    })
    if (!clinica) return { erro: 'Submissão não encontrada' }
    if (clinica.status !== 'APROVADA') return { erro: 'Submissão não está aprovada' }

    const jiraIssueKey = await criarCardJira({
      id: clinica.id,
      nomeClinica: clinica.nomeClinica,
      nomeEmpresa: clinica.nomeEmpresa,
      nomeTitular: clinica.nomeTitular,
      emailTitular: clinica.emailTitular,
      quantidadeMedicos: clinica.quantidadeMedicos,
      exames: clinica.exames,
      dispositivos: clinica.dispositivos,
    })

    await prisma.clinica.update({
      where: { id },
      data: { jiraIssueKey, jiraSyncStatus: 'SINCRONIZADO' },
    })

    revalidatePath('/admin')
    revalidatePath(`/admin/submissao/${id}`)
    return { sucesso: true, jiraIssueKey }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido ao criar card Jira'
    return { erro: `Erro ao criar card Jira: ${msg}` }
  }
}
```

### `rejeitarSubmissao(id, motivo)` — manter

Manter a implementação existente: `status: 'REJEITADA'`, `motivoRejeicao`, `reviewedAt`.

## Regras

- Verificação de sessão (`auth.api.getSession({ headers: await headers() })`) em todas.
- Buscar clínica **incluindo `exames` e `dispositivos`** antes de chamar o Jira.
- **Fail-open:** `aprovarSubmissao` aprova (`status:'APROVADA'`) antes de chamar o Jira;
  falha do Jira NÃO desfaz a aprovação — apenas marca `jiraSyncStatus:'ERRO'`.
- Erro de Jira é detalhado (`e.message`) e retornado em `jiraErro` / prefixado em `erro`.
- `aprovarSubmissao` retorna `{ sucesso: true, jiraIssueKey }` no sucesso ou
  `{ sucesso: true, jiraIssueKey: null, jiraErro }` quando o Jira falha.
- `sincronizarJira` só age em clínicas `APROVADA` com `jiraSyncStatus != 'SINCRONIZADO'`.
- Adicionar `// TODO: Registrar auditoria` em ambas as funções (o model `AuditLog` já existe no schema).
- Preservar os `try/catch` existentes.

## Commit

```
feat(jira): aprovar fail-open, coluna jiraSyncStatus e action sincronizarJira
```
