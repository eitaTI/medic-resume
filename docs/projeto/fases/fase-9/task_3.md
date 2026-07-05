# Task 3: docker-compose.yml Completo

❌ **Pendente** — criar/atualizar `docker-compose.yml`

Criar `docker-compose.yml` (version '3.8'):
- **Serviço `app`**: build `.`, porta 3000, volumes nomeados (`uploads` e `db`), todas as env vars (BETTER_AUTH_SECRET, BETTER_AUTH_URL, JIRA_*), healthcheck com wget, `restart: unless-stopped`
- **Serviço `backup`**: imagem `alpine:latest`, volumes bind, cron diário 02:00 executando backup.sh, `depends_on: app`, `restart: unless-stopped`
- **Volumes**: `uploads:` e `db:` nomeados

## Commit

```
feat(docker): criar docker-compose.yml com app, backup e healthcheck
```
