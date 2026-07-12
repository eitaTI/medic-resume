import { Version3Client } from 'jira.js'

export interface ClinicaParaJira {
  id: number
  nomeEmpresa: string | null
  nomeClinica: string
  nomeTitular: string
  emailTitular: string
  quantidadeMedicos: number
  exames: { nome: string }[]
  dispositivos: { tipo: string; marca: string; modelo: string; numeroSerie: string }[]
}

type ADFText = { type: 'text'; text: string; marks?: { type: 'strong' }[] }
type ADFParagraph = { type: 'paragraph'; content: ADFText[] }

function paragrafo(texto: string, negrito = false): ADFParagraph {
  const node: ADFText = { type: 'text', text: texto }
  if (negrito) node.marks = [{ type: 'strong' }]
  return { type: 'paragraph', content: [node] }
}

function montarDescricao(clinica: ClinicaParaJira): ADFParagraph[] {
  const bloco: ADFParagraph[] = []
  bloco.push(paragrafo(`Clínica: ${clinica.nomeClinica}`, true))
  if (clinica.nomeEmpresa) bloco.push(paragrafo(`Empresa: ${clinica.nomeEmpresa}`))
  bloco.push(paragrafo(`Titular: ${clinica.nomeTitular}`))
  bloco.push(paragrafo(`E-mail do titular: ${clinica.emailTitular}`))
  bloco.push(paragrafo(`Quantidade de médicos: ${clinica.quantidadeMedicos}`))

  if (clinica.exames.length > 0) {
    bloco.push(paragrafo('Exames:', true))
    for (const exame of clinica.exames) {
      bloco.push(paragrafo(`- ${exame.nome}`))
    }
  }

  if (clinica.dispositivos.length > 0) {
    bloco.push(paragrafo('Equipamentos:', true))
    for (const d of clinica.dispositivos) {
      bloco.push(paragrafo(`- ${d.tipo} | ${d.marca} | ${d.modelo} | Série: ${d.numeroSerie}`))
    }
  }

  return bloco
}

export async function criarCardJira(clinica: ClinicaParaJira): Promise<string> {
  const client = new Version3Client({
    host: process.env.JIRA_BASE_URL || '',
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL || '',
        apiToken: process.env.JIRA_API_TOKEN || '',
      },
    },
  })

  const issue = await client.issues.createIssue({
    fields: {
      summary: `Clínica aprovada: ${clinica.nomeClinica}`,
      project: { key: process.env.JIRA_PROJECT_KEY || 'ZSCAN' },
      issuetype: { name: 'Task' },
      description: {
        type: 'doc',
        version: 1,
        content: montarDescricao(clinica),
      },
    },
  })

  return issue.key
}
