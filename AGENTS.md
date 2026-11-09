# AGENTS.md

Compact guidance for OpenCode sessions. For full context read `docs/dev/ARQUITETURA.md` and `CONTRIBUTING.md` (both verified).

## Commands
- Package manager is **pnpm** (not npm). Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`.
- Toolchain is pinned: `mise.toml` (`node 24`, `pnpm 11`) + `engines` in `package.json`. Always run with the project Node — `tests/setup.ts` and `lib/prisma.ts` fail fast otherwise (better-sqlite3 ABI 137).
- Tests: Vitest (unit/api) via `pnpm test` / `pnpm test:unit` (parallel, one `test-w<id>.db` per worker), Playwright e2e via `pnpm test:e2e` (external network mocked via `page.route`, never real BrasilAPI). Live Jira test is gated by `RUN_JIRA_LIVE=1`.
- Test CLIs run via local binaries (`tests/helpers/run.ts`) — never `pnpm exec` inside tests (breaks on Windows/mise), stdio inherited so real errors surface.
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
- `pnpm-workspace.yaml` holds the `overrides` pinning patched versions for transitive deps (sec). The `Dockerfile` copies it into the build context — keep that COPY line or `pnpm install --frozen-lockfile` fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`.
- Uploads: `lib/limites.ts` defines `MAX_ARQUIVO_MB` (10) and `MAX_SUBMISSAO_MB` (35); the server side enforces the submission cap via `next.config.ts` `experimental.serverActions.bodySizeLimit`.
- Uploads live in `data/uploads/` (outside `public/`, LGPD) and are served via `/api/uploads`.

## Git / workflow
- Branches: `tipo/tarefa-curta` (e.g. `feat/jira`). Commits: `tipo(escopo): descrição`.
- The old per-phase docs (`docs/projeto/fases/`) were removed in `64b0942` — don't expect them to exist.

## Skills (auto-loaded on demand)
OpenCode discovers skills in `.opencode/skills/<name>/SKILL.md` at session start and lists
them in `<available_skills>`. **Load the relevant one via the `skill` tool whenever the task
matches its description** — no manual/user command needed. Current skills:
- `prisma-workflow` — Prisma v7 + SQLite (better-sqlite3) schema/migration/seed.
- `server-action` — Server Actions (`'use server'`, result objects) and `useActionState` UI.
- `jira-integration` — Fase 5 Jira scope (fail-open, `jiraSyncStatus`, `sincronizarJira`).
- `admin-management` — manage admin users via Better Auth `User` (`actions/admins.ts`, no `Admin` model).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
