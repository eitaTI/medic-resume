'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { criarCardJira } from '@/lib/jira'

export async function listarSubmissoes(filtro?: { status?: string }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    const where = filtro?.status ? { status: filtro.status } : {}

    const submissoes = await prisma.clinica.findMany({
      where,
      include: {
        medicos: {
          select: { id: true, nome: true, tipo: true },
        },
        _count: { select: { medicos: true, exames: true, dispositivos: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return submissoes
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}

export async function detalharSubmissao(id: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    const submissao = await prisma.clinica.findUnique({
      where: { id },
      include: {
        medicos: true,
        exames: true,
        dispositivos: true,
      },
    })

    if (!submissao) return { erro: 'Submissão não encontrada' }

    return submissao
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}

export async function aprovarSubmissao(id: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    const clinica = await prisma.clinica.update({
      where: { id },
      data: {
        status: 'APROVADA',
        reviewedAt: new Date(),
        jiraSyncStatus: 'PENDENTE',
      },
      include: {
        exames: { select: { nome: true } },
        dispositivos: { select: { tipo: true, marca: true, modelo: true, numeroSerie: true } },
      },
    })

    let jiraIssueKey: string | null = null
    let jiraErro: string | null = null

    try {
      jiraIssueKey = await criarCardJira(clinica)
      await prisma.clinica.update({
        where: { id },
        data: { jiraIssueKey, jiraSyncStatus: 'SINCRONIZADO' },
      })
    } catch (e) {
      jiraErro = e instanceof Error ? e.message : 'Erro desconhecido'
      await prisma.clinica.update({
        where: { id },
        data: { jiraSyncStatus: 'ERRO' },
      })
    }

    revalidatePath('/admin')
    return { sucesso: true, jiraIssueKey, jiraErro }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}

export async function sincronizarJira(id: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    const clinica = await prisma.clinica.findUnique({
      where: { id },
      include: {
        exames: { select: { nome: true } },
        dispositivos: { select: { tipo: true, marca: true, modelo: true, numeroSerie: true } },
      },
    })

    if (!clinica) return { erro: 'Submissão não encontrada' }
    if (clinica.status !== 'APROVADA') return { erro: 'A clínica não está aprovada' }
    if (clinica.jiraSyncStatus === 'SINCRONIZADO') return { erro: 'Jira já sincronizado' }

    const jiraIssueKey = await criarCardJira(clinica)
    await prisma.clinica.update({
      where: { id },
      data: { jiraIssueKey, jiraSyncStatus: 'SINCRONIZADO' },
    })

    revalidatePath('/admin')
    revalidatePath(`/admin/submissao/${id}`)
    return { sucesso: true, jiraIssueKey }
  } catch (e) {
    const mensagem = e instanceof Error ? e.message : 'Erro desconhecido'
    return { erro: `Erro ao criar card Jira: ${mensagem}` }
  }
}

export async function rejeitarSubmissao(id: number, motivo: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    await prisma.clinica.update({
      where: { id },
      data: {
        status: 'REJEITADA',
        motivoRejeicao: motivo,
        reviewedAt: new Date(),
      },
    })

    revalidatePath('/admin')
    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}
