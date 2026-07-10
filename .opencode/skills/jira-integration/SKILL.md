---
name: jira-integration
description: Implement the Fase 5 Jira integration correctly — fail-open approval, jiraSyncStatus column, sincronizarJira retry, criarCardJira client, and JIRA_* env vars (no microservice).
license: MIT
compatibility: opencode
---

# Jira Integration (Fase 5)

Goal: create a Jira card when a submission is approved. **Integrated inside the Next.js
app** — no microservice, no separate server/port.

## Architecture decisions (do not violate)
- **Fail-open approval:** `aprovarSubmissao` approves FIRST (`status='APROVADA'`), then
  tries to create the card in an inner `try/catch`. A Jira failure does NOT undo the
  approval — it sets `jiraSyncStatus='ERRO'` and returns the real error message.
- **Detailed errors:** return `e instanceof Error ? e.message : 'Erro desconhecido'`,
  not the generic "Erro interno do servidor".
- **Retry:** `sincronizarJira(id)` recreates the card for `APROVADA` clinics whose
  `jiraSyncStatus != 'SINCRONIZADO'`.

## Data model (`Clinica`)
- `jiraIssueKey String?` — already exists; stores the issue key (e.g. `ZSCAN-42`).
- `jiraSyncStatus String?` — **to be added** (migration); values
  `PENDENTE` | `SINCRONIZADO` | `ERRO`.

## Files
- `lib/jira.ts` (new): `Version3Client` from `jira.js`, `criarCardJira(clinica)` builds an
  ADF description and returns `issue.key`. Basic auth via `JIRA_EMAIL` + `JIRA_API_TOKEN`.
- `actions/submissoes.ts`: `aprovarSubmissao` (fail-open) + `sincronizarJira`.
- `components/admin/AprovarRejeitarButtons.tsx`: inline feedback for success/warning and a
  "Tentar novamente Jira" button; receives a new `jiraSyncStatus` prop from the detail page.

## Environment (`.env.example`, already present)
```
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=ZSCAN
```
Use these exact names (NOT `JIRA_HOST`). `ofetch` is installed but intentionally NOT used
for Jira — use `jira.js`.

## Conventions
- Server Action returns `{ sucesso, jiraIssueKey }` or `{ sucesso: true, jiraIssueKey: null,
  jiraErro }`; never `alert()`. Follow the `server-action` skill.
- After schema change: `pnpm prisma migrate dev --name add_jira_sync_status` (see
  `prisma-workflow` skill).
