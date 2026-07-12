# Task 2: Implementar Gestão de Administradores (Fase 6 — CRUD real)

❌ **Pendente**

## Problema

A Fase 6 está marcada como ✅ nos `task_1/2/3.md`, mas não foi implementada:
- `actions/admins.ts` — **inexistente**
- `components/admin/AdminForm.tsx` — **inexistente**
- `app/admin/usuarios/page.tsx` — apenas lista read-only (`prisma.user`), sem criar/excluir

Não há como criar ou remover administradores pela UI.

## O que fazer

1. Criar `actions/admins.ts` (`'use server'`) com:
   - `criarAdmin({ nome, email, senha })` — usa Better Auth `auth.api.signUpEmail` ou cria `User` + `password` hash (scrypt, igual ao `prisma/seed.ts`); retorna `{ erro }` / `{ sucesso }`.
   - `excluirAdmin(id)` — impede autoexclusão e exclusão do último admin; remove o `User`.
   - Ambas com checagem de sessão (`auth.api.getSession` + `headers()` aguardado) e retorno em objeto (nunca `throw`).
2. Criar `components/admin/AdminForm.tsx` (client) com `useActionState` para criar admin (inline feedback, nunca `alert()`).
3. Refatorar `app/admin/usuarios/page.tsx` para:
   - Listar admins com botão de excluir (com confirmação inline);
   - Incluir o `AdminForm`;
   - Respeitar a proteção de layout `/admin` já existente.

## Critérios de aceite

- [ ] `actions/admins.ts` existe com `criarAdmin`/`excluirAdmin`, checagem de sessão e retorno em objeto
- [ ] `AdminForm.tsx` usa `useActionState` e feedback inline
- [ ] `/admin/usuarios` permite criar e excluir admins (com guardas)
- [ ] Não é possível excluir a si mesmo nem o último admin
- [ ] `pnpm build` e `pnpm lint` passam

## Commit

```
feat(admin): implementar CRUD de administradores (Fase 6)
```
