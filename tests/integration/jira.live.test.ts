import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'dotenv'
import { Version3Client } from 'jira.js'
import { criarCardJira, type ClinicaParaJira } from '@/lib/jira'

// O Vitest carrega `.env.test` (modo "test"), que contém credenciais dummy.
// Para o teste LIVE usamos o `.env` real, com override, antes de ler as vars.
config({ path: '.env', override: true })

const PLACEHOLDERS = ['sua-empresa', 'seu_token', 'seu-email', 'example.atlassian.net', 'teste@example.com', 'dummy_token']

function usingRealJiraCreds(): boolean {
  const vals = [
    process.env.JIRA_BASE_URL,
    process.env.JIRA_EMAIL,
    process.env.JIRA_API_TOKEN,
  ]
  return vals.every((v) => !!v && !PLACEHOLDERS.some((p) => v.includes(p)))
}

const deveRodar = usingRealJiraCreds() && process.env.RUN_JIRA_LIVE === '1'

describe.skipIf(!deveRodar)('Jira live (criação real de card)', () => {
  const client = new Version3Client({
    host: process.env.JIRA_BASE_URL!,
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL!,
        apiToken: process.env.JIRA_API_TOKEN!,
      },
    },
  })

  beforeAll(() => {
    if (!deveRodar) {
      console.warn(
        'Teste live do Jira ignorado: exige credenciais reais no .env E RUN_JIRA_LIVE=1.',
      )
    }
  })

  it('self-check: token válido retorna o usuário atual', async () => {
    const user = await client.myself.getCurrentUser()
    expect(user).toBeTruthy()
    expect(typeof user.accountId === 'string' || typeof user.accountId === 'number').toBe(true)
  })

  it('cria e remove um card de teste', async () => {
    const clinica: ClinicaParaJira = {
      id: 0,
      nomeEmpresa: 'Empresa Teste LTDA',
      nomeClinica: 'TESTE medic-resume (automatico)',
      nomeTitular: 'Titular Teste',
      emailTitular: 'teste@example.com',
      celularTitular: '11999990000',
      documentoTitular: '12345678901',
      cnpjEmpresa: '12345678000195',
      cepClinica: '01001000',
      enderecoClinica: 'Praça da Sé, 1',
      quantidadeMedicos: 1,
      medicos: [{ nome: 'Dr. Teste', documento: '12345678901', email: 'medico@example.com', tipo: 'examinador' }],
      exames: [{ nome: 'Raio-X' }],
      dispositivos: [{ tipo: 'Ultrassom', marca: 'Marca', modelo: 'X1', numeroSerie: 'SN-TESTE-1' }],
    }

    const key = await criarCardJira(clinica)
    expect(typeof key).toBe('string')
    expect(key).toMatch(/^[A-Z]+-\d+$/i)

    // Limpeza: remove o card para não poluir o board.
    try {
      await client.issues.deleteIssue({ issueIdOrKey: key })
    } catch (err) {
      console.warn(
        `Não foi possível remover o card de teste ${key} automaticamente:`,
        err instanceof Error ? err.message : err,
      )
    }
  })
})
