# Task 3: docker-compose.yml Completo

❌ **Pendente** — criar `docker-compose.yml`

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
