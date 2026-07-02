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
| Banco de dados    | SQLite via Prisma ORM               |
| Autenticação      | Better Auth (Credentials)           |
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

## Estrutura do Projeto

```
medic-resume/
├── app/
│   ├── formulario/        # Formulário público (wizard)
│   ├── login/             # Tela de login admin
│   └── admin/             # Painel administrativo
├── components/            # Componentes React
├── actions/               # Server Actions
├── lib/                   # Utilitários (Prisma, Auth, Jira)
├── prisma/                # Schema e migrations
└── data/uploads/          # Arquivos enviados (fora de public/)
```

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

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guia de contribuição, fluxo de trabalho e convenções |
| [docs/PLANO.md](PLANO.md) | Plano completo de implementação com schema do banco e detalhes técnicos |
| [docs/TAREFAS.md](docs/TAREFAS.md) | Tarefas paralelizáveis organizadas por nível de dificuldade |
| [docs/fases/](docs/fases/) | Documentação detalhada de cada fase de implementação |

## Licença

Projeto interno ZScan.
