import { execSync } from 'node:child_process'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

/**
 * Recria o banco de testes do zero (schema + seed) usando `prisma db push`.
 * O caminho do banco vem de DATABASE_URL (definido em tests/setup.ts como
 * absolute path -> test.db na raiz), compartilhado entre o CLI e o client.
 */
export async function resetTestDb() {
  const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL! }

  execSync('pnpm exec prisma db push --force-reset --accept-data-loss', {
    cwd: process.cwd(),
    stdio: 'ignore',
    env,
  })

  execSync('pnpm exec tsx prisma/seed.ts', {
    cwd: process.cwd(),
    stdio: 'ignore',
    env,
  })

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

/** Caminho absoluto do banco de testes (mesmo usado por setup.ts). */
export const TEST_DB_PATH = path.resolve(process.cwd(), 'test.db')
