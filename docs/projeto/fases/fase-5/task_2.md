# Task 2: Atualizar Server Action com Jira

❌ **Pendente** — atualizar `actions/submissoes.ts`

Alterar `actions/submissoes.ts`:
- **`aprovarSubmissao(id)`**: buscar clínica incluindo `exames` e `dispositivos`, chamar `criarCardJira(clinica)`, salvar `jiraIssueKey` retornado no banco junto com `status: 'APROVADA'` e `reviewedAt`
- Retornar `{ sucesso: true, jiraIssueKey }`
- **`rejeitarSubmissao(id, motivo)`**: manter implementação existente (status `'REJEITADA'`, `motivoRejeicao`, `reviewedAt`)
- Adicionar `// TODO: Registrar auditoria` em ambas
- Garantir verificação de sessão (`auth()`) em ambas

## Commit

```
feat(jira): integrar criação de card Jira na action aprovarSubmissao
```
