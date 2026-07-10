'use server'

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { schemaClinica, schemaMedico, schemaExame, schemaDispositivo } from '@/lib/validacoes'

function extrairArray(formData: FormData, prefix: string): Record<number, Record<string, FormDataEntryValue>> {
  const resultado: Record<number, Record<string, FormDataEntryValue>> = {}
  const regex = new RegExp(`^${prefix}\\[(\\d+)\\]\\.(.+)$`)

  for (const [key, value] of formData.entries()) {
    const match = key.match(regex)
    if (match) {
      const index = parseInt(match[1])
      const campo = match[2]
      if (!resultado[index]) resultado[index] = {}
      resultado[index][campo] = value
    }
  }

  return resultado
}

async function salvarArquivo(file: File | null, subdir: string): Promise<string | null> {
  if (!file || file.size === 0) return null

  const dir = path.join(process.cwd(), 'data', 'uploads', subdir)
  await mkdir(dir, { recursive: true })

  const ext = path.extname(file.name)
  const nomeUnico = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const caminho = path.join(dir, nomeUnico)

  const bytes = await file.arrayBuffer()
  await writeFile(caminho, Buffer.from(bytes))

  return `data/uploads/${subdir}/${nomeUnico}`
}

export async function submeterFormulario(formData: FormData) {
  try {
    const cabecalhoLaudo = (formData.get('cabecalhoLaudo') as string) || ''
    const rodapeLaudo = (formData.get('rodapeLaudo') as string) || ''

    const dadosClinica = {
      nomeClinica: (formData.get('nomeClinica') as string) || '',
      nomeTitular: (formData.get('nomeTitular') as string) || '',
      emailTitular: (formData.get('emailTitular') as string) || '',
      celularTitular: (formData.get('celularTitular') as string) || undefined,
      documentoTitular: (formData.get('documentoTitular') as string) || undefined,
    }

    const validacao = schemaClinica.safeParse(dadosClinica)
    if (!validacao.success) return { erro: validacao.error.issues[0].message }

    const medicosRaw = extrairArray(formData, 'medicos')
    const medicoIndices = Object.keys(medicosRaw).map(Number).sort()

    for (const i of medicoIndices) {
      const v = schemaMedico.safeParse(medicosRaw[i])
      if (!v.success) return { erro: v.error.issues[0].message }
    }

    const examesRaw = extrairArray(formData, 'exames')
    const exameIndices = Object.keys(examesRaw).map(Number).sort()

    for (const i of exameIndices) {
      const v = schemaExame.safeParse(examesRaw[i])
      if (!v.success) return { erro: v.error.issues[0].message }
    }

    const dispositivosRaw = extrairArray(formData, 'dispositivos')
    const dispositivoIndices = Object.keys(dispositivosRaw).map(Number).sort()

    for (const i of dispositivoIndices) {
      const v = schemaDispositivo.safeParse(dispositivosRaw[i])
      if (!v.success) return { erro: v.error.issues[0].message }
    }

    const logoFile = formData.get('logo') as File | null
    const logoPath = await salvarArquivo(logoFile, 'logos')

    const clinica = await prisma.clinica.create({
      data: {
        nomeEmpresa: (formData.get('nomeEmpresa') as string) || null,
        nomeClinica: validacao.data.nomeClinica,
        nomeTitular: validacao.data.nomeTitular,
        emailTitular: validacao.data.emailTitular,
        quantidadeMedicos: parseInt(formData.get('quantidadeMedicos') as string) || 1,
        celularTitular: validacao.data.celularTitular || null,
        documentoTitular: validacao.data.documentoTitular || null,
        logoPath,
        cabecalhoLaudo,
        rodapeLaudo,
        medicos: {
          create: await Promise.all(
            medicoIndices.map(async (i) => {
              const m = medicosRaw[i]
              const assinatura = formData.get(`medicos[${i}].assinatura`) as File | null
              const assinaturaPath = await salvarArquivo(assinatura, 'assinaturas')
              return {
                nome: m.nome as string,
                documento: m.documento as string,
                email: m.email as string,
                tipo: (m.tipo as string) || 'examinador',
                assinaturaPath,
              }
            })
          ),
        },
        exames: {
          create: await Promise.all(
            exameIndices.map(async (i) => {
              const e = examesRaw[i]
              const laudo = formData.get(`exames[${i}].laudo`) as File | null
              const laudoPath = await salvarArquivo(laudo, 'laudos')
              return {
                nome: e.nome as string,
                laudoPath,
              }
            })
          ),
        },
        dispositivos: {
          create: dispositivoIndices.map((i) => {
            const d = dispositivosRaw[i]
            return {
              tipo: d.tipo as string,
              marca: d.marca as string,
              modelo: d.modelo as string,
              numeroSerie: d.numeroSerie as string,
            }
          }),
        },
      },
    })

    console.log(`Submissão criada: Clinica #${clinica.id}`)
    revalidatePath('/admin')

    return { sucesso: true }
  } catch (erro) {
    console.log('Erro ao submeter formulário:', erro)
    return { erro: 'Erro interno do servidor' }
  }
}
