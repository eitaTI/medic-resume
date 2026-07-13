# Task 1: Cliente Jira (`lib/jira.ts`)

✅ **Concluído** — criar `lib/jira.ts` usando `jira.js`

## Objetivo

Criar em `lib/jira.ts` um cliente do Jira baseado na biblioteca `jira.js`, com uma
função `criarCardJira(clinica)` que cria a issue e retorna a chave (ex.: `EITATI-42`).

**Não** criar serviço/servidor separado. Toda a chamada acontece no server (Server Action).

## Passo 1 — Dependência

Adicionar `jira.js` ao `package.json` principal (raiz do projeto), em `dependencies`,
e instalar:

```bash
pnpm add jira.js
```

(O projeto já usa `pnpm`. Não criar `package.json` separado.)

## Passo 2 — Arquivo `lib/jira.ts`

Referência de implementação (padrão inspirado no esboço anterior, agora integrado):

```ts
import { Version3Client } from 'jira.js'

const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY!

const jira = new Version3Client({
  host: process.env.JIRA_BASE_URL!,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL!,
      apiToken: process.env.JIRA_API_TOKEN!,
    },
  },
})

export interface DadosClinicaJira {
  id: number
  nomeClinica: string
  nomeEmpresa: string | null
  nomeTitular: string
  emailTitular: string
  quantidadeMedicos: number
  exames: { nome: string }[]
  dispositivos: { tipo: string; marca: string; modelo: string; numeroSerie: string }[]
}

function montarDescricaoADF(clinica: DadosClinicaJira) {
  const linhas: string[] = [
    `Clínica: ${clinica.nomeClinica}`,
    `Empresa: ${clinica.nomeEmpresa ?? '—'}`,
    `Titular: ${clinica.nomeTitular} (${clinica.emailTitular})`,
    `Médicos: ${clinica.quantidadeMedicos}`,
    `Exames: ${clinica.exames.map((e) => e.nome).join(', ') || '—'}`,
    `Dispositivos: ${
      clinica.dispositivos
        .map((d) => `${d.tipo} ${d.marca} ${d.modelo} (SN: ${d.numeroSerie})`)
        .join('; ') || '—'
    }`,
  ]

  return {
    type: 'doc',
    version: 1,
    content: linhas.map((text) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })),
  }
}

export async function criarCardJira(clinica: DadosClinicaJira): Promise<string> {
  const issue = await jira.issues.createIssue({
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: `[EitaTI] Cadastro - ${clinica.nomeClinica}`,
      issuetype: { name: 'Task' },
      labels: ['cadastro', 'clinica'],
      description: montarDescricaoADF(clinica),
    },
  })

  return issue.key // ex: "EITATI-42"
}
```

## Detalhes obrigatórios

- Autenticação **Basic Auth** via `authentication.basic` do `jira.js` (`email` + `apiToken`).
- `host` vem de `JIRA_BASE_URL` (ex.: `https://sua-empresa.atlassian.net`).
- `project.key` vem de `JIRA_PROJECT_KEY` (ex.: `EITATI`).
- `summary`: `[EitaTI] Cadastro - {nomeClinica}`.
- `issuetype`: `Task`.
- `labels`: `['cadastro', 'clinica']`.
- `description`: **Atlassian Document Format (ADF)** conforme `montarDescricaoADF`.
- Retornar `issue.key` (string).

## Tratamento de erro

`criarCardJira` pode lançar (falha de rede, credencial inválida, projeto inexistente).
Quem chama (`aprovarSubmissao` / `sincronizarJira`) deve capturar e decidir o que fazer
(ver Task 2). Decisão de negócio: **fail-open** — a aprovação já ocorreu antes da
chamada, então uma falha aqui apenas marca `jiraSyncStatus:'ERRO'` e retorna a mensagem
real do erro (`e.message`), nunca desfazendo a aprovação. Não usar `try/catch` silencioso
que esconda o erro.

## Commit

```
feat(jira): criar cliente Jira com jira.js e função criarCardJira
```
