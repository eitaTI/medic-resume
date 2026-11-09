import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { dbPush, dbSeed } from './run'

/**
 * Recria o banco de testes do zero (schema + seed) via binários locais
 * (`node_modules/.bin/prisma|tsx`) — sem passar por `pnpm exec`, que quebra
 * em setups Windows/mise. Roda `setupFiles: tests/setup.ts` antes (define
 * DATABASE_URL por worker em `test-<pid>.db`), então cada arquivo de teste
 * tem seu próprio banco e o Vitest pode paralelizar.
 */
export async function resetTestDb() {
  const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL! }

  dbPush(env)
  dbSeed(env)

  // Usuário fixo usado como autor das ações de auditoria nos testes
  // (registrarAcao grava auditLog.userId, que é FK obrigatória para User).
  await prisma.user.upsert({
    where: { id: 'admin-test-id' },
    update: {},
    create: {
      id: 'admin-test-id',
      name: 'Admin Teste',
      email: 'admin-test-id@eitati.com',
      emailVerified: true,
    },
  })
}

/**
 * Cria um registro de sessão válido para o admin de seed e retorna o token.
 * Use junto com um mock de `next/headers` que injeta o cookie
 * `better-auth.session_token=<token>` nas actions/rotas protegidas.
 */
export async function criarSessaoAdmin(): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email: 'admin@eitati.com' } })
  if (!user) throw new Error('Admin de seed não encontrado. Rode resetTestDb() antes.')

  const token = `test-session-${randomUUID()}`
  await prisma.session.create({
    data: {
      id: randomUUID(),
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })
  return token
}
