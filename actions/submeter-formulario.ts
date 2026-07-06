'use server'

import { prisma } from '@/lib/prisma'
import { clinicaSchema, medicoSchema, exameSchema, dispositivoSchema } from '@/lib/validacoes'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

// Extrai arrays do FormData pelo prefixo (ex: medicos[0].nome)
function extrairArray(formData: FormData, prefix: string): Record<string, string>[] {
  const indices = new Set<number>()
  const regex = new RegExp(`^${prefix}\\[(\\d+)\\]\\.(.+)$`)

  for (const key of formData.keys()) {
    const match = key.match(regex)
    if (match) indices.add(parseInt(match[1]))
  }

  return Array.from(indices).sort().map((i) => {
    const item: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      const match = key.match(new RegExp(`^${prefix}\\[${i}\\]\\.(.+)$`))
      if (match) item[match[1]] = value as string
    }
    return item
  })
}

// Salva arquivo em data/uploads/subdir e retorna o caminho relativo
async function salvarArquivo(file: File | null, subdir: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dir = join('data/uploads', subdir)
  await mkdir(dir, { recursive: true })
  const caminho = join(dir, `${Date.now()}-${file.name}`)
  await writeFile(caminho, buffer)
  return caminho
}

export async function submeterFormulario(_prev: unknown, formData: FormData) {
  try {
    // Extrai e valida dados da clínica
    const dadosClinica = {
      nomeEmpresa: formData.get('nomeEmpresa') as string,
      nomeClinica: formData.get('nomeClinica') as string,
      nomeTitular: formData.get('nomeTitular') as string,
      emailTitular: formData.get('emailTitular') as string,
      quantidadeMedicos: parseInt(formData.get('quantidadeMedicos') as string),
    }

    const validacao = clinicaSchema.safeParse(dadosClinica)
    if (!validacao.success) {
      return { erro: validacao.error.issues[0].message }
    }

    // Salva logo da clínica
    const logoPath = await salvarArquivo(formData.get('logo') as File | null, 'logos')

    // Extrai arrays do FormData
    const medicosRaw = extrairArray(formData, 'medicos')
    const examesRaw = extrairArray(formData, 'exames')
    const dispositivosRaw = extrairArray(formData, 'dispositivos')

    // Valida cada médico
    for (const m of medicosRaw) {
      const val = medicoSchema.safeParse(m)
      if (!val.success) return { erro: `Médico: ${val.error.issues[0].message}` }
    }

    // Valida cada exame
    for (const e of examesRaw) {
      const val = exameSchema.safeParse(e)
      if (!val.success) return { erro: `Exame: ${val.error.issues[0].message}` }
    }

    // Valida cada dispositivo
    for (const d of dispositivosRaw) {
      const val = dispositivoSchema.safeParse(d)
      if (!val.success) return { erro: `Dispositivo: ${val.error.issues[0].message}` }
    }

    // Salva assinaturas dos médicos
    const medicosComAssinatura = await Promise.all(
      medicosRaw.map(async (m, i) => {
        const assinaturaFile = formData.get(`medicos[${i}].assinatura`) as File | null
        const assinaturaPath = await salvarArquivo(assinaturaFile, 'assinaturas')
        return { nome: m.nome, documento: m.documento, email: m.email, assinaturaPath }
      })
    )

    // Salva PDFs dos exames
    const examesComLaudo = await Promise.all(
      examesRaw.map(async (e, i) => {
        const laudoFile = formData.get(`exames[${i}].laudo`) as File | null
        const laudoPath = await salvarArquivo(laudoFile, 'laudos')
        return { nome: e.nome, laudoPath }
      })
    )

    // Persiste tudo no banco
    await prisma.clinica.create({
      data: {
        ...validacao.data,
        logoPath,
        cabecalhoLaudo: formData.get('cabecalhoLaudo') as string || '',
        rodapeLaudo: formData.get('rodapeLaudo') as string || '',
        status: 'PENDENTE',
        medicos: { create: medicosComAssinatura },
        exames: { create: examesComLaudo },
        dispositivos: { create: dispositivosRaw.map((d) => ({
          tipo: d.tipo, marca: d.marca, modelo: d.modelo, numeroSerie: d.numeroSerie
        }))},
      },
    })

    revalidatePath('/admin')
    return { sucesso: true }

  } catch (error) {
    console.error('Erro ao submeter formulário:', error)
    return { erro: 'Erro interno do servidor' }
  }
}
