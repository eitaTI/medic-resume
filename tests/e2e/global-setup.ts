import { spawnSync } from 'node:child_process'
import path from 'node:path'

export const E2E_DB = 'file:./e2e.db'

export default async function globalSetup() {
  const root = path.resolve(__dirname, '../..')
  const env = { ...process.env, DATABASE_URL: E2E_DB }

  const push = spawnSync(
    'pnpm',
    ['exec', 'prisma', 'db', 'push', '--force-reset', '--accept-data-loss'],
    { cwd: root, stdio: 'inherit', env },
  )
  if (push.status !== 0) throw new Error('Falha ao aplicar o schema no banco de teste E2E')

  const seed = spawnSync('pnpm', ['exec', 'tsx', 'prisma/seed.ts'], {
    cwd: root,
    stdio: 'inherit',
    env,
  })
  if (seed.status !== 0) throw new Error('Falha ao popular o banco de teste E2E')
}
