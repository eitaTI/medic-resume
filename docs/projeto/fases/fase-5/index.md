# Fase 5: Integração Jira

Criação automática de cards no Jira após aprovação de submissões.

## Status Geral

| Componente | Status |
|-----------|--------|
| Cliente Jira (`lib/jira.ts`) | ❌ Pendente |
| Atualizar Server Action (`actions/submissoes.ts`) | ❌ Pendente |
| Botões com feedback Jira (`AprovarRejeitarButtons.tsx`) | ❌ Pendente |
| Variáveis de ambiente | ❌ Pendente |

## Fluxo

```
Admin clica "Aprovar" → aprovarSubmissao(id) → buscar clínica + exames + dispositivos
    → criarCardJira(clinica) → Jira retorna ZSCAN-42
    → salvar status='APROVADA' + jiraIssueKey no banco
    → UI exibe "Card criado: ZSCAN-42"
```

## Tasks (Commits)

| # | Arquivo | Descrição | Status |
|---|---------|-----------|--------|
| 1 | `task_1.md` | Cliente Jira (`lib/jira.ts`) | ❌ Pendente |
| 2 | `task_2.md` | Atualizar Server Action com Jira | ❌ Pendente |
| 3 | `task_3.md` | Botões Aprovar/Rejeitar com feedback | ❌ Pendente |
| 4 | `task_4.md` | Variáveis de ambiente | ❌ Pendente |
