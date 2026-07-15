# Deploy — Produção com Docker

Como subir o **EitaTI Formulário** em produção com Docker Compose. É um app
Next.js 15 que roda via `next start`; as migrações e o seed do admin rodam
automaticamente na inicialização (`scripts/start.sh`).

## Pré-requisitos

- Docker + Docker Compose v2

## Como funciona

Um único serviço `app`. O gerenciamento do container pode ser feito de duas formas através de arquivos do Docker Compose distintos:

| Modo | Quando usar | O que acontece |
|------|-------------|------------------|
| **A — Imagem do GHCR (Deploy Simplificado)** | VPS / Produção (sem build) | Baixa apenas o `docker-compose.yml` e roda a imagem já compilada no CI, sem necessidade de clonar o repositório |
| **B — Build local** | Máquina local / Desenvolvimento | Clona o repositório completo e constrói a imagem localmente a partir do `Dockerfile` utilizando o `docker-compose.local.yml` |

A imagem (seja local ou do CI) é `node:22-alpine` com o `node_modules` completo.
Ao iniciar, `scripts/start.sh` executa `prisma migrate deploy` + seed do admin e
sobe o servidor (`next start`) na porta `3000`. Healthcheck em `GET /api/health`.

Volumes persistidos (não remova ou perderá submissões e arquivos):

| Volume        | Conteúdo                                |
|---------------|-----------------------------------------|
| `uploads`     | arquivos enviados (`/app/data/uploads`) |
| `sqlite-data` | banco SQLite (`/data/db/dev.db`)      |

## Modo A — Imagem do GHCR (Deploy Simplificado)

Ideal para servidores de produção/VPS limitados. Você **não precisa clonar todo o repositório**. Basta baixar o arquivo de configuração `docker-compose.yml` diretamente e subir o container. A imagem oficial é **buildada no CI** (GitHub Actions, workflow `.github/workflows/build.yml`) a cada push em `main` e publicada no GitHub Container Registry (GHCR) como `ghcr.io/eitati/medic-resume:latest`.

Na sua VPS ou servidor de produção:

1. Baixe o arquivo de configuração `docker-compose.yml`:
   ```bash
   curl -sSL https://raw.githubusercontent.com/eitati/medic-resume/main/docker-compose.yml -o docker-compose.yml
   ```

2. (Opcional) Crie um arquivo `.env` no mesmo diretório para customizar as variáveis de ambiente:
   ```bash
   # Exemplo de arquivo .env local no mesmo diretório
   BETTER_AUTH_SECRET=um_segredo_gerado_com_openssl_rand_base64_32
   BETTER_AUTH_URL=https://formulario.seu-dominio.com
   ```
   > **Como funciona a mesclagem do .env:** O Docker Compose lê automaticamente qualquer arquivo `.env` presente no mesmo diretório em que é executado. Os valores definidos no `.env` serão mesclados e sobrescreverão de forma transparente as variáveis padrões/defaults do `docker-compose.yml` (como `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `JIRA_*`, etc.).

3. Inicialize os containers:
   ```bash
   docker compose up -d
   ```

> A imagem precisa estar **pública** no GHCR para `pull` sem `docker login`.
> O GHCR cria o pacote como privado por padrão: após o primeiro build, vá em
> *repo → Packages → medic-resume → Package settings → Change visibility → Public*.
> (Uma vez público, novos builds continuam públicos.)

Verifique a saúde:

```bash
docker compose ps
curl -f http://localhost:3000/api/health
```

## Modo B — Build local (Desenvolvimento)

Ideal para desenvolvedores que querem subir a aplicação construindo a imagem Docker localmente a partir do código-fonte.

Neste modo, você precisará clonar o repositório completo e utilizar o arquivo de configuração local dedicado:

```bash
# Clone o repositório e acesse a pasta
git clone https://github.com/eitati/medic-resume.git
cd medic-resume

# Suba os containers construindo a imagem localmente
docker compose -f docker-compose.local.yml up -d --build
```

Isso fará com que o Docker utilize o arquivo `docker-compose.local.yml`, que aponta para o `Dockerfile` local, para construir a imagem `medic-resume:local` e subir o serviço em ambiente de desenvolvimento/teste.

## Variáveis de ambiente

Crie/edite o `.env` (baseie-se em `.env.example`) **antes** do deploy. O compose
repassa as variáveis para o container e fixa `DATABASE_URL=file:/data/db/dev.db`
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

> O `.env.example` traz também `JIRA_ISSUE_TYPE`, `JIRA_LABELS` e `DATABASE_URL`.
> Estes não são lidos pelo compose em produção.

## Exposição (opcional)

O ingresso em produção pode ser feito via **Cloudflare Tunnel**, sem abrir a porta
`3000` no host. O tunnel aponta para `http://app:3000` (rede do compose). O
`ports: "3000:3000"` serve para checagens locais (`curl`) e pode ser omitido se o
túnel for o único ingress.

## Backup e restauração

Os scripts `scripts/backup.sh` e `scripts/restore.sh` são **manuais** (não há
serviço agendado no compose). Eles fazem cópia fria do banco e dos uploads.

Backup:

```bash
docker compose exec app sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/app/data/uploads BACKUP_DIR=/backups sh /app/scripts/backup.sh /backups"
```

> **Nota para o Modo B:** Se estiver utilizando o Modo B (Build local), lembre-se de adicionar `-f docker-compose.local.yml` antes do comando `exec` (ex: `docker compose -f docker-compose.local.yml exec app ...`).

> Para persistir os backups no host, monte um volume no `BACKUP_DIR` (ex.:
> `./backups:/backups` no serviço `app`) ou copie o arquivo com `docker compose cp`.

Restauração (informe o `<TIMESTAMP>` do backup, visto no nome do arquivo):

```bash
docker compose exec app sh -c \
  "DB_PATH=/data/db/dev.db UPLOADS_DIR=/app/data/uploads BACKUP_DIR=/backups sh /app/scripts/restore.sh <TIMESTAMP>"
```

Detalhes do banco: [`docs/dev/BANCO-DE-DADOS.md`](../../docs/dev/BANCO-DE-DADOS.md).

## Atualizar / redeploy

**Modo A (Simplificado):**

Para atualizar a imagem para a versão mais recente do GHCR (ou caso queira baixar um novo `docker-compose.yml` atualizado):

```bash
# Opcional: Atualizar o arquivo docker-compose.yml
curl -sSL https://raw.githubusercontent.com/eitati/medic-resume/main/docker-compose.yml -o docker-compose.yml

# Atualizar a imagem e reiniciar os containers
docker compose pull
docker compose up -d
```

**Modo B (Local):**

Caso queira puxar as atualizações do código-fonte e reconstruir a imagem localmente:

```bash
docker compose -f docker-compose.local.yml down
git pull
docker compose -f docker-compose.local.yml up -d --build
```

As migrações rodam automaticamente no startup (`start.sh`). Os volumes (`uploads`,
`sqlite-data`) são preservados entre deploys.

## Notas técnicas

- A imagem usa `node:22-alpine` e reconstrói `better-sqlite3` no build; o `.npmrc`
  com `shamefully-hoist=true` é necessário para os módulos nativos.
- `next.config.ts` **não** usa `output: 'standalone'` — o container roda com o
  `node_modules` completo do projeto.
- O app escuta em `0.0.0.0:3000` dentro do container.
