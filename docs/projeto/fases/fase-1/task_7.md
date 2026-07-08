# Task 7: Prisma Client Singleton

✅ **Concluído** — `lib/prisma.ts`

Criar `lib/prisma.ts`:
- Singleton do `PrismaClient` com adapter `PrismaBetterSqlite3`
- Reutilizar em dev via `globalThis`
- URL do banco via `DATABASE_URL` com fallback `file:./dev.db` (arquivo na raiz, não em `prisma/`)

## Commit

```
feat(db): criar singleton do PrismaClient com adapter BetterSQLite3
```
