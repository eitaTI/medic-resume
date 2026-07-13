# Task 1: Server Actions de Admins

✅ **Concluído** — criar `actions/admins.ts`

Criado `actions/admins.ts` (`'use server'`):

- **`criarAdmin({ nome, email, senha })`**:
  - Verifica sessão com `auth.api.getSession({ headers: await headers() })`
  - Valida campos e tamanho mínimo de senha (6)
  - Impede email duplicado (`prisma.user.findUnique`)
  - Cria `User` + `Account` (providerId `credential`) com senha hasheada via
    `hashPassword` de `@better-auth/utils/password` (mesmo padrão de `prisma/seed.ts`)
  - Retorna `{ sucesso: true }` ou `{ erro: '...' }`

- **`excluirAdmin(id)`**:
  - Verifica sessão
  - Impede auto-exclusão (compara com `session.user.id`)
  - Impede exclusão do último admin (`prisma.user.count`)
  - Remove o `User` (cascade remove a `Account`)
  - Retorna `{ sucesso: true }` ou `{ erro: '...' }`

> Observação: o modelo `Admin` foi removido (ver migração `reconcile_admin_to_user`);
> administradores são registros do `User` do Better Auth. Não há campo `senha` no
> modelo `User` — a senha vive em `Account` (credential). O hash usa
> `@better-auth/utils/password`, não `bcryptjs`.

## Commit

```
feat(admin): criar server actions de admins (criar/excluir)
```
