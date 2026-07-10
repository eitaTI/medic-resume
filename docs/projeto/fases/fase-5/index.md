# Fase 5: Integração Jira

Criação automática de cards no Jira após aprovação de submissões, **integrada dentro do projeto Next.js** (sem serviço/servidor separado). A comunicação com o Jira é feita via biblioteca `jira.js` diretamente de `lib/jira.ts`.

## Decisões de arquitetura (importante)

- **Não** haverá microserviço, servidor Hono nem porta separada (ex.: 3001).
- A integração é feita **dentro do projeto**, em `lib/jira.ts`, usando a biblioteca `jira.js`.
- O padrão de chamadas (`Version3Client` + `issues.createIssue`) foi inspirado no esboço anterior (`fase-5/jira-ts`), mas incorporado ao app — aquele esboço foi **excluído**.
- `ofetch` **não** é usado para o Jira (já está no projeto, mas fica de fora desta fase).
- As variáveis de ambiente já existem em `.env.example`.

## Decisões de negócio (importante)

- **Aprovação não depende do Jira (falha-aberto):** `aprovarSubmissao` aprova a submissão
  primeiro (`status='APROVADA'`) e só então tenta criar o card. Se o Jira falhar, a
  aprovação **não** é desfeita — a clínica fica marcada com `jiraSyncStatus='ERRO'` para
  posterior retry. Decisão oposta ao esboço anterior ("não aprovar sem card").
- **Erro de Jira detalhado:** falhas do Jira retornam a mensagem real
  (`e instanceof Error ? e.message : 'Erro desconhecido'`) e não o genérico
  "Erro interno do servidor".
- **Retry:** nova action `sincronizarJira(id)` recria o card para clínicas aprovadas cujo
  `jiraSyncStatus` não seja `SINCRONIZADO`.

## Status Geral

| Componente | Status |
|-----------|--------|
| Dependência `jira.js` no projeto | ❌ Pendente |
| Cliente Jira (`lib/jira.ts`) | ❌ Pendente |
| Migração Prisma (`jiraSyncStatus`) | ❌ Pendente |
| Atualizar Server Action (`actions/submissoes.ts`) | ❌ Pendente |
| Action `sincronizarJira(id)` (retry) | ❌ Pendente |
| Botões com feedback Jira (`AprovarRejeitarButtons.tsx`) | ❌ Pendente |
| Variáveis de ambiente (`.env.example`) | ✅ Pronto (já existe) |

## Fluxo

```
Admin clica "Aprovar" → aprovarSubmissao(id) [server action]
  → auth.api.getSession(headers)
  → buscar clínica + exames + dispositivos (prisma)
  → prisma.clinica.update: status='APROVADA', reviewedAt, jiraSyncStatus='PENDENTE'
  → tentar criarCardJira(clinica)  [lib/jira.ts → jira.js → Jira REST] (try/catch interno)
       → sucesso: Jira retorna issue.key (ex: ZSCAN-42)
            → update: jiraIssueKey=key, jiraSyncStatus='SINCRONIZADO'
            → retorna { sucesso: true, jiraIssueKey }
       → falha: captura e.message
            → update: jiraSyncStatus='ERRO'  (aprovação NÃO é desfeita)
            → retorna { sucesso: true, jiraIssueKey: null, jiraErro: '<msg>' }
  → UI: "Card criado: ZSCAN-42" (sucesso) OU "Card Jira pendente — tente novamente" (aviso)

Admin clica "Tentar novamente Jira" → sincronizarJira(id)
  → valida status==='APROVADA' e jiraSyncStatus!='SINCRONIZADO'
  → criarCardJira(clinica)
       → sucesso: update jiraIssueKey + jiraSyncStatus='SINCRONIZADO'
       → falha: retorna { erro: 'Erro ao criar card Jira: ...' }
```

## Modelo de dados relevante (Prisma `Clinica`)

A função `criarCardJira` recebe a clínica já carregada com:

- `id: number`
- `nomeEmpresa: string | null`
- `nomeClinica: string`
- `nomeTitular: string`
- `emailTitular: string`
- `quantidadeMedicos: number`
- `exames: Exame[]` → `{ nome: string }`
- `dispositivos: Dispositivo[]` → `{ tipo: string, marca: string, modelo: string, numeroSerie: string }`

Colunas já existentes / a adicionar no model `Clinica`:

- `jiraIssueKey: String?` — já existe; armazena a chave retornada pelo Jira (ex.: `ZSCAN-42`).
- `jiraSyncStatus: String?` — **a adicionar** (migration); valores:
  `PENDENTE` (tentando), `SINCRONIZADO` (card criado), `ERRO` (falhou, precisa retry).

## Tasks (Commits)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 1 | `lib/jira.ts` + `package.json` | Cliente Jira com `jira.js` e `criarCardJira` | ❌ Pendente |
| 2 | `prisma/schema.prisma` + migration, `actions/submissoes.ts` | `jiraSyncStatus` + `aprovarSubmissao` (fail-open) + `sincronizarJira` | ❌ Pendente |
| 3 | `components/admin/AprovarRejeitarButtons.tsx` | Feedback inline + retry do card Jira | ❌ Pendente |
| 4 | `.env.example` | Variáveis de ambiente (já presentes) | ✅ Pronto |

## Convenções do projeto (aplicar em todo código)

- Caminhos com `@/...` (ex.: `@/lib/prisma`, `@/lib/auth`).
- Server Actions em `actions/*.ts` iniciam com `'use server'`.
- Client components usam `'use client'` e o padrão `useActionState` para loading/pending.
- Tratar erros com retorno `{ erro: '...' }` ou lançamento controlado — **não usar `alert()`**.
