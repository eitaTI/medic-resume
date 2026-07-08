# Task 2: Componente StatusBadge

❌ **Pendente** — criar `components/ui/StatusBadge.tsx`

Criar `components/ui/StatusBadge.tsx`:

```tsx
'use client'
```

- Componente com prop `status: 'PENDENTE' | 'APROVADA' | 'REJEITADA'`
- Labels em português: **Pendente** / **Aprovada** / **Rejeitada**
- Cores (com suporte a dark mode):
  - `PENDENTE` → `bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300`
  - `APROVADA` → `bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300`
  - `REJEITADA` → `bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300`
- Badge arredondado: `rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center`
- Usar o padrão de cores do projeto (Tailwind v4 com dark mode)

## Commit

```
feat(ui): criar componente StatusBadge com cores por status e dark mode
```
