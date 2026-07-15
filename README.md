# EitaTI Formulário

Sistema de cadastro de clínicas médicas: um **wizard público de 4 etapas** coleta os dados da
clínica, dos médicos, dos exames e dos equipamentos; um **painel administrativo** revisa,
aprova/rejeita e sincroniza cada submissão com o **Jira**, com **auditoria** de todas as ações e
**backup** automatizado.

**Next.js 15 · TypeScript · Prisma v7 (SQLite) · Better Auth · Tailwind v4 · Docker**

## Funcionalidades

- 🧙 **Wizard público de 4 etapas** (Clínica, Usuários, Exames, Equipamentos) com validação Zod
- 🔐 **Autenticação de administradores** via Better Auth (credentials)
- 🛡️ **Painel admin**: listar, filtrar, detalhar, aprovar/rejeitar submissões
- 🧩 **Integração com Jira** (fail-open): cria/atualiza o card na aprovação, com retry
- 📝 **Auditoria completa** das ações administrativas (inclui criar/excluir admins)
- 👥 **Gestão de administradores** (criar/excluir) com guardas contra auto-exclusão/último admin
- 💾 **Backup automático** (banco + uploads) via Docker
- 🌙 **Modo escuro**

## Pré-requisitos

- **Node.js 22+** e **pnpm**
- (Opcional, produção) **Docker** + **Docker Compose**

## Início rápido

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma db seed        # cria admin@eitati.com / admin123
pnpm dev                   # http://localhost:3000
```

- Formulário público: `http://localhost:3000/formulario`
- Login admin: `http://localhost:3000/login` — `admin@eitati.com` / `admin123`
- Painel: `http://localhost:3000/admin`

> Guia passo a passo: [`docs/guides/quick-start.md`](docs/guides/quick-start.md).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento (HMR) |
| `pnpm build` | Build de produção (`next build`) |
| `pnpm start` | Inicia o build de produção |
| `pnpm lint` | ESLint |
| `pnpm prisma migrate dev` | Cria/executa migrações |
| `pnpm prisma generate` | Gera o client do Prisma (rodado no `postinstall`) |
| `pnpm prisma db seed` | Popula o admin inicial |
| `pnpm prisma studio` | Inspeciona o banco |

> Não existe `pnpm test` — o projeto não tem framework de testes.

## Estrutura

```
app/            Rotas (formulário, login, admin) + api (auth, health, uploads)
components/     ui/ (genéricos), wizard/ (etapas), admin/ (painel), providers/ (tema)
actions/        Server Actions (submissão, login, submissões, admins, auditoria)
lib/            prisma.ts, auth.ts, audit.ts, validacoes.ts, jira.ts
prisma/         schema.prisma, migrations/, seed.ts
data/uploads/   arquivos enviados (fora de public/, LGPD)
scripts/        start.sh, backup.sh, restore.sh
```

## Deploy

A imagem Docker é **buildada no CI** (GitHub Actions) e publicada em
`ghcr.io/eitati/medic-resume`. Em uma VPS limitada, basta **puxar** a imagem
(`docker compose pull && docker compose up -d`) — nenhum build acontece no servidor.
Para build local ou detalhes (volumes, ambiente, backup, atualização), veja
[`docs/guides/deploy.md`](docs/guides/deploy.md).

## Documentação

| Onde | Conteúdo |
|------|----------|
| [`docs/guides/quick-start.md`](docs/guides/quick-start.md) | Setup local detalhado (passo a passo) |
| [`docs/guides/deploy.md`](docs/guides/deploy.md) | Deploy em produção com Docker |
| [`docs/dev/`](docs/dev/) | Arquitetura, banco, código, componentes, server actions, estilos, git |
| [`docs/dev/WINDOWS-SETUP.md`](docs/dev/WINDOWS-SETUP.md) | Ambiente Windows (Modo Desenvolvedor, troubleshooting) |
| [`docs/projeto/`](docs/projeto/) | Plano por fases e extras (status de implementação) |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Como contribuir (Git, workflow, checklist de PR) |

## Contribuindo

Veja [`CONTRIBUTING.md`](CONTRIBUTING.md) para o setup, padrões de branch/commit e o checklist
de PR. Antes de commitar, rode `pnpm build && pnpm lint`.
