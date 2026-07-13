# Task 4: Middleware de Proteção

✅ **Concluído** — `middleware.ts` criado na raiz

Criar `middleware.ts`:
- Exportar `middleware` function que recebe `NextRequest`
- Verificar cookie de sessão do Better Auth (`better-auth.session_token`)
- Rotas `/admin/:path*` ou `/api/uploads/:path*` sem cookie → redirect para `/login`
- Rota `/login` com cookie → redirect para `/admin`
- Config `matcher: ['/admin/:path*', '/login', '/api/uploads/:path*']`

> Observação: o cookie de sessão do Better Auth é `better-auth.session_token` (não
> `session`). O matcher também protege `/api/uploads` (uploads fora do `public`, LGPD),
> alinhado ao `AGENTS.md`.

## Commit

```
feat(auth): criar middleware de proteção para rotas /admin
```
