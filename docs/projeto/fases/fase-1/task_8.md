# Task 8: Better Auth Configurado

✅ **Concluído** — `lib/auth.ts` + `app/api/auth/[...all]/route.ts`

### `lib/auth.ts`
- Configurar `betterAuth` com `prismaAdapter` (SQLite)
- Habilitar `emailAndPassword`

### `app/api/auth/[...all]/route.ts`
- Rota catch-all que expõe `GET` e `POST` via `toNextJsHandler`
- **Obrigatório** — sem ela o Better Auth não processa requisições HTTP

## Commits

```
feat(auth): configurar Better Auth com Prisma adapter e email/password
feat(auth): criar rota API do Better Auth para handlers HTTP
```
