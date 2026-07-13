# Task 1: Dockerfile — app mínimo (standalone) + estágio migrator

❌ **Pendente**

## Problema

O `Dockerfile` copia `node_modules` inteiro (~802 MB) para o estágio `runner` só porque o
`start.sh` roda `prisma migrate deploy` e `tsx prisma/seed.ts` em runtime. O app em si roda 100%
com o bundle `standalone` do Next (`.next/standalone/node_modules`, ~68 MB), que já inclui
`better-sqlite3` e `@prisma/*` via `serverExternalPackages` (`next.config.ts`).

## O que fazer

1. No estágio `runner`, remover:
   - `COPY --from=builder /app/node_modules ./node_modules`
   - `COPY --from=builder /app/prisma ./prisma`
   - `COPY --from=builder /app/prisma.config.ts ./prisma.config.ts`
   (o app não usa Prisma em runtime)
2. Adicionar estágio `migrator` reusando o `builder` (que já tem `node_modules` completo +
   `prisma`/`tsx` + `prisma/` + `lib/` + `scripts/` via `COPY . .`):
   ```dockerfile
   FROM builder AS migrator
   ```
3. Manter no `runner`: standalone, static, public, scripts, start.sh.

## Critérios de aceite

- [ ] `runner` não copia `node_modules` do projeto
- [ ] existe estágio `migrator` reaproveitando o `builder`
- [ ] `docker compose build` (targets `runner` e `migrator`) conclui sem erro

## Commit

```
build(docker): app standalone mínimo + estágio migrator
```
