import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: vi.fn() } },
}))

import { auth } from '@/lib/auth'
import { GET, POST, DELETE } from '@/app/api/branding/[...path]/route'
import { resetTestDb } from '@/tests/helpers/db'

const ADMIN = { user: { id: 'admin-test-id' } }
const BRAND_DIR = path.join(process.cwd(), 'data', 'branding')
const BOUNDARY = '----testboundary'

function buildMultipart(slot: string, fileName: string, fileType: string, fileBuf: Buffer) {
  const b = `--${BOUNDARY}`
  const part1 = `${b}\r\nContent-Disposition: form-data; name="slot"\r\n\r\n${slot}\r\n`
  const part2 = `${b}\r\nContent-Disposition: form-data; name="arquivo"; filename="${fileName}"\r\nContent-Type: ${fileType}\r\n\r\n`
  const end = `\r\n${b}--\r\n`
  return Buffer.concat([Buffer.from(part1), Buffer.from(part2), fileBuf, Buffer.from(end)])
}

async function limpar() {
  try {
    const files = await fs.readdir(BRAND_DIR)
    await Promise.all(files.map((f) => fs.unlink(path.join(BRAND_DIR, f))))
  } catch {
    /* dir inexistente */
  }
}

describe('GET /api/branding', () => {
  it('serve arquivo de override (data/branding)', async () => {
    await fs.mkdir(BRAND_DIR, { recursive: true })
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-logo-light.png'), Buffer.from([1, 2, 3]))
    const r = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ path: ['eitati-logo-light.png'] }),
    })
    expect(r.status).toBe(200)
    expect(r.headers.get('Content-Type')).toBe('image/png')
    await limpar()
  })

  it('rejeita extensão não suportada (400)', async () => {
    const r = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ path: ['eitati-logo-light.txt'] }),
    })
    expect(r.status).toBe(400)
  })

  it('segmentos ".." intermediários são ignorados e resultam em 404 (sem escape de pasta)', async () => {
    const r = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ path: ['..', '..', 'secret.png'] }),
    })
    expect(r.status).toBe(404)
  })

  it('rejeita ".." no nome do arquivo (400)', async () => {
    const r = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ path: ['eitati-logo-light..png'] }),
    })
    expect(r.status).toBe(400)
  })
})

describe('POST /api/branding/upload', () => {
  beforeAll(async () => {
    await resetTestDb()
    await fs.mkdir(BRAND_DIR, { recursive: true })
  })
  afterAll(limpar)
  beforeEach(async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
    await limpar()
  })

  function req(body: Buffer) {
    return new Request('http://localhost/api/branding/upload', {
      method: 'POST',
      headers: { 'content-type': `multipart/form-data; boundary=${BOUNDARY}` },
      body: body as any,
    })
  }

  it('exige autenticação (401)', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
    const r = await POST(req(buildMultipart('logo-light', 'logo.png', 'image/png', Buffer.from([9]))))
    expect(r.status).toBe(401)
  })

  it('faz upload válido de slot', async () => {
    const r = await POST(req(buildMultipart('logo-light', 'logo.png', 'image/png', Buffer.from([9, 8, 7]))))
    expect(r.status).toBe(200)
    await expect(fs.readFile(path.join(BRAND_DIR, 'eitati-logo-light.png'))).resolves.toEqual(
      Buffer.from([9, 8, 7]),
    )
  })

  it('rejeita slot inválido (400)', async () => {
    const r = await POST(req(buildMultipart('xxx', 'logo.png', 'image/png', Buffer.from([1]))))
    expect(r.status).toBe(400)
  })

  it('rejeita tipo não suportado (400)', async () => {
    const r = await POST(req(buildMultipart('logo-light', 'logo.gif', 'image/gif', Buffer.from([1]))))
    expect(r.status).toBe(400)
  })

  it('rejeita arquivo acima de 5MB (413)', async () => {
    const big = Buffer.alloc(6 * 1024 * 1024, 1)
    const r = await POST(req(buildMultipart('logo-light', 'logo.png', 'image/png', big)))
    expect(r.status).toBe(413)
  })
})

describe('DELETE /api/branding', () => {
  beforeEach(async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(ADMIN as any)
    await limpar()
  })
  afterAll(limpar)

  it('remove um slot', async () => {
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-logo-light.png'), Buffer.from([1]))
    const r = await DELETE(
      new Request('http://localhost', { method: 'DELETE', body: JSON.stringify({ slot: 'logo-light' }) }),
    )
    expect(r.status).toBe(200)
    await expect(fs.readdir(BRAND_DIR)).resolves.toEqual([])
  })

  it('reseta todos os slots', async () => {
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-logo-dark.png'), Buffer.from([1]))
    await fs.writeFile(path.join(BRAND_DIR, 'eitati-icon-light.png'), Buffer.from([1]))
    const r = await DELETE(new Request('http://localhost', { method: 'DELETE', body: JSON.stringify({}) }))
    expect(r.status).toBe(200)
    await expect(fs.readdir(BRAND_DIR)).resolves.toEqual([])
  })

  it('exige autenticação (401)', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as any)
    const r = await DELETE(
      new Request('http://localhost', { method: 'DELETE', body: JSON.stringify({ slot: 'logo-light' }) }),
    )
    expect(r.status).toBe(401)
  })
})
