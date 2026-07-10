---
name: server-action
description: Author Next.js Server Actions and their client callers in this project — 'use server' files, result-object returns, Better Auth session checks, and useActionState UI (never alert()).
license: MIT
compatibility: opencode
---

# Server Actions & UI Conventions

## Server Actions (`actions/*.ts`)
- Every action file starts with `'use server'`.
- Return a **result object**, never throw to the client:
  - Success: `{ sucesso: true, ... }`
  - Failure: `{ erro: 'mensagem legível' }`
- Session check (Better Auth) — `headers()` MUST be awaited:
  ```ts
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { erro: 'Não autenticado' }
  ```
- Import the Prisma client from `@/lib/prisma` and auth from `@/lib/auth`.

## Client callers (`components/**/*.tsx`)
- Mark interactive components with `'use client'`.
- Use `useActionState` for pending/feedback state (NOT `useState` polling).
- **Never use `alert()`** — show inline messages from the action result.
- After a successful mutation, call `router.refresh()` (from `next/navigation`) and/or
  `revalidatePath(...)` inside the action.

## Auth / routing
- `middleware.ts` guards `/admin` and `/api/uploads` using the cookie
  `better-auth.session_token`. Keep that exact name if you touch auth.
- `/login` redirects to `/admin` when already authenticated.

## Imports
- Path alias `@/*` → repo root (`tsconfig.json`). Prefer it over relative `../` chains.
