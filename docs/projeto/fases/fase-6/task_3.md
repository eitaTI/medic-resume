# Task 3: Página de Usuários

⚠️ **Placeholder criado** — `app/admin/usuarios/page.tsx`

Placeholder criado na Fase 4 para evitar 404 nas rotas do navbar. Implementação completa pendente. Rota renomeada de `/admin/admins` para `/admin/usuarios`.

Criar `app/admin/usuarios/page.tsx` (Server Component):
- Buscar todos os admins do Prisma ordenados por `createdAt desc`
- Título "Gerenciar Usuários"
- Renderizar `AdminForm` no topo
- Seção "Usuários Cadastrados": lista com nome (bold), email, data de criação formatada (pt-BR)
- Mensagem "Nenhum usuário cadastrado" se lista vazia

## Commit

```
feat(admin): criar página de gerenciamento de usuários
```
