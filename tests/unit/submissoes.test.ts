import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}))
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))
vi.mock('next/cache', () => ({ revalidatePath: () => {} }))
vi.mock('@/lib/jira', () => ({ criarCardJira: vi.fn() }))

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { criarCardJira } from '@/lib/jira'
import {
  listarSubmissoes,
  detalharSubmissao,
  aprovarSubmissao,
  sincronizarJira,
  rejeitarSubmissao,
} from '@/actions/submissoes'
import { resetTestDb } from '@/tests/helpers/db'

const ADMIN = { user: { id: 'admin-test-id' } }

async function criarClinica(status = 'PENDENTE', jiraSyncStatus: string | null = null) {
  return prisma.clinica.create({
    data: {
      nomeClinica: 'Clínica Teste',
      nomeTitular: 'Titular Completo da Silva',
      emailTitular: 't@c.com',
      celularTitular: '11999998888',
      documentoTitular: '12345678901',
      cnpjEmpresa: '12345678000195',
      quantidadeMedicos: 1,
      status,
      ...(jiraSyncStatus ? { jiraSyncStatus } : {}),
    },
  })
}

describe('actions/submissoes', () => {
  beforeAll(async () => {
    await resetTestDb()
  })

  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
    vi.mocked(criarCardJira).mockReset()
  })

  describe('listarSubmissoes', () => {
    it('exige autenticação', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
      const r = await listarSubmissoes()
      expect(r).toEqual({ erro: 'Não autenticado' })
    })
    it('retorna lista de clínicas', async () => {
      await criarClinica()
      const r = await listarSubmissoes()
      expect(Array.isArray(r)).toBe(true)
    })
    it('filtra por status', async () => {
      await criarClinica('APROVADA')
      const r = await listarSubmissoes({ status: 'APROVADA' })
      expect(Array.isArray(r)).toBe(true)
      if (Array.isArray(r)) expect(r.every((c: any) => c.status === 'APROVADA')).toBe(true)
    })
  })

  describe('detalharSubmissao', () => {
    it('retorna erro se não autenticado', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
      const r = await detalharSubmissao(999)
      expect(r).toEqual({ erro: 'Não autenticado' })
    })
    it('retorna a submissão com relações', async () => {
      const c = await criarClinica()
      const r = await detalharSubmissao(c.id)
      expect((r as any).id).toBe(c.id)
      expect((r as any).medicos).toBeDefined()
    })
    it('erro se não encontrada', async () => {
      const r = await detalharSubmissao(999999)
      expect(r).toEqual({ erro: 'Submissão não encontrada' })
    })
  })

  describe('aprovarSubmissao', () => {
    it('aprova e sincroniza com Jira (sucesso)', async () => {
      vi.mocked(criarCardJira).mockResolvedValue('EITATI-1')
      const c = await criarClinica()
      const r = await aprovarSubmissao(c.id)
      expect(r).toMatchObject({ sucesso: true, jiraIssueKey: 'EITATI-1' })
      const atual = await prisma.clinica.findUnique({ where: { id: c.id } })
      expect(atual?.status).toBe('APROVADA')
      expect(atual?.jiraSyncStatus).toBe('SINCRONIZADO')
      expect(atual?.jiraIssueKey).toBe('EITATI-1')
    })

    it('aprova mas marca ERRO de Jira (fail-open)', async () => {
      vi.mocked(criarCardJira).mockRejectedValue(new Error('jira down'))
      const c = await criarClinica()
      const r = await aprovarSubmissao(c.id)
      // ainda retorna sucesso (fail-open)
      expect(r).toMatchObject({ sucesso: true })
      expect((r as any).jiraErro).toBeTruthy()
      const atual = await prisma.clinica.findUnique({ where: { id: c.id } })
      expect(atual?.status).toBe('APROVADA')
      expect(atual?.jiraSyncStatus).toBe('ERRO')
    })
  })

  describe('sincronizarJira', () => {
    it('erro se não aprovada', async () => {
      const c = await criarClinica('PENDENTE')
      const r = await sincronizarJira(c.id)
      expect(r).toEqual({ erro: 'A clínica não está aprovada' })
    })
    it('erro se já sincronizada', async () => {
      const c = await criarClinica('APROVADA', 'SINCRONIZADO')
      const r = await sincronizarJira(c.id)
      expect(r).toEqual({ erro: 'Jira já sincronizado' })
    })
    it('sincroniza com sucesso', async () => {
      vi.mocked(criarCardJira).mockResolvedValue('EITATI-9')
      const c = await criarClinica('APROVADA', 'PENDENTE')
      const r = await sincronizarJira(c.id)
      expect(r).toMatchObject({ sucesso: true, jiraIssueKey: 'EITATI-9' })
      const atual = await prisma.clinica.findUnique({ where: { id: c.id } })
      expect(atual?.jiraSyncStatus).toBe('SINCRONIZADO')
    })
    it('falha fechado se Jira der erro', async () => {
      vi.mocked(criarCardJira).mockRejectedValue(new Error('boom'))
      const c = await criarClinica('APROVADA', 'PENDENTE')
      const r = await sincronizarJira(c.id)
      expect(r).toHaveProperty('erro')
    })
  })

  describe('rejeitarSubmissao', () => {
    it('rejeita com motivo', async () => {
      const c = await criarClinica()
      const r = await rejeitarSubmissao(c.id, 'Documento inválido')
      expect(r).toMatchObject({ sucesso: true })
      const atual = await prisma.clinica.findUnique({ where: { id: c.id } })
      expect(atual?.status).toBe('REJEITADA')
      expect(atual?.motivoRejeicao).toBe('Documento inválido')
    })
  })
})
