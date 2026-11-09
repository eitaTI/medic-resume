import { dbPush, dbSeed } from '../helpers/run'
import { E2E_DB } from './e2e-constants'

export default async function globalSetup() {
  const env = { ...process.env, DATABASE_URL: E2E_DB }

  // Via binários locais (sem `pnpm exec` — quebra no Windows/mise) e com
  // stdio herdado, para o erro real aparecer no log em vez de um genérico.
  dbPush(env)
  dbSeed(env)
}
