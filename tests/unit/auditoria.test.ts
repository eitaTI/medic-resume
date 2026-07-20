import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}))
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { listarAuditoria } from '@/actions/auditoria'
import { resetTestDb } from '@/tests/helpers/db'

const ADMIN = { user: { id: 'admin-test-id' } }

describe('listarAuditoria', () => {
  beforeAll(async () => {
    await resetTestDb()
    await prisma.user.upsert({
      where: { id: 'outro-user' },
      update: {},
      create: { id: 'outro-user', name: 'Outro', email: 'outro@eitati.com', emailVerified: true },
    })
  })

  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
  })

  it('exige autenticação', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
    const r = await listarAuditoria()
    expect(r).toEqual({ erro: 'Não autenticado' })
  })

  it('filtra por ação', async () => {
    await prisma.auditLog.createMany({
      data: [
        { userId: 'admin-test-id', acao: 'APROVAR', entidade: 'Clinica', detalhes: '{}' },
        { userId: 'admin-test-id', acao: 'REJEITAR', entidade: 'Clinica', detalhes: '{}' },
      ],
    })
    const r = await listarAuditoria({ acao: 'APROVAR' })
    expect(Array.isArray(r)).toBe(true)
    if (Array.isArray(r)) expect(r.every((l: any) => l.acao === 'APROVAR')).toBe(true)
  })

  it('filtra por usuário', async () => {
    await prisma.auditLog.create({
      data: { userId: 'outro-user', acao: 'LOGIN', entidade: 'User', detalhes: '{}' },
    })
    const r = await listarAuditoria({ userId: 'admin-test-id' })
    expect(Array.isArray(r)).toBe(true)
    if (Array.isArray(r)) expect(r.every((l: any) => l.userId === 'admin-test-id')).toBe(true)
  })

  it('filtra por período de datas', async () => {
    const ontem = new Date()
    ontem.setDate(ontem.getDate() - 1)
    const antiga = new Date()
    antiga.setDate(antiga.getDate() - 30)
    await prisma.auditLog.createMany({
      data: [
        { userId: 'admin-test-id', acao: 'CRIAR', entidade: 'User', detalhes: '{}', createdAt: ontem },
        { userId: 'admin-test-id', acao: 'CRIAR', entidade: 'User', detalhes: '{}', createdAt: antiga },
      ],
    })
    const r = await listarAuditoria({
      dataInicio: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    })
    expect(Array.isArray(r)).toBe(true)
    if (Array.isArray(r)) expect(r.every((l: any) => new Date(l.createdAt) >= antiga)).toBe(true)
    // a log de 30 dias atrás não deve aparecer
    if (Array.isArray(r)) expect(r.find((l: any) => new Date(l.createdAt) < ontem)).toBeUndefined()
  })

  it('limita a 50 registros', async () => {
    await prisma.auditLog.createMany({
      data: Array.from({ length: 60 }, () => ({
        userId: 'admin-test-id',
        acao: 'CRIAR',
        entidade: 'User',
        detalhes: '{}',
      })),
    })
    const r = await listarAuditoria()
    expect(Array.isArray(r)).toBe(true)
    if (Array.isArray(r)) expect(r.length).toBeLessThanOrEqual(50)
  })
})
