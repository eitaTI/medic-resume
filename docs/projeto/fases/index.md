# Fases do Projeto — Medic Resume

Acompanhamento geral do progresso de implementação.
> Cada fase possui detalhamento em `docs/projeto/fases/fase-N/` com tasks individuais por commit.

## Visão Geral das Depedências

```
Fase 1 (Setup) — base do projeto
    │
    ├──→ Fase 2 (Formulário público) — wizard 4 etapas
    │
    ├──→ Fase 3 (Auth) ──┬──→ Fase 4 (Admin dashboard/detalhe)
    │                    │         │
    │                    │         ├──→ Fase 5 (Integração Jira)
    │                    │         │
    │                    │         └──→ Fase 6 (Gerenciar Usuários)
    │                    │
    │                    └──→ Fase 7 (Auditoria) — logs em todas as actions
    │
    ├──→ Fase 8 (Backup) — scripts shell, independente
    │
    └──→ Fase 9 (Docker/Deploy) — containerização, independente
```
---

## Status Geral

| Fase | Descrição | Tasks | Status |
|------|-----------|-------|--------|
| 1 | Setup do Projeto | 9/9 | ✅ Concluído |
| 2 | Formulário Público | 9/11 | ✅ Concluído |
| 3 | Autenticação e Login | 4/4 | ✅ Concluído |
| 4 | Painel Admin | 7/7 | ✅ Concluído |
| 5 | Integração Jira | 1/4 | ⏳ Em andamento |
| 6 | Gerenciar Usuários | 3/3 | ✅ |
| 7 | Sistema de Auditoria | 7/7 | ✅ |
| 8 | Sistema de Backup | 0/4 | ❌ Pendente |
| 9 | Deploy com Docker | 0/5 | ❌ Pendente |
| | **Total** | **31/54** | **~57%** |

## Detalhamento

### ✅ Fase 1 — Setup do Projeto
| Task | Status |
|------|--------|
| Projeto Next.js + Tailwind | ✅ |
| Dependências instaladas | ✅ |
| Schema Prisma + modelos | ✅ |
| Migração inicial | ✅ |
| Variáveis de ambiente | ✅ |
| Seed do admin | ✅ |
| Prisma client singleton | ✅ |
| Better Auth configurado | ✅ |
| Scripts package.json | ✅ |

### ✅ Fase 2 — Formulário Público
| Task | Status |
|------|--------|
| Button UI | ✅ |
| Input UI | ✅ |
| FileUpload UI | ✅ |
| Stepper | ✅ |
| StepClinica | ✅ |
| StepUsuarios | ✅ |
| StepExames | ✅ |
| StepEquipamentos | ✅ |
| Validação Zod | ✅ |
| Server Action submissão | ✅ |
| Página principal do Wizard | ✅ |

### ✅ Fase 3 — Autenticação e Login
| Task | Status |
|------|--------|
| Better Auth configurado | ✅ |
| Server Action login | ✅ |
| Tela de login | ✅ |
| Middleware de proteção | ✅ |

### ✅ Fase 4 — Painel Admin
| Task | Status |
|------|--------|
| Server Actions submissões | ✅ |
| StatusBadge | ✅ |
| SubmissaoCard | ✅ |
| AprovarRejeitarButtons | ✅ |
| Layout protegido `/admin` | ✅ |
| Dashboard `/admin` | ✅ |
| Detalhe `/admin/submissao/[id]` | ✅ |

### ⏳ Fase 5 — Integração Jira
| Task | Status |
|------|--------|
| Cliente Jira (`lib/jira.ts`) | ✅ |
| Atualizar Server Action | ❌ |
| Botões com feedback Jira | ❌ |
| Variáveis de ambiente | ❌ |

### ❌ Fase 6 — Gerenciar Usuários
| Task | Status |
|------|--------|
| Server Actions admins | ✅ |
| AdminForm | ✅ |
| Página `/admin/usuarios` | ✅  |

### ⚠️ Fase 7 — Sistema de Auditoria
| Task | Status |
|------|--------|
| Schema AuditLog + migração | ✅ |
| Helper `lib/audit.ts` | ❌ |
| Action `actions/auditoria.ts` | ❌ |
| AuditLogCard | ❌ |
| Página `/admin/auditoria` | ⚠️ Placeholder |
| Integrar nas Server Actions | ❌ |
| Registrar login na auditoria | ❌ |

### ❌ Fase 8 — Sistema de Backup
| Task | Status |
|------|--------|
| Script de backup | ❌ |
| Script de restauração | ❌ |
| Docker Compose com backup | ❌ |
| Testar backup/restore | ❌ |

### ❌ Fase 9 — Deploy com Docker
| Task | Status |
|------|--------|
| Dockerfile | ❌ |
| .dockerignore | ❌ |
| docker-compose.yml completo | ❌ |
| .env.production + build/deploy | ❌ |
