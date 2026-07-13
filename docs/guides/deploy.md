# Deploy — Produção com Docker

Como subir o **EitaTI Formulário** em produção usando Docker Compose (aplicação + backup
agendado). O build usa a saída **standalone** do Next.js 15.

## Pré-requisitos

- **Docker** + **Docker Compose**
- Acesso ao repositório (para `docker compose up --build`)

## O que o compose sobe

- **`migrate`** (oneshot): executa `prisma migrate deploy` + seed do admin e encerra. Usa o
  estágio `migrator` da imagem (contém Prisma CLI, `tsx` e `node_modules` completo).
- **`app`**: aplicação em produção — **apenas o bundle standalone do Next.js** (sem
  `node_modules` do projeto). Porta `3000`, com healthcheck em `GET /api/health`.
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
# URL pública da aplicação (URL do Cloudflare Tunnel — usada pelo Better Auth)
BETTER_AUTH_URL=https://formulario.seu-dominio.com

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

O `app` só sobe após o `migrate` concluir com sucesso (`depends_on` com
`condition: service_completed_successfully` — requer Docker Compose v2). O `start.sh` do app
executa apenas `node server.js`; migrações e seed ficam a cargo do service `migrate`.

Verifique a saúde:

```bash
docker compose ps
curl -f http://localhost:3000/api/health
```

## Exposição via Cloudflare Tunnel

O ingresso em produção é feito via **Cloudflare Tunnel** — não é necessário abrir a porta `3000`
no firewall/host. O que importa no `docker-compose.yml` é a **configuração da porta interna** do
serviço `app` (padrão `3000`); o tunnel aponta para `http://app:3000` na rede do compose.

Exemplo de `cloudflared` apontando para o serviço (rode no host, com o `cloudflared` já
autenticado):

```bash
cloudflared tunnel create eitati-formulario
cloudflared tunnel route dns eitati-formulario formulario.seu-dominio.com
cloudflared tunnel run --url http://localhost:3000 eitati-formulario
```

> Se o `cloudflared` rodar no mesmo `docker compose` (ou na mesma rede Docker), use
> `http://app:3000` em vez de `http://localhost:3000`. A aplicação escuta em `0.0.0.0:3000`
> dentro do container.
>
> O `ports: "3000:3000"` no compose serve para checagens locais (ex.: `curl` de saúde) e pode
> ser omitido se o túnel for o único ingress — mas manter não prejudica.

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

As migrações são aplicadas automaticamente pelo service `migrate` antes do `app` subir. Os
volumes (`uploads`, `sqlite-data`) são preservados entre deploys.

O app roda 100% com o bundle standalone do Next.js (`.next/standalone`, ~68 MB). O Prisma CLI,
`tsx` e o `node_modules` completo ficam apenas no estágio `migrator`, usado pelo service
`migrate` (oneshot). A imagem do `app` (estágio `runner`) contém **apenas** o necessário para
rodar `node server.js` — sem `node_modules` do projeto.
- O app escuta em `0.0.0.0:3000` dentro do container; o **Cloudflare Tunnel** é quem expõe
  publicamente (TLS gerenciado pela Cloudflare) — não é preciso proxy reverso próprio (Nginx/Caddy).
- `next.config.ts` usa `output: 'standalone'` e `serverExternalPackages` para os módulos nativos.
- `.npmrc` com `shamefully-hoist=true` é necessário para essas dependências nativas.
