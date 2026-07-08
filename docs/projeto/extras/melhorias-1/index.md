# Melhorias-1: Refinamentos do Formulário Frontend

Melhorias de UX, qualidade de código e performance no wizard de cadastro da clínica (`app/formulario/`).

## Objetivo

Evoluir o formulário de useStates manuais para um padrão moderno com React Hook Form + useActionState + Zod client-side, eliminando `useState` e `alert()` e adicionando validação por campo, step gating, persistência de rascunho, foco automático e componentes reutilizáveis.

## Status Geral

| Componente | Status |
|-----------|--------|
| React Hook Form + @hookform/resolvers | ✅ Concluído |
| useActionState + useFormStatus | ✅ Concluído |
| Step gating (validação por passo) | ✅ Concluído |
| Erro inline por campo no Input | ✅ Concluído |
| FileUpload com erro inline | ✅ Concluído |
| Componente Select.tsx | ✅ Concluído |
| Reset sem window.location.reload() | ✅ Concluído |
| crypto.randomUUID() para IDs | ✅ Concluído |
| Foco automático ao mudar de passo | ✅ Concluído |
| Persistir rascunho no localStorage | ✅ Concluído |

## Tasks

| # | Arquivo | Descrição | Prioridade | Status |
|---|---------|-----------|------------|--------|
| 1 | `task_1.md` | Migrar para React Hook Form + @hookform/resolvers | Alta | ✅ Concluído |
| 2 | `task_2.md` | Substituir useState por useActionState + useFormStatus | Alta | ✅ Concluído |
| 3 | `task_3.md` | Validação por passo (step gating) | Alta | ✅ Concluído |
| 4 | `task_4.md` | Feedback visual de erros por campo no Input | Alta | ✅ Concluído |
| 5 | `task_5.md` | FileUpload com erro inline em vez de alert() | Média | ✅ Concluído |
| 6 | `task_6.md` | Componente Select.tsx reutilizável | Média | ✅ Concluído |
| 7 | `task_7.md` | Substituir window.location.reload() por reset controlado | Média | ✅ Concluído |
| 8 | `task_8.md` | Substituir contador mutável por crypto.randomUUID() | Baixa | ✅ Concluído |
| 9 | `task_9.md` | Foco automático no primeiro campo ao mudar de passo | Baixa | ✅ Concluído |
| 10 | `task_10.md` | Persistir rascunho no localStorage | Baixa | ✅ Concluído |

## Dependências

```bash
pnpm add react-hook-form @hookform/resolvers
```

## Notas

- Todas as 10 tasks foram concluídas em sequência
- Zod v4 já estava instalado no projeto
- `pnpm build` passa sem erros

## Histórico de Commits

| Commit | Task | Mensagem |
|--------|------|----------|
| `cfc9e2c` | 8 | `fix(form): substituir contador mutável por crypto.randomUUID()` |
| `80492c7` | 6 | `feat(ui): criar componente Select reutilizável` |
| `8f7f516` | 5 | `feat(ui): substituir alert() por erro inline no FileUpload` |
| `f985695` | 4 | `feat(ui): adicionar feedback de erro inline no componente Input` |
| `423822f` | 1 | `feat(form): migrar para React Hook Form com validação Zod` |
| `be1ab41` | 3 | `feat(form): adicionar validação por passo no wizard` |
| `8ee4e7a` | 2 | `feat(form): usar useActionState e useFormStatus para submissão` |
| `23be843` | 9 | `feat(acessibilidade): foco automático no primeiro campo ao trocar de passo` |
| `eeb45e3` | 10 | `feat(form): persistir rascunho no localStorage` |
| *já incluso na task 1* | 7 | `resetarFormulario` sem `location.reload()` |
