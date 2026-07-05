# Task 6: Dashboard Admin

❌ **Pendente** — criar `app/admin/page.tsx` (Server Component)

Criar `app/admin/page.tsx` (Server Component):
- Ler `searchParams.status` para filtrar
- Chamar `listarSubmissoes(searchParams.status)` de `@/actions/submissoes`
- Título "Submissões"
- Filtros por status: links "Todas" / "Pendente" / "Aprovada" / "Rejeitada" como badges clicáveis (azul se ativo, cinza se não)
- Grid responsivo de `SubmissaoCard` (1 coluna mobile, 2 tablet, 3 desktop)
- Mensagem "Nenhuma submissão encontrada" se lista vazia
- Usar `SubmissaoCard` de `@/components/admin/SubmissaoCard`

## Commit

```
feat(admin): criar dashboard com lista de submissões e filtro por status
```
