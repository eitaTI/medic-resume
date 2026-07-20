import { describe, it, expect, beforeAll } from 'vitest'
import { resetTestDb } from '@/tests/helpers/db'
import { prisma } from '@/lib/prisma'

describe('smoke: tooling de teste', () => {
  beforeAll(async () => {
    await resetTestDb()
  })

  it('sobe o banco de teste e aplica o seed do admin', async () => {
    const admin = await prisma.user.findUnique({ where: { email: 'admin@eitati.com' } })
    expect(admin).not.toBeNull()
    expect(admin?.email).toBe('admin@eitati.com')
  })

  it('consegue inserir e ler um registro de auditoria', async () => {
    const antes = await prisma.auditLog.count()
    await prisma.auditLog.create({
      data: { acao: 'LOGIN', entidade: 'User', detalhes: '{}' },
    })
    const depois = await prisma.auditLog.count()
    expect(depois).toBe(antes + 1)
  })
})
