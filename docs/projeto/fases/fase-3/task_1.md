# Task 1: Configuração do Better Auth

✅ **Concluído** — `lib/auth.ts` + `app/api/auth/[...all]/route.ts`

### `lib/auth.ts`
- Importar `betterAuth` e `prismaAdapter`
- Configurar com adapter Prisma (SQLite)
- Habilitar `emailAndPassword`

### `app/api/auth/[...all]/route.ts`
- Importar `auth` de `@/lib/auth` e `toNextJsHandler` de `better-auth/next-js`
- Exportar `{ GET, POST }` do handler
- **Obrigatório** — sem esta rota, o Better Auth não processa chamadas HTTP

## Commits

```
feat(auth): configurar Better Auth com Prisma adapter e email/password
feat(auth): criar rota API do Better Auth para handlers HTTP
```
