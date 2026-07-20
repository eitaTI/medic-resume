import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}))
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))

import { getBranding } from '@/lib/branding'
import { auth } from '@/lib/auth'
import { restaurarBrandingSlot, restaurarBrandingPadrao } from '@/actions/branding'
import { resetTestDb } from '@/tests/helpers/db'

const ADMIN = { user: { id: 'admin-test-id' } }
const BRAND_DIR = path.join(process.cwd(), 'data', 'branding')

async function limparBrand() {
  try {
    const files = await fs.readdir(BRAND_DIR)
    await Promise.all(files.map((f) => fs.unlink(path.join(BRAND_DIR, f))))
  } catch {
    /* dir inexistente */
  }
}

describe('getBranding (lib)', () => {
  afterAll(limparBrand)

  it('retorna 6 chaves de branding', () => {
    const b = getBranding()
    expect(Object.keys(b)).toEqual([
      'logoLight',
      'logoDark',
      'wallpaperLight',
      'wallpaperDark',
      'iconLight',
      'iconDark',
    ])
  })

  it('resolve override de data/branding com versão (mtime)', async () => {
    await fs.mkdir(BRAND_DIR, { recursive: true })
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-logo-light.png'), Buffer.from('x'))
    expect(getBranding().logoLight).toMatch(/^\/api\/branding\/v\d+\/eitati-logo-light\.png$/)
    await limparBrand()
  })

  it('cai no padrão quando não há override', () => {
    const b = getBranding()
    expect(b.logoLight).toMatch(/^\/api\/branding\//)
  })
})

describe('actions/branding', () => {
  beforeAll(async () => {
    await resetTestDb()
    await fs.mkdir(BRAND_DIR, { recursive: true })
  })
  afterAll(limparBrand)

  beforeEach(async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
    await limparBrand()
  })

  it('restaurarBrandingSlot exige autenticação', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
    const r = await restaurarBrandingSlot('logo-light')
    expect(r).toEqual({ erro: 'Não autenticado' })
  })

  it('restaurarBrandingSlot rejeita slot inválido', async () => {
    const r = await restaurarBrandingSlot('inexistente')
    expect(r).toEqual({ erro: 'Slot de branding inválido' })
  })

  it('restaurarBrandingSlot remove o arquivo do slot', async () => {
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-logo-light.png'), Buffer.from('x'))
    const r = await restaurarBrandingSlot('logo-light')
    expect(r).toEqual({ sucesso: true })
    await expect(fs.readdir(BRAND_DIR)).resolves.toEqual([])
  })

  it('restaurarBrandingPadrao limpa todos os arquivos', async () => {
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-logo-dark.png'), Buffer.from('x'))
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-icon-light.png'), Buffer.from('x'))
    const r = await restaurarBrandingPadrao()
    expect(r).toEqual({ sucesso: true })
    await expect(fs.readdir(BRAND_DIR)).resolves.toEqual([])
  })
})
