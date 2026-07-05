# Plano de Implementação — Zscan Formulario (Next.js)
---

## Fluxo do Sistema

```
CLIENTE (público)
  │  Acessa /formulario
  │  Preenche wizard (4 etapas)
  │  Envia formulário
  │  Dados salvos como PENDENTE no banco
  │
ADMIN (login com email/senha)
  │  Acessa /admin
  │  Visualiza lista de submissões pendentes
  │  Revisa dados e arquivos enviados
  │  Clica "Aprovar" → card criado no Jira
  │  Ou clica "Rejeitar" → informa motivo
```

---

## Stack Tecnológica

| Camada            | Tecnologia                          |
| ----------------- | ----------------------------------- |
| Framework         | Next.js 15 (App Router)             |
| Linguagem         | TypeScript ^6                       |
| Banco de dados    | SQLite via Prisma ORM ^7            |
| Autenticação      | Better Auth (Credentials)           |
| Senhas            | bcryptjs (hash, pure JS)            |
| Upload de arquivos| Web API FormData (nativo)           |
| Cabeçalho/Rodapé  | `<textarea>` simples                |
| Integração Jira   | ofetch ^1 (REST API v3)             |
| Estilização       | Tailwind CSS ^4 (CSS-first config)  |
| Deploy            | Docker + Docker Compose             |

---

## Estrutura de Pastas

```
medic-resume/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css                        # @import "tailwindcss"
│   │
│   ├── formulario/
│   │   └── page.tsx                       # formulário público (wizard Client Component)
│   │
│   ├── login/
│   │   └── page.tsx                       # tela de login admin
│   │
│   └── admin/
│       ├── layout.tsx                     # layout protegido
│       ├── page.tsx                       # dashboard (lista submissões via Server Component)
│       ├── submissao/
│       │   └── [id]/
│       │       └── page.tsx               # detalhe (aprovar/rejeitar)
│       └── admins/
│           └── page.tsx                   # gerenciar outros admins
│
├── components/
│   ├── wizard/
│   │   ├── Stepper.tsx
│   │   ├── StepClinica.tsx
│   │   ├── StepMedicos.tsx
│   │   ├── StepExames.tsx
│   │   └── StepDispositivos.tsx
│   ├── admin/
│   │   ├── SubmissaoCard.tsx
│   │   ├── SubmissaoDetalhe.tsx
│   │   ├── AprovarRejeitarButtons.tsx
│   │   └── AdminForm.tsx
│   └── ui/
│       ├── FileUpload.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       └── StatusBadge.tsx
│
├── actions/
│   ├── submeter-formulario.ts             # Server Action: salvar dados + arquivos
│   ├── submissoes.ts                      # Server Actions: listar, aprovar, rejeitar
│   └── admins.ts                          # Server Actions: CRUD admins
│
├── lib/
│   ├── prisma.ts                          # singleton PrismaClient
│   ├── auth.ts                            # config Better Auth
│   ├── jira.ts                            # cliente Axios para API do Jira
│   └── audit.ts                           # helper de auditoria
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── prisma.config.ts
├── data/
│   └── uploads/                          # fora de public/ (segurança LGPD)
│
├── .env
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

# Tarefas Paralelizáveis

Mapa de tarefas que podem ser executadas em paralelo por diferentes developers.

## Visão Geral das Depedências

```
Fase 1 (Setup)
    │
    ├──→ Fase 2 (Formulário) ──────────────┐
    │                                       │
    ├──→ Fase 3 (Auth) ──┬→ Fase 4 (Admin) ─┼→ Fase 5 (Jira)
    │                    │                  │
    │                    └→ Fase 6 (Admins) ─┘
    │
    ├──→ Fase 7 (Auditoria) [pós-Fase 4]
    │
    ├──→ Fase 8 (Backup) [independente]
    │
    └──→ Fase 9 (Docker) [independente]
```