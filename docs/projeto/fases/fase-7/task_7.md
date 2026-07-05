# Task 7: Registrar Login na Auditoria

❌ **Pendente** — atualizar `actions/login.ts`

Em `actions/login.ts`:
- Importar `registrarAcao` e `prisma`
- Após autenticação bem-sucedida, buscar admin por email
- Se encontrado, chamar `registrarAcao({ adminId, acao: 'LOGIN', entidade: 'Admin', entidadeId: admin.id })`

## Commit

```
feat(audit): registrar login do admin na auditoria
```
