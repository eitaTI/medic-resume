# Task 6: Seed do Admin

✅ **Concluído** — `prisma/seed.ts`

Criar `prisma/seed.ts` com:
- Reutilizar `prisma` do singleton em `../lib/prisma` (em vez de criar `PrismaClient` próprio)
- Hash da senha com scrypt via `@better-auth/utils/password` (formato `salt:key`)
- Upsert do admin padrão: `admin@eitati.com` / `admin123`

> **Nota:** O seed usa o mesmo `PrismaClient` singleton da aplicação (importado via caminho relativo, já que `@/` não é resolvido pelo `tsx`). Evita duplicidade de configuração do adapter.

## Commit

```
feat(db): criar seed com admin padrão (admin@eitati.com / admin123)
```
