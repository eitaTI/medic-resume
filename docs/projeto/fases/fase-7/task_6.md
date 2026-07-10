# Task 6: Integrar Auditoria nas Server Actions

✅ **Concluído**  — atualizar `actions/submissoes.ts` e `actions/admins.ts`

**Em `actions/submissoes.ts`:**
- Importar `registrarAcao` de `@/lib/audit`
- Em `aprovarSubmissao`: após atualizar status, registrar ação `APROVAR` na entidade `Clinica` com `detalhes: { jiraIssueKey, nomeClinica }`
- Em `rejeitarSubmissao`: após atualizar status, registrar ação `REJEITAR` na entidade `Clinica` com `detalhes: { motivo, nomeClinica }`

**Em `actions/admins.ts`:**
- Importar `registrarAcao` de `@/lib/audit`
- Em `criarAdmin`: após criar, registrar ação `CRIAR` na entidade `Admin` com `detalhes: { email }`
- Em `excluirAdmin`: após deletar, registrar ação `EXCLUIR` na entidade `Admin`

## Commit

```
feat(audit): integrar auditoria nas server actions de submissões e admins
```
