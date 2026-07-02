# ZScan Formulário

Sistema de formulário para coleta de dados de clínicas médicas, facilitando o cadastro e implementação de sistemas ZScan.


## Visão Geral

O sistema permite que clínicas preencham um formulário completo (empresa, médicos, exames, dispositivos) que passa por revisão administrativa antes de ser integrado ao Jira para implantação.

## Fluxo do Sistema

```
CLIENTE (público)
  → Acessa /formulario
  → Preenche wizard (4 etapas)
  → Envia formulário
  → Dados salvos como PENDENTE no banco

ADMIN (login com email/senha)
  → Acessa /admin
  → Visualiza lista de submissões pendentes
  → Revisa dados e arquivos enviados
  → Aprova → card criado no Jira
  → Ou rejeita → informa motivo
```

## Stack Tecnológica

| Camada            | Tecnologia                          |
| ----------------- | ----------------------------------- |
| Framework         | Next.js 15 (App Router)             |
| Linguagem         | TypeScript                          |
| Banco de dados    | SQLite via Prisma ORM ^7            |
| Autenticação      | Better Auth (Credentials)           |
| Senhas            | bcryptjs (hash, pure JS)            |
| Upload de arquivos| Web API FormData (nativo)           |
| Integração Jira   | ofetch (REST API v3)                |
| Estilização       | Tailwind CSS v4                     |
| Deploy            | Docker + Docker Compose             |

## Funcionalidades

- **Formulário público** — Wizard de 4 etapas para coleta de dados
- **Painel administrativo** — Dashboard para revisão de submissões
- **Autenticação** — Login seguro com Better Auth
- **Integração Jira** — Criação automática de cards após aprovação
- **Sistema de auditoria** — Registro de todas as ações administrativas
- **Backup automático** — Script de backup do banco e uploads

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (para produção)

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd medic-resume

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar migrações do banco
npx prisma migrate dev

# Criar admin padrão
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

## Credenciais Padrão (Desenvolvimento)

| Email | Senha |
|-------|-------|
| admin@zscan.com | admin123 |

## Status do Projeto

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Setup do Projeto | ✅ Concluída |
| 2 | Formulário Público | ⏳ Pendente |
| 3 | Autenticação e Login | ⏳ Pendente |
| 4 | Painel Admin | ⏳ Pendente |
| 5 | Integração Jira | ⏳ Pendente |
| 6 | Gerenciar Admins | ⏳ Pendente |
| 7 | Sistema de Auditoria | ⏳ Pendente |
| 8 | Sistema de Backup | ⏳ Pendente |
| 9 | Deploy com Docker | ⏳ Pendente |

## Estrutura do Projeto

```
medic-resume/
├── app/
│   ├── globals.css            # Tailwind CSS v4
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Página inicial
│   ├── formulario/            # Formulário público (wizard)
│   ├── login/                 # Tela de login admin
│   └── admin/                 # Painel administrativo
├── components/                # Componentes React
│   ├── wizard/                # Componentes do formulário
│   ├── admin/                 # Componentes do painel admin
│   └── ui/                    # Componentes genéricos (Button, Input, etc.)
├── actions/                   # Server Actions
├── lib/
│   ├── prisma.ts              # Singleton PrismaClient
│   └── auth.ts                # Configuração Better Auth
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── seed.ts                # Seed do admin padrão
│   └── migrations/            # Migrações do banco
├── prisma.config.ts           # Configuração do Prisma v7
├── .env                       # Variáveis de ambiente (não commitar)
├── .env.example               # Template de variáveis de ambiente
├── next.config.ts             # Configuração do Next.js
├── tsconfig.json              # Configuração do TypeScript
└── package.json               # Dependências do projeto
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Iniciar servidor de desenvolvimento
npm run build                  # Build de produção
npm start                      # Iniciar servidor de produção
npm run lint                   # Verificar código

# Prisma
npx prisma migrate dev         # Rodar migrações
npx prisma db seed             # Criar admin padrão
npx prisma studio              # Interface web para ver o banco
npx prisma generate            # Gerar cliente Prisma

# Docker
docker compose up -d           # Iniciar serviços
docker compose logs -f         # Ver logs
docker compose down            # Parar serviços

# Backup
./scripts/backup.sh            # Backup manual
```

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [Contribuição](CONTRIBUTING.md) | Guia de contribuição, fluxo de trabalho e convenções |
| [Desenvolvimento](docs/dev/) | Guia de desenvolvimento do projeto em geral |
| [Planejamento](docs/PLANO.md) | Plano completo de implementação com schema do banco e detalhes técnicos |
| [Tarefas estipuladas](docs/projeto/TAREFAS.md) | Tarefas paralelizáveis organizadas por nível de dificuldade |
| [Fases do projeto](docs/projeto/fases/) | Documentação detalhada de cada fase de implementação |

## Estimativa de Implementação

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 1 | Setup do Projeto | 2-3h |
| 2 | Formulário Público | 4-6h |
| 3 | Autenticação e Login | 2-3h |
| 4 | Painel Admin | 3-4h |
| 5 | Integração Jira | 1-2h |
| 6 | Gerenciar Admins | 1-2h |
| 7 | Sistema de Auditoria | 2-3h |
| 8 | Sistema de Backup | 1-2h |
| 9 | Deploy com Docker | 2-3h |

**Total estimado:** 4-5 dias de trabalho integral (30-40 horas)

## Licença

Projeto interno ZScan.
