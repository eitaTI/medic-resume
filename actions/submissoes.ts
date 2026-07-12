'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { registrarAcao } from '@/lib/audit'

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
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    // Busca dados da clínica antes de atualizar (para o log de auditoria)
    const clinica = await prisma.clinica.findUnique({
      where: { id },
      select: { nomeClinica: true, jiraIssueKey: true }
    })

    // Atualiza o status da clínica para APROVADA
    await prisma.clinica.update({
      where: { id },
      data: {
        status: 'APROVADA',
        reviewedAt: new Date(),
      },
    })

    // Registra ação de auditoria: aprovação da clínica
    await registrarAcao({
      userId: session.user.id,
      acao: 'APROVAR',
      entidade: 'Clinica',
      entidadeId: id,
      detalhes: {
        jiraIssueKey: clinica?.jiraIssueKey,
        nomeClinica: clinica?.nomeClinica
      }
    })

    // Atualiza a página para refletir as mudanças
    revalidatePath('/admin')
    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}

export async function rejeitarSubmissao(id: number, motivo: string) {
  try {
    // Verifica se o usuário está autenticado
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    // Busca dados da clínica antes de atualizar (para o log de auditoria)
    const clinica = await prisma.clinica.findUnique({
      where: { id },
      select: { nomeClinica: true }
    })

    // Atualiza o status da clínica para REJEITADA
    await prisma.clinica.update({
      where: { id },
      data: {
        status: 'REJEITADA',
        motivoRejeicao: motivo,
        reviewedAt: new Date(),
      },
    })

    // Registra ação de auditoria: rejeição da clínica
    await registrarAcao({
      userId: session.user.id,
      acao: 'REJEITAR',
      entidade: 'Clinica',
      entidadeId: id,
      detalhes: {
        motivo,
        nomeClinica: clinica?.nomeClinica
      }
    })

    // Atualiza a página para refletir as mudanças
    revalidatePath('/admin')
    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}
