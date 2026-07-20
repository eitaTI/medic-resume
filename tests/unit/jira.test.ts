import { describe, it, expect, vi, beforeEach } from 'vitest'
import path from 'node:path'

const createIssue = vi.fn()
const addAttachment = vi.fn()

vi.mock('jira.js', () => ({
  Version3Client: class {
    issues = { createIssue }
    issueAttachments = { addAttachment }
  },
}))

import { criarCardJira, type ClinicaParaJira } from '@/lib/jira'
import { TEST_DB_PATH } from '@/tests/helpers/db'

function clinicaBase(overrides: Partial<ClinicaParaJira> = {}): ClinicaParaJira {
  return {
    id: 1,
    nomeEmpresa: 'Empresa SA',
    nomeClinica: 'Clínica Teste',
    nomeTitular: 'Titular Completo',
    emailTitular: 't@c.com',
    celularTitular: '11999998888',
    documentoTitular: '12345678901',
    cnpjEmpresa: '12345678000195',
    cepClinica: '12345678',
    enderecoClinica: 'Rua A',
    quantidadeMedicos: 1,
    medicos: [{ nome: 'Dr', documento: '1', email: 'a@b.com', tipo: 'examinador' }],
    exames: [{ nome: 'Raio-X' }],
    dispositivos: [{ tipo: 'U', marca: 'M', modelo: 'X', numeroSerie: 'SN' }],
    ...overrides,
  }
}

describe('criarCardJira', () => {
  beforeEach(() => {
    createIssue.mockReset()
    addAttachment.mockReset()
  })

  it('cria o card e retorna a chave no sucesso', async () => {
    createIssue.mockResolvedValue({ key: 'EITATI-1' })
    const key = await criarCardJira(clinicaBase())
    expect(key).toBe('EITATI-1')
    expect(createIssue).toHaveBeenCalledTimes(1)
    const payload = createIssue.mock.calls[0][0]
    expect(payload.fields.summary).toContain('Clínica Teste')
    expect(payload.fields.project.key).toBe(process.env.JIRA_PROJECT_KEY || 'EITATI')
    expect(Array.isArray(payload.fields.description.content)).toBe(true)
  })

  it('propaga erro quando a API do Jira falha', async () => {
    createIssue.mockRejectedValue(new Error('boom'))
    await expect(criarCardJira(clinicaBase())).rejects.toThrow('boom')
  })

  it('anexa arquivos existentes e ignora inexistentes sem quebrar', async () => {
    createIssue.mockResolvedValue({ key: 'EITATI-2' })
    addAttachment.mockResolvedValue({})
    const logo = path.join('tests', 'fixtures', 'logo.png')
    await criarCardJira(clinicaBase({ logoPath: logo, medicos: [{ nome: 'Dr', documento: '1', email: 'a@b.com', tipo: 'examinador', assinaturaPath: logo }] }))
    // anexa logo + assinatura (mesmo arquivo) -> 2 chamadas
    expect(addAttachment).toHaveBeenCalledTimes(2)
  })
})
