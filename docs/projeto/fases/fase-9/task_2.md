# Task 2: .dockerignore

✅ **Concluído** — criar `.dockerignore`

## Ajustes aplicados
- `pnpm-lock.yaml` **não** é excluído (o Stage 1 usa `pnpm install --frozen-lockfile`, que
  exige o lockfile presente no contexto de build).

Criar `.dockerignore`:

```
node_modules
.next
.git
.env
.env.local
.env.production
backups/
data/uploads/
*.db
*.db-journal
prisma/dev.db
pnpm-lock.yaml
```
> **Importante:** `pnpm-lock.yaml` é excluído porque no Stage 1 usamos `--frozen-lockfile`. Se for fazer rebuild local, pode remover essa linha.

## Commit

```
chore(docker): criar .dockerignore para build otimizado
```
