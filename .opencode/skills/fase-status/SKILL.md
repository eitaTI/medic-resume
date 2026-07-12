---
name: fase-status
description: Check what is actually implemented in this project before assuming a feature exists — read the per-phase task docs in docs/projeto/fases/ instead of guessing.
license: MIT
compatibility: opencode
---

# Fase Status (Implementation Truth)

This repo tracks progress per phase in `docs/projeto/fases/`. Do NOT assume a feature is
done just because a doc mentions it — verify the ✅/❌ status first.

## How to check
1. Read `docs/projeto/fases/index.md` for the overall phase table (tasks done / pending).
2. For a specific phase, open `docs/projeto/fases/fase-N/index.md` and its `task_*.md`
   files. Each task is marked ✅ (done) or ❌ (pending).
3. When a task is ❌, the corresponding code likely does NOT exist yet — confirm in the
   repo before building on top of it.

## Current state (verify, may be stale)
- Fases 1–7: implemented (incl. Jira Fase 5 e Auditoria Fase 7).
- Fase 8 (Backup): scripts `backup.sh`/`restore.sh` e serviço no docker-compose prontos;
  resta tornar os scripts compatíveis com Docker (env vars) e testar backup/restore.
- Fase 9 (Docker): pendente (sem Dockerfile/.dockerignore/.env.production; compose é placeholder).

## Why this matters
Tasks often describe the *intended* design (e.g. new columns, new actions) that are not
yet in code. Reading the task files prevents inventing `pnpm test`, assuming columns
exist, or writing code that conflicts with the planned schema/actions.
