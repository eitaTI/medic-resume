import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Version3Client } from 'jira.js'

export interface ClinicaParaJira {
  id: number
  nomeEmpresa: string | null
  nomeClinica: string
  nomeTitular: string
  emailTitular: string
  celularTitular: string | null
  documentoTitular: string | null
  quantidadeMedicos: number
  logoPath?: string | null
  cabecalhoLaudo?: string | null
  rodapeLaudo?: string | null
  medicos: { nome: string; documento: string; email: string; tipo: string; assinaturaPath?: string | null }[]
  exames: { nome: string; laudoPath?: string | null }[]
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
  bloco.push(paragrafo(`Celular do titular: ${clinica.celularTitular ?? '—'}`))
  bloco.push(paragrafo(`Documento do titular: ${clinica.documentoTitular ?? '—'}`))
  bloco.push(paragrafo(`Quantidade de médicos: ${clinica.quantidadeMedicos}`))
  if (clinica.logoPath) bloco.push(paragrafo(`Logo: ${clinica.logoPath} (anexo)`))
  if (clinica.cabecalhoLaudo) bloco.push(paragrafo(`Cabeçalho do laudo: ${clinica.cabecalhoLaudo}`))
  if (clinica.rodapeLaudo) bloco.push(paragrafo(`Rodapé do laudo: ${clinica.rodapeLaudo}`))

  if (clinica.medicos.length > 0) {
    bloco.push(paragrafo('Médicos:', true))
    for (const m of clinica.medicos) {
      bloco.push(paragrafo(`- ${m.nome} | ${m.tipo} | ${m.documento} | ${m.email}${m.assinaturaPath ? ' (assinatura anexa)' : ''}`))
    }
  }

  if (clinica.exames.length > 0) {
    bloco.push(paragrafo('Exames:', true))
    for (const exame of clinica.exames) {
      bloco.push(paragrafo(`- ${exame.nome}${exame.laudoPath ? ' (laudo anexo)' : ''}`))
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

async function anexarArquivo(client: Version3Client, issueKey: string, caminhoRelativo: string | null | undefined) {
  if (!caminhoRelativo) return
  const abs = path.join(process.cwd(), caminhoRelativo)
  if (!existsSync(abs)) return
  const buffer = await readFile(abs)
  await client.issueAttachments.addAttachment({
    issueIdOrKey: issueKey,
    attachment: { file: buffer, filename: path.basename(abs) },
  })
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

  const labels = (process.env.JIRA_LABELS || 'medic-resume')
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)

  const issue = await client.issues.createIssue({
    fields: {
      summary: `Clínica aprovada: ${clinica.nomeClinica}`,
      project: { key: process.env.JIRA_PROJECT_KEY || 'EITATI' },
      issuetype: { name: process.env.JIRA_ISSUE_TYPE || 'Task' },
      labels,
      description: {
        type: 'doc',
        version: 1,
        content: montarDescricao(clinica),
      },
    },
  })

  try {
    await anexarArquivo(client, issue.key, clinica.logoPath)
    for (const m of clinica.medicos) {
      await anexarArquivo(client, issue.key, m.assinaturaPath)
    }
    for (const e of clinica.exames) {
      await anexarArquivo(client, issue.key, e.laudoPath)
    }
  } catch (err) {
    console.error('Falha ao anexar arquivos ao card Jira:', err instanceof Error ? err.message : err)
    if (err instanceof Error) console.error(err.stack)
  }

  return issue.key
}
