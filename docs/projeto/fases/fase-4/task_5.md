# Task 5: Layout Protegido Admin

❌ **Pendente** — criar `app/admin/layout.tsx`

Criar `app/admin/layout.tsx` (Server Component):
- Verificar sessão com `auth()` — se não existir, `redirect('/login')`
- Navbar no topo: logo "ZScan Admin" à esquerda, links Dashboard/Admins/Auditoria à direita
- Navbar fixa com sombra, fundo branco
- Main content com `max-w-7xl mx-auto p-6` e fundo `bg-gray-50`

## Commit

```
feat(admin): criar layout protegido para rotas /admin com navbar
```
