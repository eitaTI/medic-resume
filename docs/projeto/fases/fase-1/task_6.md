# Task 6: Seed do Admin

✅ **Concluído** — `prisma/seed.ts`

Criar `prisma/seed.ts` com:
- Reutilizar `prisma` do singleton em `../lib/prisma` (em vez de criar `PrismaClient` próprio)
- Hash da senha com bcrypt (10 rounds)
- Upsert do admin padrão: `admin@zscan.com` / `admin123`

> **Nota:** O seed usa o mesmo `PrismaClient` singleton da aplicação (importado via caminho relativo, já que `@/` não é resolvido pelo `tsx`). Evita duplicidade de configuração do adapter.

## Commit

```
feat(db): criar seed com admin padrão (admin@zscan.com / admin123)
```
