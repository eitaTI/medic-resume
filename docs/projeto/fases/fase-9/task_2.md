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
.env.*
backups/
data/uploads/
*.db
*.db-journal
prisma/dev.db
```
> **Importante:** `pnpm-lock.yaml` **não** é excluído — o Stage 1 usa `pnpm install --frozen-lockfile`, que exige o lockfile presente no contexto de build. Por isso ele não aparece na lista acima.

## Commit

```
chore(docker): criar .dockerignore para build otimizado
```
