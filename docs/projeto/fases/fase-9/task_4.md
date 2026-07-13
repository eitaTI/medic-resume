# Task 4: Deploy via Docker (usando .env padrão)

✅ **Concluído** — documentar deploy lendo o `.env` padrão do projeto

O deploy usa o `.env` padrão (o Docker Compose carrega `.env` automaticamente do
diretório do projeto para interpolação das variáveis `${VAR}` no bloco `environment`).

Antes de subir em produção, ajuste no `.env` (copiado de `.env.example`):

```env
# Better Auth — obrigatório definir um segredo real de produção
BETTER_AUTH_SECRET=<gerar com: openssl rand -base64 32>
BETTER_AUTH_URL=https://seu-dominio.com

# Jira (opcional, usado apenas na aprovação)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=EITATI

# Database (em dev; no container o compose sobrescreve para /data/db/dev.db)
DATABASE_URL=file:./dev.db
```

**Comandos de deploy:**

```bash
# Primeiro deploy (usa o .env padrão para as variáveis do compose)
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

> O `BETTER_AUTH_URL` deve apontar para o domínio real (não localhost), senão o cookie de
> sessão não funciona.

## Ajustes aplicados
- Removidos `.env.production` e `.env.production.example` para reduzir complexidade.
- O compose lê as variáveis do `.env` padrão (interpolação `${VAR}`); basta preencher
  os valores de produção nele antes do `docker compose up`.

## Nota — service migrate (Melhorias-4)

A partir da Melhoria-4, o `docker-compose.yml` inclui um service `migrate` (oneshot, estágio
`migrator`) que executa `prisma migrate deploy` + seed antes do `app` subir. O `app` usa
`depends_on: migrate: condition: service_completed_successfully` e o `start.sh` passou a
executar apenas `node server.js`. Requer Docker Compose v2.

## Commit

```
feat(docker): documentar deploy usando o .env padrão
```
