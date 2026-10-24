import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    vendedor: 'Alyson Alves',
    tipoProcesso: 'Implantação nova Zscan',
    medicos: [{ nome: 'Dr', documento: '1', email: 'a@b.com', tipo: 'examinador' }],
    exames: [{ nome: 'Raio-X' }],
    dispositivos: [{ tipo: 'U', marca: 'M', modelo: 'X', numeroSerie: 'SN' }],
    ...overrides,
  }
}

describe('criarCardJira', () => {
  beforeEach(() => {
    // A lib exige JIRA_BASE_URL/EMAIL/API_TOKEN mesmo com o client mockado —
    // stuba valores dummy para o teste não depender do ambiente do shell.
    vi.stubEnv('JIRA_BASE_URL', 'https://dummy.atlassian.net')
    vi.stubEnv('JIRA_EMAIL', 'teste@teste.com')
    vi.stubEnv('JIRA_API_TOKEN', 'dummy-token')
    createIssue.mockReset()
    addAttachment.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
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

  it('inclui os títulos das seções dos exames na descrição', async () => {
    createIssue.mockResolvedValue({ key: 'EITATI-3' })
    await criarCardJira(
      clinicaBase({ exames: [{ nome: 'Raio-X de Tórax', topicos: 'Tórax - Pulmão - Conclusão' }] }),
    )
    const payload = createIssue.mock.calls[0][0]
    const textos = (payload.fields.description.content as { content: { text: string }[] }[])
      .map((p) => p.content.map((t) => t.text).join(''))
      .join('\n')
    expect(textos).toContain('- Raio-X de Tórax | Títulos do laudo: Tórax - Pulmão - Conclusão')
  })

  it('inclui vendedor, tipo de processo e labels de controle', async () => {
    createIssue.mockResolvedValue({ key: 'EITATI-5' })
    await criarCardJira(clinicaBase({}))
    const payload = createIssue.mock.calls[0][0]
    const textos = (payload.fields.description.content as { content: { text: string }[] }[])
      .map((p) => p.content.map((t) => t.text).join(''))
      .join('\n')
    expect(textos).toContain('Vendedor: Alyson Alves')
    expect(textos).toContain('Tipo de processo: Implantação nova Zscan')
    expect(textos).toContain('Controle interno (não vai para o Zscan)')
    expect(payload.fields.summary).toBe('[Implantação] Clínica aprovada: Clínica Teste')
    expect(payload.fields.labels).toContain('vendedor-alyson-alves')
    expect(payload.fields.labels).toContain('tipo-implantacao-nova-zscan')
  })

  it('mostra S/N quando o equipamento não tem série', async () => {
    createIssue.mockResolvedValue({ key: 'EITATI-6' })
    await criarCardJira(clinicaBase({ dispositivos: [{ tipo: 'U', marca: 'M', modelo: 'X', numeroSerie: null }] }))
    const payload = createIssue.mock.calls[0][0]
    const textos = (payload.fields.description.content as { content: { text: string }[] }[])
      .map((p) => p.content.map((t) => t.text).join(''))
      .join('\n')
    expect(textos).toContain('Série: S/N (não informada)')
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
    // anexa logo + assinatura (mesmo arquivo) + dados-cliente.json -> 3 chamadas
    expect(addAttachment).toHaveBeenCalledTimes(3)
    const nomes = addAttachment.mock.calls.map((c) => (c[0] as { attachment: { filename: string } }).attachment.filename)
    expect(nomes).toContain('logo.png')
    expect(nomes).toContain('dados-cliente.json')
  })

  it('inclui o nome do arquivo no marcador de laudo anexo', async () => {
    createIssue.mockResolvedValue({ key: 'EITATI-4' })
    await criarCardJira(
      clinicaBase({ exames: [{ nome: 'Colonoscopia', laudoPath: 'data/uploads/x/laudos/abc.pdf', topicos: 'A - B' }] }),
    )
    const payload = createIssue.mock.calls[0][0]
    const textos = (payload.fields.description.content as { content: { text: string }[] }[])
      .map((p) => p.content.map((t) => t.text).join(''))
      .join('\n')
    expect(textos).toContain('- Colonoscopia (laudo anexo: abc.pdf) | Títulos do laudo: A - B')
  })
})
