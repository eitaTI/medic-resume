# Quick Start — Desenvolvimento Local

Guia passo a passo para rodar o **EitaTI Formulário** na sua máquina.

## Pré-requisitos

- **Node.js 22+**
- **pnpm** (`npm i -g pnpm` ou via corepack)
- Git

> No Windows, leia primeiro [`docs/dev/WINDOWS-SETUP.md`](../dev/WINDOWS-SETUP.md) (ative o Modo
> Desenvolvedor para symlinks de módulos nativos como `better-sqlite3`).

## 1. Clonar e instalar

```bash
git clone <repo> && cd medic-resume
pnpm install
```

O `postinstall` já roda `prisma generate` automaticamente.

## 2. Configurar o ambiente

```bash
cp .env.example .env
```

Edite o `.env` conforme necessário. Variáveis principais:

| Variável | Descrição | Padrão / exemplo |
|----------|-----------|------------------|
| `BETTER_AUTH_SECRET` | Segredo de sessão (min. 32 chars) | `dev_secret_...` (exemplo) |
| `BETTER_AUTH_URL` | URL base da app | `http://localhost:3000` |
| `DATABASE_URL` | Caminho do SQLite | `file:./dev.db` |
| `JIRA_*` | Integração Jira (opcional) | veja `.env.example` |

A integração Jira é **opcional**: sem as variáveis `JIRA_*`, a aprovação ainda funciona
(fail-open) e apenas não cria o card.

## 3. Banco de dados

```bash
pnpm prisma migrate dev     # cria as tabelas no SQLite (dev.db)
pnpm prisma db seed         # cria o admin inicial admin@eitati.com / admin123
```

## 4. Rodar

```bash
pnpm dev                    # http://localhost:3000
```

## 5. Usar a aplicação

| Rota | O que é |
|------|---------|
| `/formulario` | Wizard público de cadastro da clínica |
| `/login` | Login de administrador |
| `/admin` | Painel: lista de submissões (filtrar/aprovar/rejeitar) |
| `/admin/usuarios` | Gestão de administradores (criar/excluir) |
| `/admin/auditoria` | Log de auditoria das ações administrativas |
| `/admin/submissao/[id]` | Detalhe de uma submissão |

Credenciais iniciais: **`admin@eitati.com` / `admin123`**. Troque a senha criando um novo admin
e removendo este (ou ajuste o seed em `prisma/seed.ts`).

## Comandos úteis

```bash
pnpm prisma studio         # inspecionar o banco (SQLite)
pnpm prisma migrate reset  # recria o banco do zero (cuidado: apaga dados)
pnpm prisma generate       # regenerar o client do Prisma
pnpm lint                  # ESLint
pnpm build                 # build de produção
```

## Troubleshooting

- **Erro de build com `better-sqlite3`**: rode `pnpm prisma generate`. No Windows, ative o Modo
  Desenvolvedor (veja `docs/dev/WINDOWS-SETUP.md`).
- **Sessão não persiste / redireciona para login**: confirme `BETTER_AUTH_URL` e que o cookie
  `better-auth.session_token` está sendo enviado (o layout de `/admin` e a rota `/api/uploads` verificam a sessão).
- **Jira não cria card**: verifique `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` e
  `JIRA_PROJECT_KEY`. A aprovação continua mesmo com erro (`jiraSyncStatus = ERRO`, com retry no
  painel).
- **Erro de migração**: se o banco local estiver inconsistente, `pnpm prisma migrate reset`.
