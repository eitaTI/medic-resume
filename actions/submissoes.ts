'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

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

    await prisma.clinica.update({
      where: { id },
      data: {
        status: 'APROVADA',
        reviewedAt: new Date(),
      },
    })

    revalidatePath('/admin')
    return { sucesso: true }
  } catch {
    return { erro: 'Erro interno do servidor' }
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
