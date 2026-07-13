# Task 3: Página de Usuários

✅ **Concluído** — `app/admin/usuarios/page.tsx`

Implementação completa da página de gerenciamento de usuários (rota renomeada de
`/admin/admins` para `/admin/usuarios` na Fase 4).

`app/admin/usuarios/page.tsx` (Server Component):
- Busca todos os `User` ordenados por `createdAt desc`
- Título "Gerenciar Usuários"
- Renderiza `AdminForm` no topo (criação)
- Seção "Usuários Cadastrados": lista com nome (bold), email e data de criação (pt-BR)
- Botão "Excluir" por usuário via `AdminDeleteButton` (confirmação inline, com guardas
  de auto-exclusão e último admin); o próprio usuário logado não aparece com botão
- Mensagem "Nenhum usuário cadastrado" se lista vazia

## Commit

```
feat(admin): criar página de gerenciamento de usuários
```
