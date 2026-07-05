# Task 1: Cliente Jira

❌ **Pendente** — criar `lib/jira.ts`

Criar `lib/jira.ts`:
- Usar `ofetch` para chamar a API REST do Jira
- Config: `baseUrl`, `email`, `apiToken`, `projectKey` vindos de variáveis de ambiente
- Função `criarCardJira(clinica)` que recebe: `id`, `nomeClinica`, `nomeEmpresa`, `nomeTitular`, `emailTitular`, `quantidadeMedicos`, `exames` (array), `dispositivos` (array)
- Autenticação Basic Auth com base64 do `email:apiToken`
- Descrição formatada no body (clínica, empresa, titular, email, médicos, exames, dispositivos)
- Criar issue no Jira em formato Atlassian Document Format (ADF) com `issuetype: 'Task'`
- Summary: `[ZScan] Cadastro - {nomeClinica}`
- Labels: `cadastro`, `clinica`
- Retornar `response.key` (ex: `ZSCAN-42`)

## Commit

```
feat(jira): criar cliente Jira com função criarCardJira
```
