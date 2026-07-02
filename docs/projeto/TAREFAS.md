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

## 🟢 Nível Iniciante (HTML/CSS, React básico)

Tarefas ideais para quem está começando.

| Tarefa | Fase | Descrição | Dependências | Estimativa |
|--------|------|-----------|--------------|------------|
| Componente `Button.tsx` | UI | Botões com variantes (primário, secundário, perigo) | Nenhuma | 1-2h |
| Componente `Input.tsx` | UI | Campos de texto com label e erro | Nenhuma | 1-2h |
| Componente `StatusBadge.tsx` | UI | Badges de status (pendente, aprovado, rejeitado) | Nenhuma | 1h |
| Componente `Stepper.tsx` | 2 | Indicador de progresso do wizard | Nenhuma | 2-3h |
| Componente `FileUpload.tsx` | 2 | Upload de arquivo com preview | Nenhuma | 2-3h |
| Script `backup.sh` | 8 | Shell script de backup do banco | Nenhuma | 2h |
| `.dockerignore` | 9 | Arquivo de ignore para Docker | Nenhuma | 30min |
| Estilos globais | 1 | Configurar `globals.css` com Tailwind v4 | Nenhuma | 1h |

### Exercícios Práticos para Iniciantes

1. **Criar um componente Button**
   - Crie `components/ui/Button.tsx`
   - Adicione variantes: `primary`, `secondary`, `danger`
   - Adicione tamanhos: `sm`, `md`, `lg`
   - Use classes Tailwind

2. **Criar um componente Input**
   - Crie `components/ui/Input.tsx`
   - Adicione label, placeholder, mensagem de erro
   - Valide com `aria-invalid` para acessibilidade

3. **Criar o script de backup**
   - Crie `scripts/backup.sh`
   - Use `sqlite3` para backup do banco
   - Use `tar` para comprimir uploads
   - Adicione limpeza de backups antigos

---

## 🟡 Nível Intermediário (React + TypeScript)

Tarefas para quem já tem experiência com React.

| Tarefa | Fase | Descrição | Dependências | Estimativa |
|--------|------|-----------|--------------|------------|
| `StepClinica.tsx` | 2 | Formulário da clínica (empresa, titular, email) | Fase 1 | 3-4h |
| `StepMedicos.tsx` | 2 | Formulário dinâmico de médicos | Fase 1 | 3-4h |
| `StepExames.tsx` | 2 | Formulário de exames com upload PDF | Fase 1 | 3-4h |
| `StepDispositivos.tsx` | 2 | Formulário dinâmico de dispositivos | Fase 1 | 2-3h |
| `SubmissaoCard.tsx` | 4 | Card de submissão para o dashboard | Fase 3 | 2h |
| `AdminForm.tsx` | 6 | Formulário de criação de admin | Fase 3 | 2-3h |
| `AuditLogCard.tsx` | 7 | Card de log de auditoria | Fase 4 | 2h |
| `actions/admins.ts` | 6 | Server Actions CRUD de admins | Fase 3 | 3h |
| `actions/auditoria.ts` | 7 | Server Action de listagem de logs | Fase 4 | 2h |

### Exercícios Práticos para Intermediários

1. **Criar o wizard completo**
   - Implemente os 4 passos do formulário
   - Use `useState` para controlar o passo atual
   - Valide cada antes de avançar
   - Use `useActionState` para enviar os dados

2. **Criar o dashboard admin**
   - Liste submissões com filtro de status
   - Use Server Components para buscar dados
   - Crie cards clicáveis que levam ao detalhe

3. **Implementar auditoria**
   - Crie a função `registrarAcao()` em `lib/audit.ts`
   - Integre em todas as Server Actions de mutação
   - Crie a página de listagem com filtros

---

## 🔴 Nível Avançado (Arquitetura, Integrações)

Tarefas para devs experientes.

| Tarefa | Fase | Descrição | Dependências | Estimativa |
|--------|------|-----------|--------------|------------|
| Setup projeto | 1 | Configuração inicial do Next.js + Prisma | Nenhuma | 2-3h |
| Better Auth | 3 | Configuração completa da autenticação | Fase 1 | 3-4h |
| Middleware rotas | 3 | Proteção de rotas `/admin/*` | Fase 3 | 2h |
| `lib/jira.ts` | 5 | Cliente da API do Jira | Fase 4 | 2-3h |
| `aprovarSubmissao()` | 4/5 | Aprovação + criação card Jira | Fase 4, 5 | 3h |
| `Dockerfile` | 9 | Multi-stage build para produção | Nenhuma | 2-3h |
| `docker-compose.yml` | 9 | Serviços app + backup + nginx | Fase 8 | 3-4h |
| Schema Prisma | 1 | Modelos de dados completos | Nenhuma | 2h |

### Exercícios Práticos para Avançados

1. **Configurar Better Auth**
   - Instale e configure o Better Auth
   - Configure o provider Credentials
   - Integre com Prisma adapter
   - Crie o middleware de proteção

2. **Integrar com Jira**
   - Crie `lib/jira.ts` com ofetch
   - Implemente `criarCardJira(clinica)`
   - Salve a chave do issue no banco
   - Trate erros de conexão

3. **Docker completo**
   - Crie `Dockerfile` multi-stage
   - Configure `docker-compose.yml`
   - Adicione serviço de backup com cron
   - Configure nginx como reverse proxy

---

## Ordem Sugerida de Trabalho

### Dia 1 — Setup e Fundação
| Horário | Dev A (Experiente) | Dev B (Intermediário) | Dev C (Iniciante) |
|---------|-------------------|----------------------|-------------------|
| 09:00 | Setup projeto + Prisma | Estudar PLANO.md | Estudar PLANO.md |
| 10:00 | Schema de dados | Componentes UI (Button, Input) | Script backup.sh |
| 11:00 | Config Better Auth | Componente StatusBadge | .dockerignore |
| 12:00 | — | — | — |
| 13:00 | Middleware rotas | Stepper do wizard | Testar componentes |
| 14:00 | Tela de login | FileUpload | Documentação |

### Dia 2 — Formulário e Auth
| Horário | Dev A (Experiente) | Dev B (Intermediário) | Dev C (Iniciante) |
|---------|-------------------|----------------------|-------------------|
| 09:00 | Server Action login | StepClinica | Componentes extras |
| 10:00 | Testar auth | StepMedicos | Fix bugs de UI |
| 11:00 | — | StepExames | Testar formulário |
| 12:00 | — | — | — |
| 13:00 | Layout admin | StepDispositivos | Documentar componentes |
| 14:00 | Server Actions admin | Validar formulário | Revisar código |

### Dia 3 — Admin e Integrações
| Horário | Dev A (Experiente) | Dev B (Intermediário) | Dev C (Iniciante) |
|---------|-------------------|----------------------|-------------------|
| 09:00 | Dashboard admin | SubmissaoCard | Testar fluxo completo |
| 10:00 | Detalhe submissão | AdminForm | Corrigir bugs |
| 11:00 | Aprovar/Rejeitar | Server Actions CRUD | Atualizar docs |
| 12:00 | — | — | — |
| 13:00 | lib/jira.ts | Página admins | — |
| 14:00 | Integração Jira | Auditoria | — |

### Dia 4 — Deploy e Finalização
| Horário | Dev A (Experiente) | Dev B (Intermediário) | Dev C (Iniciante) |
|---------|-------------------|----------------------|-------------------|
| 09:00 | Dockerfile | Testes gerais | Testes gerais |
| 10:00 | docker-compose.yml | Fix bugs | Atualizar README |
| 11:00 | nginx + SSL | Documentação | Últimos ajustes |
| 12:00 | — | — | — |
| 13:00 | Deploy final | Code review | Code review |
| 14:00 | — | — | — |

---

## Checklist de Revisão

Antes de enviar PR, verifique:

- [ ] Código compila sem erros TypeScript
- [ ] Não há warnings no console
- [ ] Componentes estão em `components/` na pasta correta
- [ ] Server Actions estão em `actions/`
- [ ] Código está formatado (Prettier)
- [ ] Não há comentários desnecessários
- [ ] Funcionalidade testada localmente
- [ ] README/docs atualizados (se necessário)