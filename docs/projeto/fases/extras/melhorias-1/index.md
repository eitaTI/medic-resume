# Melhorias-1: Refinamentos do Formulário Frontend

Melhorias de UX, qualidade de código e performance no wizard de cadastro da clínica (`app/formulario/`).

## Objetivo

Evoluir o formulário de useStates manuais para um padrão moderno com React Hook Form + useActionState + Zod client-side, eliminando `useState` e `alert()` e adicionando validação por campo, step gating, persistência de rascunho, foco automático e componentes reutilizáveis.

## Status Geral

| Componente | Status |
|-----------|--------|
| React Hook Form + @hookform/resolvers | ❌ Pendente |
| useActionState + useFormStatus | ❌ Pendente |
| Step gating (validação por passo) | ❌ Pendente |
| Erro inline por campo no Input | ❌ Pendente |
| FileUpload com erro inline | ❌ Pendente |
| Componente Select.tsx | ❌ Pendente |
| Reset sem window.location.reload() | ❌ Pendente |
| crypto.randomUUID() para IDs | ❌ Pendente |
| Foco automático ao mudar de passo | ❌ Pendente |
| Persistir rascunho no localStorage | ❌ Pendente |

## Tasks

| # | Arquivo | Descrição | Prioridade | Status |
|---|---------|-----------|------------|--------|
| 1 | `task_1.md` | Migrar para React Hook Form + @hookform/resolvers | Alta | ❌ Pendente |
| 2 | `task_2.md` | Substituir useState por useActionState + useFormStatus | Alta | ❌ Pendente |
| 3 | `task_3.md` | Validação por passo (step gating) | Alta | ❌ Pendente |
| 4 | `task_4.md` | Feedback visual de erros por campo no Input | Alta | ❌ Pendente |
| 5 | `task_5.md` | FileUpload com erro inline em vez de alert() | Média | ❌ Pendente |
| 6 | `task_6.md` | Componente Select.tsx reutilizável | Média | ❌ Pendente |
| 7 | `task_7.md` | Substituir window.location.reload() por reset controlado | Média | ❌ Pendente |
| 8 | `task_8.md` | Substituir contador mutável por crypto.randomUUID() | Baixa | ❌ Pendente |
| 9 | `task_9.md` | Foco automático no primeiro campo ao mudar de passo | Baixa | ❌ Pendente |
| 10 | `task_10.md` | Persistir rascunho no localStorage | Baixa | ❌ Pendente |

## Dependências

```bash
pnpm add react-hook-form @hookform/resolvers
```

## Notas

- A task 1 (React Hook Form) é pré-requisito para as tasks 3, 4, 7, 9 e 10
- A task 2 (useActionState) pode ser feita em paralelo com a 1 ou depois
- A task 6 (Select.tsx) e 8 (crypto.randomUUID) são independentes
- Zod v4 já está instalado no projeto — não requer instalação adicional
