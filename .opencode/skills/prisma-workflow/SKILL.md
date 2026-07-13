---
name: prisma-workflow
description: Run and change the Prisma v7 + SQLite (better-sqlite3) database layer safely — schema edits, migrations, generate, and seed in this Next.js project.
license: MIT
compatibility: opencode
---

# Prisma Workflow

Database is **Prisma v7 + SQLite** via the **better-sqlite3** adapter built in `lib/prisma.ts`
(`PrismaBetterSqlite3`). The DB file is `dev.db` (gitignored). Never touch it directly.

## Change the schema
1. Edit `prisma/schema.prisma`.
2. Generate a migration (this also runs `prisma generate` automatically):
   ```bash
   pnpm prisma migrate dev --name <short-kebab-name>
   ```
3. **Do NOT hand-edit** the generated SQL under `prisma/migrations/`.

## Generate client only
`postinstall` runs `prisma generate` automatically after `pnpm install`. To force it:
```bash
pnpm exec prisma generate
```

## Seed
Seed runs through `pnpm prisma db seed` (wired in `prisma.config.ts` + `package.json`, not
the schema datasource). Admin seed: `admin@eitati.com` / `admin123`.

## First-run setup
```bash
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma db seed
```

## Notes
- Prisma v7 uses BOTH the schema `datasource` and `prisma.config.ts` (migrations path + seed).
  Keep `prisma.config.ts` as the source of the seed/migration config.
- The adapter is constructed once in `lib/prisma.ts` as a singleton — import `prisma` from
  there, never instantiate `new PrismaClient()` elsewhere.
- Datasource URL comes from `DATABASE_URL` (`file:./dev.db` in `.env.example`).
