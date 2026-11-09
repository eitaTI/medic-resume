import { createRequire } from 'node:module'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const require = createRequire(import.meta.url)

function createPrismaClient() {
  try {
    // Fail-fast de ABI: better-sqlite3 é nativo (compilado p/ Node 24). Sem
    // este guard, um Node errado explode com ERR_DLOPEN_FAILED críptico.
    require('better-sqlite3')
  } catch {
    throw new Error(
      '[lib/prisma] better-sqlite3 não carregou — provavelmente o Node atual ' +
        `(${process.version}) não é o Node 24 do projeto (veja mise.toml). ` +
        'Use o Node do projeto para dev/test.',
    )
  }
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma