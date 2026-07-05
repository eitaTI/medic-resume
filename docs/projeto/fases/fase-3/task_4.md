# Task 4: Middleware de Proteção

❌ **Pendente** — criar `middleware.ts` na raiz

Criar `middleware.ts`:
- Exportar `middleware` function que recebe `NextRequest`
- Verificar cookie `session`
- Rotas `/admin/:path*` sem cookie → redirect para `/login`
- Rota `/login` com cookie → redirect para `/admin`
- Config `matcher: ['/admin/:path*', '/login']`

## Commit

```
feat(auth): criar middleware de proteção para rotas /admin
```
