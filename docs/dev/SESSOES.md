# Registro de Sessões

Histórico cronológico resumido das sessões de desenvolvimento/manutenção, com o
essencial para retomar contexto (o que foi feito, decisões e pendências).

## 2026-10-07 (manhã) — Correção de segurança + deploy

- Corrigidas as 85 vulnerabilidades do Dependabot (0 critical restantes).
- **PR #30** (`fix/security-updates`, squash `7c39657`): bump `next`/`eslint-config-next`
  → 16.3.8, `vitest` → 4.1.11; bloco `overrides` movido para `pnpm-workspace.yaml`
  (pnpm 11 não lê mais `pnpm.overrides` do `package.json`).
- **PR #31** (`fix/docker-workspace`, merge `10ff298`): `Dockerfile` passou a copiar
  `pnpm-workspace.yaml` no contexto — corrige build CI que falhava com
  `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` (frozen-lockfile).
- Build GHCR `main` success; redeploy de produção com imagem `242ed...`; container
  healthy, `/api/health` 200, `next 16.3.8` confirmado no container.
- Validações: `pnpm lint` 0 erros, `pnpm build` OK, 85 testes OK, `prisma generate` OK.
- Pendência: `braces@3.0.4` ainda não existe no npm (3.0.3 é o latest) — única vuln
  restante no audit (high, dev-only via eslint).

## 2026-10-07 (tarde) — Atualização de documentação

- **PR #32** (`docs/atualizacao`, squash `2058bd7`): limpeza de docs após a sessão acima.
- `AGENTS.md`: removidas refs órfãs a `docs/projeto/fases/` (pasta apagada em `64b0942`);
  documentados `pnpm-workspace.yaml` no build e limites de upload (10 MB/arquivo,
  35 MB/submissão via `bodySizeLimit`).
- `docs/guides/deploy.md`: nova seção "Limites de upload" e nota sobre o `pnpm-workspace.yaml`.
- Removida a skill obsoleta `.opencode/skills/fase-status/SKILL.md`.
- Observação de infra: houve incidente transitório no receive-pack do GitHub (500 em
  todo `git push`); resolveu sozinho após ~3 min. `gh pr create` com body markdown
  continua quebrando no GraphQL — seguir usando `--body-file` + `gh api PATCH` se preciso.