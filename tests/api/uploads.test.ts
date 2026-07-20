import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}))
vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers()),
}))

import { auth } from '@/lib/auth'
import { GET } from '@/app/api/uploads/[...path]/route'
import { resetTestDb } from '@/tests/helpers/db'

const ADMIN = { user: { id: 'admin-test-id' } }
const BASE = path.join(process.cwd(), 'data', 'uploads', '_test_uploads')

beforeAll(async () => {
  await resetTestDb()
  await fs.mkdir(BASE, { recursive: true })
  await fs.writeFile(path.join(BASE, 'logo.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]))
})

afterAll(async () => {
  await fs.rm(path.join(process.cwd(), 'data', 'uploads', '_test_uploads'), { recursive: true, force: true })
})

async function chamar(segments: string[]) {
  return GET(new Request('http://localhost'), { params: Promise.resolve({ path: segments }) })
}

describe('GET /api/uploads', () => {
  beforeEach(() => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
  })

  it('exige autenticação (401)', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
    const r = await chamar(['_test_uploads', 'logo.png'])
    expect(r.status).toBe(401)
  })

  it('serve arquivo existente com MIME correto', async () => {
    const r = await chamar(['_test_uploads', 'logo.png'])
    expect(r.status).toBe(200)
    expect(r.headers.get('Content-Type')).toBe('image/png')
  })

  it('bloqueia path traversal (403)', async () => {
    const r = await chamar(['..', '..', 'package.json'])
    expect(r.status).toBe(403)
  })

  it('retorna 404 para arquivo inexistente', async () => {
    const r = await chamar(['_test_uploads', 'nao-existe.png'])
    expect(r.status).toBe(404)
  })

  it('retorna 400 sem path', async () => {
    const r = await chamar([])
    expect(r.status).toBe(400)
  })
})
