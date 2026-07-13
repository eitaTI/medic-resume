# Task 3: docker-compose.yml — service migrate + depends_on

❌ **Pendente**

## O que fazer

1. `app`: apontar o build para o estágio `runner` e garantir que só sobe após o `migrate` concluir:
   ```yaml
   app:
     build:
       context: .
       target: runner
     depends_on:
       migrate:
         condition: service_completed_successfully
   ```
2. Novo service `migrate` (oneshot) que roda migrações + seed usando o estágio `migrator`:
   ```yaml
   migrate:
     build:
       context: .
       target: migrator
     environment:
       - DATABASE_URL=file:/data/db/dev.db
       - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
     volumes:
       - sqlite-data:/data/db
       - uploads:/data/uploads:ro
     command: sh -c "pnpm exec prisma migrate deploy && pnpm exec tsx prisma/seed.ts"
     restart: "no"
   ```
3. Manter `ports`, `healthcheck` e o service `backup` como estão.

> Requer Docker Compose v2 (`condition: service_completed_successfully`).

## Critérios de aceite

- [ ] `app` depende do `migrate` concluído com sucesso
- [ ] `migrate` roda `prisma migrate deploy` + `tsx prisma/seed.ts` e encerra (`restart: "no"`)
- [ ] `docker compose config` é válido

## Commit

```
build(docker): adicionar service migrate e depends_on no app
```
