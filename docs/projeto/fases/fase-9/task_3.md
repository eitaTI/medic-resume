# Task 3: docker-compose.yml Completo

✅ **Concluído** — criar `docker-compose.yml`

Criar `docker-compose.yml` (sem `version`, Compose v2):

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - uploads:/app/data/uploads
      - sqlite-data:/app/prisma
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./dev.db
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
      - JIRA_BASE_URL=${JIRA_BASE_URL}
      - JIRA_EMAIL=${JIRA_EMAIL}
      - JIRA_API_TOKEN=${JIRA_API_TOKEN}
      - JIRA_PROJECT_KEY=${JIRA_PROJECT_KEY}
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

volumes:
  uploads:
  sqlite-data:
```

**Entrypoint (scripts/start.sh):**
Antes de iniciar o Node, o container precisa executar:
```bash
npx prisma migrate deploy
npx prisma db seed || true
```

> **Nota:** O serviço `backup` foi movido para a **Fase 8** — será adicionado lá.

## Commit

```
feat(docker): criar docker-compose.yml com app, healthcheck e volumes persistidos
```

## Ajustes aplicados vs. spec original
- `DATABASE_URL=file:/data/db/dev.db` (absoluto) e volume `sqlite-data:/data/db`, alinhados
  ao serviço `backup` da Fase 8 (que lê `DB_PATH=/data/db/dev.db`). O banco fica em `./dev.db`
  relativo ao cwd, que no container é `/app` → `/app/dev.db`; usar caminho absoluto evita
  ambiguidade e mantém backup/restauração consistentes.
- Adicionado `HOSTNAME=0.0.0.0` no `app` — o `server.js` standalone binda em `localhost` por
  padrão, o que bloqueia o acesso externo via port mapping.
- `healthcheck` aponta para `/api/health` (rota criada em `app/api/health/route.ts`).
- Serviço `backup` (Fase 8) mantido e integrado, com os mesmos volumes `sqlite-data`/`uploads`.
- Entrypoint de migrate/seed vive em `scripts/start.sh` (referenciado pelo `CMD` do Dockerfile).
