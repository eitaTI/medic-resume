# Arquitetura do Projeto

Decisões de arquitetura e estrutura do projeto Medic Resume.

## Visão Geral

O projeto é uma aplicação **Next.js 16 (App Router)** que funciona como um sistema de formulário para coleta de dados de clínicas médicas, com painel administrativo e integração com Jira.

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Framework | Next.js 16 | App Router, Server Components, Server Actions, Turbopack |
| Linguagem | TypeScript | Tipagem estática, melhor DX |
| Banco | SQLite + Prisma v7 | Simplicidade, ORM robusto |
| Auth | Better Auth | Leve, integrado com Prisma |
| Estilo | Tailwind CSS v4 | Utility-first, CSS-first config |
| Deploy | Docker | Consistência entre ambientes |

## Estrutura de Pastas

```
medic-resume/
├── app/                    # Rotas (App Router)
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página inicial
│   ├── globals.css         # Estilos globais (Tailwind)
│   ├── api/auth/[...all]/  # Handlers HTTP do Better Auth
│   ├── formulario/         # Rota pública (wizard)
│   ├── login/              # Rota de login
│   └── admin/              # Rotas protegidas (painel, usuários, auditoria)
│
├── components/             # Componentes React
│   ├── ui/                 # Button, Input, FileUpload, Select, StatusBadge, ThemeToggle
│   ├── wizard/             # Stepper, StepClinica, StepUsuarios, StepExames, StepEquipamentos
│   ├── admin/              # SubmissaoCard, AprovarRejeitarButtons, AdminForm, AdminDeleteButton, AuditLogCard, AdminNavbar, LogoutButton
│   └── providers/          # ThemeProvider (dark mode)
├── actions/                # Server Actions (submeter-formulario, login, submissoes, admins, auditoria)
├── lib/                    # Utilitários e configurações
│   ├── prisma.ts           # Singleton PrismaClient + adapter
│   └── auth.ts             # Instância Better Auth
├── prisma/                 # Schema, migrations, seed
├── data/uploads/           # Arquivos enviados (fora de public/)
├── eslint.config.mjs       # ESLint flat config
├── prisma.config.ts        # Config Prisma v7
└── docs/                   # Documentação
```

## Padrões de Arquitetura

### Server Components vs Client Components

| Tipo | Uso | Exemplo |
|------|-----|---------|
| Server Component | Padrão. Busca de dados, lógica do servidor | `app/admin/page.tsx` |
| Client Component | Interação do usuário, estado local | `components/wizard/Stepper.tsx` |

**Regra:** Use Server Component por padrão. Adicione `'use client'` apenas quando necessário.

### Server Actions vs API Routes

O projeto usa **Server Actions** em vez de API Routes tradicionais:

```typescript
// actions/submissoes.ts
'use server'

export async function listarSubmissoes(filtro?: string) {
  // Lógica no servidor
}
```

**Vantagens:**
- Zero boilerplate
- Tipagem segura
- Revalidação automática com `revalidatePath()`

### Data Flow

```
Client Component → Server Action → Prisma → SQLite
       ↑                                    |
       └──────── revalidatePath() ──────────┘
```

## Camadas da Aplicação

### 1. Apresentação (Components)
- Componentes React (Server e Client)
- Estilização com Tailwind CSS
- Formulários com validação

### 2. Lógica (Actions)
- Server Actions para mutações
- Validação com Zod
- Autenticação com Better Auth

### 3. Dados (Prisma)
- ORM para banco de dados
- Migrations para versionamento do schema
- Seeds para dados iniciais

## Decisões de Design

### Por que SQLite?
- Simplicidade para deploy
- Sem necessidade de servidor de banco separado
- Backup simples (arquivo único)
- Adequado para volume de dados esperado

### Por que Server Actions?
- Integração nativa com Next.js
- Menos código boilerplate
- Tipagem compartilhada entre cliente/servidor
- Revalidação automática

### Por que Better Auth?
- Leve e simples
- Integrado com Prisma
- Suporte a Credentials provider
- Sem dependências externas pesadas

## Fluxo Principal

```
1. Cliente acessa /formulario
2. Preenche wizard (4 etapas)
3. Envia formulário → Server Action
4. Dados salvos como PENDENTE no banco
5. Admin faz login → /login
6. Admin acessa /admin → vê submissões pendentes
7. Admin clica em submissão → vê detalhes
8. Admin aprova → card criado no Jira
   ou Admin rejeita → informa motivo
```

## Segurança

- Senhas hasheadas via `@better-auth/utils/password` (algoritmo do Better Auth)
- Sessões gerenciadas por Better Auth
- Rotas `/admin` protegidas por verificação de sessão server-side em `app/admin/layout.tsx` (redirect → `/login`); rotas de API protegidas checam a sessão inline (ex.: `/api/uploads` → 401)
- Uploads fora de `public/` (LGPD)
- Variáveis sensíveis em `.env` (não commitado)
- Cloudflare Tunnel para exposição segura

## Performance

- Server Components para reduzir JS no cliente
- `revalidatePath()` para atualização otimista
- Prisma queries otimizadas com `include`
- Imagens otimizadas com `next/image`

## Escalabilidade

O projeto é dimensionado para:
- ~100-500 clínicas cadastradas
- ~10-50 admins simultâneos
- Uploads de ~10MB por arquivo
- Backup diário automático

Para escalar além disso, considerar:
- Migrar para PostgreSQL
- Adicionar cache (Redis)
- CDN para uploads
