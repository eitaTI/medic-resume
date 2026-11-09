import { spawnSync } from 'node:child_process'
import path from 'node:path'

/**
 * Executa um CLI do projeto com o Node atual, sem passar por `pnpm exec`.
 *
 * PORQUÊ: `pnpm exec` quebra em setups Windows/mise (shim não resolvido sem
 * shell) e `stdio: 'ignore'` escondia o erro real do prisma/seed. Chamando
 * `process.execPath` + o JS real do pacote, o teste roda em qualquer shell
 * com o Node que o invocou — sem depender do gerenciador de pacotes no PATH.
 */
export function runProjectBin(
  entry: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): void {
  const script = path.resolve(process.cwd(), 'node_modules', ...entry.split('/'))
  const r = spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...env },
  })
  if (r.status !== 0 || r.error) {
    const detalhe = r.error ? `: ${String(r.error.message ?? r.error)}` : ` (exit ${r.status})`
    throw new Error(`Falha em ${entry} ${args.join(' ')}${detalhe}`)
  }
}

/** Aplica o schema no banco apontado por DATABASE_URL (reset total). */
export function dbPush(env: NodeJS.ProcessEnv = process.env): void {
  runProjectBin('prisma/build/index.js', ['db', 'push', '--force-reset', '--accept-data-loss'], env)
}

/** Roda `prisma/seed.ts` (admin padrão + dados base). */
export function dbSeed(env: NodeJS.ProcessEnv = process.env): void {
  runProjectBin('tsx/dist/cli.mjs', ['prisma/seed.ts'], env)
}

