import { config } from 'dotenv'
import path from 'node:path'

// Fail-fast de ABI: o better-sqlite3 é nativo e foi compilado para o Node 24
// (NODE_MODULE_VERSION 137). Com outro Node o erro seria um ERR_DLOPEN_FAILED
// críptico no primeiro acesso ao banco — aborta aqui com a causa e a solução.
const abi = (process.versions as Record<string, string>).modules
if (abi !== '137') {
  throw new Error(
    `[tests/setup] better-sqlite3 foi compilado para NODE_MODULE_VERSION 137 (Node 24), ` +
      `mas o Node atual é ${process.version} (ABI ${abi}). ` +
      `Use o Node 24 (mise.toml já fixa: rode com o Node do projeto).`,
  )
}

// Carrega variáveis de ambiente de teste (DB isolado, segredos dummy, Jira mock).
config({ path: path.resolve(process.cwd(), '.env.test') })

// Banco por worker: cada worker do Vitest recebe seu próprio `test-w<id>.db`,
// então arquivos de teste em paralelo nunca disputam o mesmo SQLite —
// `fileParallelism: false` não é mais necessário. `resetTestDb()` recria o
// arquivo a cada `beforeAll` via `db push --force-reset`, então reruns com o
// mesmo worker id são seguros. Arquivos órfãos de runs abortados ficam na
// raiz (gitignored via `test-*.db`); são pequenos e inofensivos.
const workerId = process.env.VITEST_WORKER_ID ?? String(process.pid)
const testDbPath = path.resolve(process.cwd(), `test-w${workerId}.db`)
process.env.DATABASE_URL = `file:${testDbPath}`
