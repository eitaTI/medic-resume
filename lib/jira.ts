import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
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
  cnpjEmpresa: string | null
  cepClinica: string | null
  enderecoClinica: string | null
  quantidadeMedicos: number
  vendedor?: string | null
  tipoProcesso?: string | null
  logoPath?: string | null
  cabecalhoLaudo?: string | null
  rodapeLaudo?: string | null
  medicos: { nome: string; documento: string; email: string; tipo: string; assinaturaPath?: string | null }[]
  exames: { nome: string; laudoPath?: string | null; topicos?: string | null }[]
  dispositivos: { tipo: string; marca: string; modelo: string; numeroSerie: string | null }[]
}

type ADFText = { type: 'text'; text: string; marks?: { type: 'strong' }[] }
type ADFParagraph = { type: 'paragraph'; content: ADFText[] }

/** Rótulo curto para o título do card: primeira palavra do tipo ("Implantação", "Atualização"). */
function rotuloTipoProcesso(tipoProcesso: string | null | undefined): string {
  const primeira = (tipoProcesso ?? '').trim().split(/\s+/)[0]
  return primeira ? `[${primeira}] ` : ''
}

/** Slug seguro para label do Jira (sem espaços/acentos): "Amanda Araújo" -> "vendedor-amanda-araujo". */
function slugifyLabel(valor: string | null | undefined, prefixo: string): string | null {
  const slug = (valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `${prefixo}-${slug}` : null
}

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
  bloco.push(paragrafo(`Documento do titular (CPF): ${clinica.documentoTitular ?? '—'}`))
  bloco.push(paragrafo(`Tipo de cadastro: ${clinica.cnpjEmpresa ? 'Pessoa Jurídica (CNPJ)' : 'Pessoa Física'}`))
  if (clinica.cnpjEmpresa) bloco.push(paragrafo(`CNPJ da empresa: ${clinica.cnpjEmpresa}`))
  if (clinica.cepClinica) bloco.push(paragrafo(`CEP: ${clinica.cepClinica}`))
  if (clinica.enderecoClinica) bloco.push(paragrafo(`Endereço: ${clinica.enderecoClinica}`))
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
      const anexo = exame.laudoPath ? ` (laudo anexo: ${path.basename(exame.laudoPath)})` : ''
      const topicos = exame.topicos ? ` | Tópicos: ${exame.topicos}` : ''
      bloco.push(paragrafo(`- ${exame.nome}${anexo}${topicos}`))
    }
  }

  if (clinica.dispositivos.length > 0) {
    bloco.push(paragrafo('Equipamentos:', true))
    for (const d of clinica.dispositivos) {
      const serie = d.numeroSerie?.trim() ? d.numeroSerie : 'S/N (não informada)'
      bloco.push(paragrafo(`- ${d.tipo} | ${d.marca} | ${d.modelo} | Série: ${serie}`))
    }
  }

  // Controle interno: relevante para os técnicos, mas NÃO vai para o Zscan.
  if (clinica.vendedor || clinica.tipoProcesso) {
    bloco.push(paragrafo('Controle interno (não vai para o Zscan):', true))
    if (clinica.vendedor) bloco.push(paragrafo(`Vendedor: ${clinica.vendedor}`))
    if (clinica.tipoProcesso) bloco.push(paragrafo(`Tipo de processo: ${clinica.tipoProcesso}`))
  }

  return bloco
}

async function anexarArquivo(client: Version3Client, issueKey: string, caminhoRelativo: string | null | undefined) {
  if (!caminhoRelativo) return
  const abs = path.join(/* turbopackIgnore: true */ process.cwd(), caminhoRelativo)
  if (!existsSync(abs)) return
  const buffer = await readFile(abs)
  await client.issueAttachments.addAttachment({
    issueIdOrKey: issueKey,
    attachment: { file: buffer, filename: path.basename(abs) },
  })
}

/**
 * Espelha os dados estruturados da clínica num JSON anexado ao card.
 *
 * PORQUÊ: a descrição do Jira é texto livre para o técnico ler, mas o agente
 * (MCP `jira_manage get_issue`) precisa dos dados de forma determinística —
 * sem parsear PT-BR. O JSON viaja junto dos PDFs/logos e é baixado no mesmo lote.
 */
function pastaDaSubmissao(clinica: ClinicaParaJira): string | null {
  const rel = clinica.logoPath
    ?? clinica.exames.find((e) => e.laudoPath)?.laudoPath
    ?? clinica.medicos.find((m) => m.assinaturaPath)?.assinaturaPath
  // data/uploads/<submission>/<tipo>/<arquivo> -> usa o diretório do arquivo
  if (!rel) return null
  const dir = path.dirname(rel)
  return dir && dir !== '.' ? dir : null
}

async function anexarDadosEstruturados(
  client: Version3Client,
  issueKey: string,
  clinica: ClinicaParaJira,
): Promise<void> {
  const pasta = pastaDaSubmissao(clinica) ?? `data/uploads/dados-cliente-${clinica.id}-${Date.now()}`
  const dir = path.join(process.cwd(), pasta)
  await mkdir(dir, { recursive: true })
  const nome = 'dados-cliente.json'
  const abs = path.join(dir, nome)
  const payload = JSON.stringify({ ...clinica, geradoEm: new Date().toISOString() }, null, 2)
  await writeFile(abs, payload, 'utf-8')
  try {
    await client.issueAttachments.addAttachment({
      issueIdOrKey: issueKey,
      attachment: { file: Buffer.from(payload, 'utf-8'), filename: nome },
    })
  } finally {
    // O JSON vive no Jira a partir daqui; não duplica no disco do servidor.
    await rm(abs, { force: true }).catch(() => {})
  }
}

export async function criarCardJira(clinica: ClinicaParaJira): Promise<string> {
  // Validate required Jira configuration
  if (!process.env.JIRA_BASE_URL || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    throw new Error('Jira configuration incomplete. Please set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN')
  }

  // Remove trailing slash if present to avoid URL issues
  const jiraBaseUrl = process.env.JIRA_BASE_URL.replace(/\/+$/, '')

  console.log(`[Jira] Iniciando criação de card para: ${clinica.nomeClinica}`)
  console.log(`[Jira] Base URL: ${jiraBaseUrl}`)
  console.log(`[Jira] Project: ${process.env.JIRA_PROJECT_KEY || 'EITATI'}`)
  console.log(`[Jira] Issue Type: ${process.env.JIRA_ISSUE_TYPE || 'Task'}`)
  console.log(`[Jira] Labels: ${process.env.JIRA_LABELS || 'medic-resume'}`)
  console.log(`[Jira] Email: ${process.env.JIRA_EMAIL}`)

  const client = new Version3Client({
    host: jiraBaseUrl,
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL,
        apiToken: process.env.JIRA_API_TOKEN,
      },
    },
  })

  const labels = (process.env.JIRA_LABELS || 'medic-resume')
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)

  // Etiquetas de controle: filtram o backlog por vendedor/tipo no Jira.
  for (const extra of [slugifyLabel(clinica.vendedor, 'vendedor'), slugifyLabel(clinica.tipoProcesso, 'tipo')]) {
    if (extra && !labels.includes(extra)) labels.push(extra)
  }

  try {
    const issue = await client.issues.createIssue({
      fields: {
        summary: `${rotuloTipoProcesso(clinica.tipoProcesso)}Clínica aprovada: ${clinica.nomeClinica}`,
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

    console.log(`[Jira] Card criado com sucesso: ${issue.key}`)

    try {
      await anexarArquivo(client, issue.key, clinica.logoPath)
      for (const m of clinica.medicos) {
        await anexarArquivo(client, issue.key, m.assinaturaPath)
      }
      for (const e of clinica.exames) {
        await anexarArquivo(client, issue.key, e.laudoPath)
      }
      await anexarDadosEstruturados(client, issue.key, clinica)
    } catch (err) {
      console.error('[Jira] Falha ao anexar arquivos ao card:', err instanceof Error ? err.message : err)
      if (err instanceof Error) console.error('[Jira] Stack:', err.stack)
    }

    return issue.key
  } catch (err) {
    // Log detailed error information for debugging
    console.error('[Jira] ERRO ao criar card:')
    console.error(`[Jira] Mensagem: ${err instanceof Error ? err.message : String(err)}`)
    
    if (err instanceof Error && err.stack) {
      console.error(`[Jira] Stack: ${err.stack}`)
    }

    // Try to extract response details from axios/jira.js errors
    const axiosErr = err as Record<string, unknown>
    if (axiosErr.response) {
      const response = axiosErr.response as Record<string, unknown>
      console.error(`[Jira] Status HTTP: ${response.status}`)
      console.error(`[Jira] Status Text: ${response.statusText}`)
      if (response.data) {
        console.error(`[Jira] Resposta do servidor: ${JSON.stringify(response.data, null, 2)}`)
      }
      if (response.headers) {
        console.error(`[Jira] Headers: ${JSON.stringify(response.headers)}`)
      }
    }

    // Re-throw the error to propagate to the caller
    throw err
  }
}
