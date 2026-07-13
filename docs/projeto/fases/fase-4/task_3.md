# Task 3: Componente SubmissaoCard

✅ **Concluído** — criar `components/admin/SubmissaoCard.tsx`

Criar `components/admin/SubmissaoCard.tsx`:

```tsx
'use client'
```

- Componente que recebe `submissao` com os campos do Prisma:
  ```ts
  {
    id: number
    nomeClinica: string
    nomeEmpresa?: string | null
    nomeTitular: string
    status: string
    createdAt: Date
    medicos: { id: number; nome: string; tipo: string }[]
  }
  ```
- Card clicável que linka para `/admin/submissao/${id}` (usar `next/link` ou `onClick` com `router.push`)
- Exibir:
  - **Nome da clínica** (bold, texto maior)
  - `StatusBadge` (importar de `@/components/ui/StatusBadge`)
  - Nome do titular
  - Quantidade de médicos (ex: `3 usuários`) + tipos (ex: `2 examinadores, 1 solicitante`)
  - Data formatada em português (`createdAt.toLocaleDateString('pt-BR')`)
- Dark mode e estilo consistente com o placeholder existente:
  - Card: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6`
- Hover: levemente mais opaco ou borda destacada

## Commit

```
feat(admin): criar SubmissaoCard com link para detalhe e info dos usuários
```
