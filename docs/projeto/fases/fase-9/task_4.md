# Task 4: .env.production + Build/Deploy

❌ **Pendente** — criar `.env.production` e documentar deploy

Criar `.env.production` com:

```env
# Better Auth
BETTER_AUTH_SECRET=<gerar com: openssl rand -base64 32>
BETTER_AUTH_URL=https://seu-dominio.com

# Jira
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=ZSCAN

# Database
DATABASE_URL=file:./dev.db
```

**Comandos de deploy:**

```bash
# Primeiro deploy
docker compose build
docker compose up -d
docker compose logs -f app

# Atualizar
git pull
docker compose build
docker compose up -d

# Parar
docker compose down

# Ver logs
docker compose logs -f app

# Acessar container
docker compose exec app sh

# Backup manual
docker compose exec app sh scripts/backup.sh
```

**Importante:** O `BETTER_AUTH_URL` deve apontar para o domínio real (não localhost), caso contrário o cookie de sessão não funcionará.

## Commit

```
feat(docker): criar .env.production e documentar comandos de deploy
```
