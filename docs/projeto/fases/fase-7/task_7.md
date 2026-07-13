# Task 7: Registrar Login na Auditoria

✅ **Concluído** — atualizar `actions/login.ts`

Em `actions/login.ts`:
- Importar `registrarAcao` e `prisma`
- Após autenticação bem-sucedida, buscar admin por email
- Se encontrado, chamar `registrarAcao({ userId, acao: 'LOGIN', entidade: 'User', entidadeId: user.id })`

## Commit

```
feat(audit): registrar login do admin na auditoria
```
