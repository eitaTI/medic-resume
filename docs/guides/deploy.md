# Deploy — Produção com Docker

Como subir o **EitaTI Formulário** em produção usando Docker Compose (aplicação + backup
agendado). O build usa a saída **standalone** do Next.js 15.

## Pré-requisitos

- **Docker** + **Docker Compose**
- Acesso ao repositório (para `docker compose up --build`)

## O que o compose sobe

- **`app`**: aplicação em produção (`node server.js` após `prisma migrate deploy` + seed).
  Porta `3000`, com healthcheck em `GET /api/health`.
- **`backup`**: container `alpine` com `cron` que executa `scripts/backup.sh` diariamente às 2h,
  salvando em `./backups` (banco + uploads).

Volumes persistidos:

| Volume | Conteúdo |
|--------|----------|
| `uploads` | arquivos enviados (`/app/data/uploads`) |
| `sqlite-data` | banco SQLite (`/data/db/dev.db`) |

> ⚠️ Não remova esses volumes ou você perderá submissões e arquivos.

## 1. Variáveis de produção

Edite o `.env` **antes** do deploy. O `docker-compose.yml` carrega o `.env` automaticamente e
repassa as variáveis para o container:

```bash
# URL pública da aplicação
BETTER_AUTH_URL=https://seu-dominio.com

# Segredo forte (gere com: openssl rand -base64 32)
BETTER_AUTH_SECRET=<seu-segredo-de-32-chars>

# Jira (opcional)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=EITATI
```

O compose sobrescreve `DATABASE_URL` para `file:/data/db/dev.db` (volume persistido) — não
precise alterar no `.env` para produção.

## 2. Subir a aplicação

```bash
docker compose up -d --build
```

Na inicialização, `scripts/start.sh` executa:

1. `prisma migrate deploy` (aplica migrações no volume)
2. seed do admin inicial (`prisma/seed.ts`); falhas não interrompem o start
3. `node server.js`

Verifique a saúde:

```bash
docker compose ps
curl -f http://localhost:3000/api/health
```

## 3. Backup

O serviço `backup` agenda `scripts/backup.sh` todo dia às 2h (cron). Os arquivos vão para
`./backups`. Para rodar manualmente:

```bash
docker compose exec backup sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/data/uploads BACKUP_DIR=/backups bash /scripts/backup.sh"
```

Para restaurar (em caso de desastre), use `scripts/restore.sh` — veja
[`docs/dev/BANCO-DE-DADOS.md`](../../docs/dev/BANCO-DE-DADOS.md) e a Fase 8
(`docs/projeto/fases/fase-8/`).

> Sem o `sqlite3` instalado no container de restore, o script usa `cp` como fallback (cópia
> fria do arquivo + uploads).

## 4. Atualizar / redeploy

```bash
docker compose down
git pull
docker compose up -d --build
```

As migrações são aplicadas automaticamente no `start.sh` (`migrate deploy`). Os volumes
(`uploads`, `sqlite-data`) são preservados entre deploys.

## Notas técnicas

- O `Dockerfile` copia `node_modules` inteiro no estágio final para garantir os módulos nativos
  (`better-sqlite3`, Prisma adapter) em runtime — **não remova** essa cópia.
- O app escuta em `0.0.0.0:3000` dentro do container; exponha via proxy reverso (Nginx/Caddy) com
  TLS na frente, se desejar HTTPS.
- `next.config.ts` usa `output: 'standalone'` e `serverExternalPackages` para os módulos nativos.
- `.npmrc` com `shamefully-hoist=true` é necessário para essas dependências nativas.
