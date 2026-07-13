---
name: admin-management
description: Manage admin users in this project — admins are Better Auth User records (the legacy Admin model was dropped); use actions/admins.ts (criarAdmin/excluirAdmin) with hashPassword, guards, and audit logging.
license: MIT
compatibility: opencode
---

# Admin Management

Admins are **Better Auth `User` records** — the legacy `Admin` model/table was dropped in
migration `reconcile_admin_to_user`. There is **no `Admin` table and no `adminId` column**;
audit logs and actions reference `userId` (→ `User`).

## Create / delete (`actions/admins.ts`)
- `criarAdmin({ nome, email, senha })`: creates a Better Auth `User` + linked `Account`
  (credential), with the password hashed via `hashPassword` from `@better-auth/utils/password`.
  Always check the session first with `auth.api.getSession({ headers: await headers() })`.
- `excluirAdmin(id)`: deletes the `User` (cascade removes its `Account`). Guards: cannot
  delete yourself, and cannot delete the last remaining admin.
- Both mutate and then call `registrarAcao({ userId: session.user.id, acao: 'CRIAR' | 'EXCLUIR',
  entidade: 'User', entidadeId: null })` for audit.

## UI
- `components/admin/AdminForm.tsx` — create form (`useActionState`, inline feedback, no `alert()`).
- `components/admin/AdminDeleteButton.tsx` — delete button with self/last-admin guards.
- Manage page: `app/admin/usuarios/page.tsx` (lists `User` records, excludes the current user
  from self-deletion).

## Conventions (load `server-action` skill too)
- Never reference an `Admin` model/table or `adminId` column — they do not exist.
- Follow `server-action` for session checks, `{ sucesso }`/`{ erro }` returns, and `useActionState`.
- After changing `actions/admins.ts`, run `pnpm build && pnpm lint`.
