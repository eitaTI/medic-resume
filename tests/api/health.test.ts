import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('GET /api/health', () => {
  it('retorna status ok', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('services')
    expect(body.services).toHaveProperty('database', 'connected')
  })
})
