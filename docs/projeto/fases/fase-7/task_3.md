# Task 3: Action de Auditoria

✅ **Concluído** — criar `actions/auditoria.ts`

Criar `actions/auditoria.ts` (`'use server'`):
- Função `listarAuditoria(filtros?)` com filtros opcionais: `userId`, `acao`, `dataInicio`, `dataFim`
- Montar `where` dinâmico no Prisma (data usa `gte`/`lte` em `createdAt`)
- Incluir relação `admin` (para nome)
- Ordenar por `createdAt desc`
- Limitar a 50 registros

## Commit

```
feat(audit): criar action listarAuditoria com filtros por ação e período
```
