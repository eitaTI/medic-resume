# Task 6: Dashboard Admin

✅ **Concluído** — refazer `app/admin/page.tsx` como Server Component

O arquivo atual é um placeholder `'use client'` simples. Deve ser substituído por um Server Component completo.

**Requisitos:**

- Server Component (sem `'use client'`, sem hooks)
- Ler `searchParams.status` para filtrar (Next.js 15: `searchParams` é uma Promise — usar `const searchParams = await props.searchParams`)
- Chamar `listarSubmissoes({ status: searchParams.status })` de `@/actions/submissoes`
- **Título**: "Submissões"
- **Filtros por status**: links estilizados como badges clicáveis:
  - `Todas` / `Pendente` / `Aprovada` / `Rejeitada`
  - Badge ativo: `bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300`
  - Badge inativo: `bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400`
  - Cada link navega para `?status=VALOR` (ou `/admin` para "Todas")
- **Grid responsivo** de `SubmissaoCard`:
  - 1 coluna em mobile (`grid-cols-1`)
  - 2 colunas em tablet (`sm:grid-cols-2`)
  - 3 colunas em desktop (`lg:grid-cols-3`)
  - Gap: `gap-4 sm:gap-6`
- Se lista vazia: mensagem centralizada "Nenhuma submissão encontrada"
- Importar:
  - `listarSubmissoes` de `@/actions/submissoes`
  - `SubmissaoCard` de `@/components/admin/SubmissaoCard`
  - `StatusBadge` de `@/components/ui/StatusBadge` (para os filtros)
- **Estilo**: o layout já vai prover o fundo com wallpaper e o container `max-w-7xl`, então o conteúdo da página não precisa repetir

## Commit

```
feat(admin): criar dashboard Server Component com filtros e grid de cards
```
