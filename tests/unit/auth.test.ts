import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: { api: { signInEmail: vi.fn(), getSession: vi.fn() } },
}))
vi.mock('@/lib/audit', () => ({ registrarAcao: vi.fn() }))
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))

import { auth } from '@/lib/auth'
import { registrarAcao } from '@/lib/audit'
import { login } from '@/actions/login'

describe('login (ação pública)', () => {
  beforeEach(() => {
    vi.mocked(auth.api.signInEmail).mockReset()
    vi.mocked(registrarAcao).mockReset()
  })

  it('exige email e senha', async () => {
    const fd = new FormData()
    const r = await login(fd)
    expect(r).toEqual({ erro: 'Email e senha são obrigatórios' })
  })

  it('retorna sucesso e registra LOGIN quando credenciais válidas', async () => {
    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: { id: 'u1', name: 'Admin', email: 'admin@eitati.com' },
    } as any)
    const fd = new FormData()
    fd.set('email', 'admin@eitati.com')
    fd.set('senha', 'admin123')
    const r = await login(fd)
    expect(r).toEqual({ sucesso: true })
    expect(registrarAcao).toHaveBeenCalledWith(
      expect.objectContaining({ acao: 'LOGIN', userId: 'u1' }),
    )
  })

  it('retorna erro genérico quando signInEmail falha', async () => {
    vi.mocked(auth.api.signInEmail).mockRejectedValue(new Error('invalid'))
    const fd = new FormData()
    fd.set('email', 'admin@eitati.com')
    fd.set('senha', 'errada')
    const r = await login(fd)
    expect(r).toEqual({ erro: 'Credenciais inválidas' })
  })
})
