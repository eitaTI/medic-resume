# Task 4: .env.production + Build/Deploy

✅ **Concluído** — criar `.env.production` + documentar deploy

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
# Primeiro deploy (usa .env.production para as variáveis do compose)
docker compose --env-file .env.production build
docker compose --env-file .env.production up -d
docker compose logs -f app

# Atualizar
git pull
docker compose --env-file .env.production build
docker compose --env-file .env.production up -d

# Parar
docker compose down

# Ver logs
docker compose logs -f app

# Acessar container
docker compose exec app sh

# Backup manual
docker compose exec app sh scripts/backup.sh
```

> O `BETTER_AUTH_URL` deve apontar para o domínio real (não localhost), senão o cookie de
> sessão não funciona.

## Ajustes aplicados
- `.env.production` é **gitignored** (contém segredos). Foi criado `.env.production.example`
  (versionado, sem segredos) como template; copie-o para `.env.production` e preecha
  `BETTER_AUTH_SECRET` (`openssl rand -base64 32`).
- O compose lê as variáveis via `--env-file .env.production` (interpolação `${VAR}`).

## Commit

```
feat(docker): criar .env.production e documentar comandos de deploy
```
