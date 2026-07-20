import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn(), changePassword: vi.fn() } },
}))
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { criarAdmin, excluirAdmin, alterarSenha } from '@/actions/admins'
import { resetTestDb } from '@/tests/helpers/db'

const ADMIN = { user: { id: 'admin-test-id' } }

describe('actions/admins', () => {
  beforeEach(async () => {
    await resetTestDb()
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
    vi.mocked(auth.api.changePassword).mockReset()
  })

  describe('criarAdmin', () => {
    it('exige autenticação', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
      const r = await criarAdmin({ nome: 'X', email: 'x@e.com', senha: 'senha1' })
      expect(r).toEqual({ erro: 'Não autenticado' })
    })

    it('rejeita senha curta', async () => {
      const r = await criarAdmin({ nome: 'X', email: 'x@e.com', senha: '123' })
      expect(r).toEqual({ erro: 'A senha deve ter ao menos 6 caracteres' })
    })

    it('cria um novo administrador', async () => {
      const r = await criarAdmin({ nome: 'Novo', email: 'novo@eitati.com', senha: 'senha1' })
      expect(r).toEqual({ sucesso: true })
      const u = await prisma.user.findUnique({ where: { email: 'novo@eitati.com' } })
      expect(u).toBeTruthy()
    })

    it('rejeita email duplicado', async () => {
      await criarAdmin({ nome: 'Novo0', email: 'novo@eitati.com', senha: 'senha1' })
      const r = await criarAdmin({ nome: 'Novo2', email: 'novo@eitati.com', senha: 'senha1' })
      expect(r).toEqual({ erro: 'Já existe um usuário com este email' })
    })
  })

  describe('excluirAdmin', () => {
    it('bloqueia autoexclusão', async () => {
      const r = await excluirAdmin('admin-test-id')
      expect(r).toEqual({ erro: 'Você não pode excluir a si mesmo' })
    })

    it('bloqueia exclusão do último administrador', async () => {
      // remove o admin de seed para restar apenas o usuário de teste (count = 1)
      await prisma.user.delete({ where: { email: 'admin@eitati.com' } })
      const r = await excluirAdmin('qualquer-id')
      expect(r).toEqual({ erro: 'Não é possível excluir o último administrador' })
    })

    it('exclui outro administrador', async () => {
      await criarAdmin({ nome: 'Alvo', email: 'alvo@eitati.com', senha: 'senha1' })
      const alvo = await prisma.user.findUnique({ where: { email: 'alvo@eitati.com' } })
      const r = await excluirAdmin(alvo!.id)
      expect(r).toEqual({ sucesso: true })
      const apos = await prisma.user.findUnique({ where: { email: 'alvo@eitati.com' } })
      expect(apos).toBeNull()
    })
  })

  describe('alterarSenha', () => {
    it('rejeita senhas divergentes', async () => {
      const r = await alterarSenha({ senhaAtual: 'a', novaSenha: 'b', confirmarSenha: 'c' })
      expect(r).toEqual({ erro: 'A nova senha e a confirmação não coincidem' })
    })

    it('rejeita senha fraca (regex)', async () => {
      const r = await alterarSenha({ senhaAtual: 'a', novaSenha: 'fraca', confirmarSenha: 'fraca' })
      expect(r).toHaveProperty('erro')
    })

    it('altera com sucesso', async () => {
      vi.mocked(auth.api.changePassword).mockResolvedValue({} as any)
      const r = await alterarSenha({
        senhaAtual: 'atual1',
        novaSenha: 'Nova@123',
        confirmarSenha: 'Nova@123',
      })
      expect(r).toEqual({ sucesso: true })
      expect(auth.api.changePassword).toHaveBeenCalled()
    })
  })
})
