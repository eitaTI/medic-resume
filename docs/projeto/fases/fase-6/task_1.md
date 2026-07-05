# Task 1: Server Actions de Admins

❌ **Pendente** — criar `actions/admins.ts`

Criar `actions/admins.ts` (`'use server'`):
- **`criarAdmin(dados)`**: verificar sessão, checar email duplicado, hashear senha com bcrypt (10 rounds), criar no Prisma, retornar `{ sucesso, admin }` ou `{ erro }`
- **`excluirAdmin(id)`**: verificar sessão, impedir auto-exclusão (`session.user.id === id`), deletar do Prisma, retornar `{ sucesso }` ou `{ erro }`

## Commit

```
feat(admin): criar server actions de admins (criar/excluir)
```
