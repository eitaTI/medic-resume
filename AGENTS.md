# AGENTS.md

Compact guidance for OpenCode sessions. For full context read `docs/dev/ARQUITETURA.md` and `CONTRIBUTING.md` (both verified).

## Commands
- Package manager is **pnpm** (not npm). Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`.
- Tests: Vitest (unit/api) via `pnpm test` / `pnpm test:unit`, Playwright e2e via `pnpm test:e2e`. Live Jira test is gated by `RUN_JIRA_LIVE=1`.
- First-run setup: `cp .env.example .env` → `pnpm prisma migrate dev` → `pnpm prisma db seed` (seed admin: `admin@eitati.com` / `admin123`).
- Before committing: `pnpm build && pnpm lint`.

## Database (Prisma v7 + SQLite)
- Uses the **better-sqlite3 adapter** built in `lib/prisma.ts` (`PrismaBetterSqlite3`); DB file is `dev.db` (gitignored).
- Schema change flow: edit `prisma/schema.prisma` → `pnpm prisma migrate dev --name <name>` (auto-runs `prisma generate`). Do not hand-edit migration SQL.
- Seed runs via `pnpm prisma db seed` (wired in `prisma.config.ts` + `package.json`).
- Prisma v7 uses `prisma.config.ts` (migrations path + seed) alongside the schema datasource.

## Auth
- Better Auth. Server-side session check inside Server Actions: `auth.api.getSession({ headers: await headers() })` — `headers()` must be awaited.
- **Admins are Better Auth `User` records** — the legacy `Admin` model/table was dropped in migration `reconcile_admin_to_user`. There is **no `Admin` table and no `adminId` column**; audit/actions use `userId` (→ `User`). Manage admins via `actions/admins.ts` (`criarAdmin`/`excluirAdmin`). See the `admin-management` skill.
- `/admin` is guarded by a server-side session check in `app/admin/layout.tsx` (redirects to `/login` when unauthenticated). Protected API routes (e.g. `/api/uploads`) check the session inline and return 401. The session cookie is Better Auth's default `better-auth.session_token` — keep that exact name when touching auth.
- `/login` redirects to `/admin` when already authenticated.

## Server Actions & UI conventions
- Server Actions live in `actions/*.ts`, start with `'use server'`, and return a result object: `{ erro: '...' }` or `{ sucesso: true, ... }` — never throw to the client.
- Client components use `useActionState` for pending/feedback; **never use `alert()`** — show inline messages instead.
- Import alias `@/*` → repo root (`tsconfig.json`).

## Build / deploy quirks
- `next.config.ts` must not remove `rewrites` (branding cache-busting). The Docker build copies full `node_modules` (no standalone output).
- `.npmrc` has `shamefully-hoist=true` (required for native deps like `better-sqlite3`/`prisma`). Keep it.
- Uploads live in `data/uploads/` (outside `public/`, LGPD) and are served via `/api/uploads`.

## Git / workflow
- Branches: `tipo/tarefa-curta` (e.g. `feat/jira`). Commits: `tipo(escopo): descrição`.
- Per-phase implementation status lives in `docs/projeto/fases/index.md` and `docs/projeto/fases/fase-N/` — consult before assuming a feature is implemented or pending.

## Skills (auto-loaded on demand)
OpenCode discovers skills in `.opencode/skills/<name>/SKILL.md` at session start and lists
them in `<available_skills>`. **Load the relevant one via the `skill` tool whenever the task
matches its description** — no manual/user command needed. Current skills:
- `prisma-workflow` — Prisma v7 + SQLite (better-sqlite3) schema/migration/seed.
- `server-action` — Server Actions (`'use server'`, result objects) and `useActionState` UI.
- `fase-status` — check `docs/projeto/fases/` before assuming a feature is implemented.
- `jira-integration` — Fase 5 Jira scope (fail-open, `jiraSyncStatus`, `sincronizarJira`).
- `admin-management` — manage admin users via Better Auth `User` (`actions/admins.ts`, no `Admin` model).
