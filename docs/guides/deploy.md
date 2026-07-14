# Deploy — Produção com Docker

Como subir o **EitaTI Formulário** em produção com Docker Compose. É um app Next.js 15
que roda via `next start`; as migrações do banco e o seed do admin rodam automaticamente
na inicialização (script `scripts/start.sh`).

## Pré-requisitos

- Docker + Docker Compose v2

## O que o compose sobe

Um único serviço `app`, construído a partir do `Dockerfile`:

- Compila a aplicação (etapa `builder`) e roda com o `node_modules` completo
  (etapa `runner`, imagem `node:22-alpine`).
- Ao iniciar, `scripts/start.sh` executa `prisma migrate deploy` + seed do admin e sobe
  o servidor (`next start`) na porta `3000`.
- Healthcheck em `GET /api/health`.

Volumes persistidos (não remova ou perderá submissões e arquivos):

| Volume        | Conteúdo                                  |
|---------------|-------------------------------------------|
| `uploads`     | arquivos enviados (`/app/data/uploads`)   |
| `sqlite-data` | banco SQLite (`/data/db/dev.db`)          |

## 1. Variáveis de ambiente

Crie/edite o `.env` (baseie-se em `.env.example`) **antes** do deploy. O compose repassa
as variáveis para o container e sobrescreve `DATABASE_URL` para `file:/data/db/dev.db`
(volume persistido).

```bash
# URL pública da aplicação (usada pelo Better Auth — ex.: URL do Cloudflare Tunnel)
BETTER_AUTH_URL=https://formulario.seu-dominio.com

# Segredo forte (gere com: openssl rand -base64 32)
BETTER_AUTH_SECRET=<seu-segredo-de-32-chars>

# Jira (opcional)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=EITATI
```

> O `.env.example` traz também `JIRA_ISSUE_TYPE`, `JIRA_LABELS` e `DATABASE_URL`. Estes
> não são lidos pelo compose em produção (o `DATABASE_URL` é fixado no volume).

## 2. Subir a aplicação

```bash
docker compose up -d --build
```

Verifique a saúde:

```bash
docker compose ps
curl -f http://localhost:3000/api/health
```

## 3. Exposição (opcional)

O ingresso em produção pode ser feito via **Cloudflare Tunnel**, sem abrir a porta `3000`
no host. O tunnel aponta para `http://app:3000` (rede do compose). O `ports: "3000:3000"`
serve para checagens locais (`curl`) e pode ser omitido se o túnel for o único ingress.

## 4. Backup e restauração

Os scripts `scripts/backup.sh` e `scripts/restore.sh` são **manuais** (não há serviço
agendado no compose). Eles fazem cópia fria do banco e dos uploads.

Backup:

```bash
docker compose exec app sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/app/data/uploads BACKUP_DIR=/backups sh /app/scripts/backup.sh /backups"
```

> Para persistir os backups no host, monte um volume no `BACKUP_DIR` (ex.:
> `./backups:/backups` no serviço `app`) ou copie o arquivo com `docker compose cp`.

Restauração (informe o `<TIMESTAMP>` do backup, visto no nome do arquivo):

```bash
docker compose exec app sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/app/data/uploads BACKUP_DIR=/backups sh /app/scripts/restore.sh <TIMESTAMP>"
```

Detalhes do banco: [`docs/dev/BANCO-DE-DADOS.md`](../../docs/dev/BANCO-DE-DADOS.md).

## 5. Atualizar / redeploy

```bash
docker compose down
git pull
docker compose up -d --build
```

As migrações rodam automaticamente no startup (`start.sh`). Os volumes (`uploads`,
`sqlite-data`) são preservados entre deploys.

## Notas técnicas

- A imagem usa `node:22-alpine` e reconstrói `better-sqlite3` no build; o `.npmrc` com
  `shamefully-hoist=true` é necessário para os módulos nativos.
- `next.config.ts` **não** usa `output: 'standalone'` — o container roda com o
  `node_modules` completo do projeto.
- O app escuta em `0.0.0.0:3000` dentro do container.
