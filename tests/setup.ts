import { config } from 'dotenv'
import path from 'node:path'

// Carrega variáveis de ambiente de teste (DB isolado, segredos dummy, Jira mock).
config({ path: path.resolve(process.cwd(), '.env.test') })

// Força caminho absoluto para o banco de teste, garantindo que o CLI do Prisma
// (resolve relativo à pasta `prisma/`) e o client Prisma em runtime (resolve
// relativo ao cwd) apontem para o mesmo arquivo.
const testDbPath = path.resolve(process.cwd(), 'test.db')
process.env.DATABASE_URL = `file:${testDbPath}`
