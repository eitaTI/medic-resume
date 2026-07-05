# Task 4: .env.production + Build/Deploy

❌ **Pendente** — criar `.env.production` e documentar deploy

Criar `.env.production` com:
- `BETTER_AUTH_SECRET` (gerar com `openssl rand -base64 32`)
- `BETTER_AUTH_URL` (URL do domínio)
- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`

Comandos de deploy:
- `docker compose build`
- `docker compose up -d`
- `docker compose logs -f app`
- `docker compose down`

## Commit

```
feat(docker): criar .env.production e documentar comandos de deploy
```
