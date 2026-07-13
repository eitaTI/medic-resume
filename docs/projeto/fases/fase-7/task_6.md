# Task 6: Integrar Auditoria nas Server Actions

✅ **Concluído**  — `actions/submissoes.ts` e `actions/admins.ts`

**Em `actions/submissoes.ts`:**
- Em `aprovarSubmissao`: após atualizar status, registra `APROVAR` na entidade `Clinica` com `detalhes: { jiraIssueKey, nomeClinica }`
- Em `rejeitarSubmissao`: após atualizar status, registra `REJEITAR` na entidade `Clinica` com `detalhes: { motivo, nomeClinica }`

**Em `actions/admins.ts`:**
- Em `criarAdmin`: após criar, registra `CRIAR` na entidade `User` com `detalhes: { email, nome }`
- Em `excluirAdmin`: após deletar, registra `EXCLUIR` na entidade `User` com `detalhes: { email, nome }`

> Observação: eventos de `User` usam `entidadeId: null` (o `User.id` é String e
> `AuditLog.entidadeId` é `Int`); o autor fica em `userId`.
