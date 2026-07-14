'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { criarCardJira } from '@/lib/jira'
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

    const clinica = await prisma.clinica.update({
      where: { id },
      data: {
        status: 'APROVADA',
        reviewedAt: new Date(),
        jiraSyncStatus: 'PENDENTE',
      },
      include: {
        medicos: { select: { nome: true, documento: true, email: true, tipo: true, assinaturaPath: true } },
        exames: { select: { nome: true, laudoPath: true } },
        dispositivos: { select: { tipo: true, marca: true, modelo: true, numeroSerie: true } },
      },
    })

    let jiraIssueKey: string | null = null
    let jiraErro: string | null = null

    try {
      jiraIssueKey = await criarCardJira({
        id: clinica.id,
        nomeEmpresa: clinica.nomeEmpresa,
        nomeClinica: clinica.nomeClinica,
        nomeTitular: clinica.nomeTitular,
        emailTitular: clinica.emailTitular,
        celularTitular: clinica.celularTitular,
        documentoTitular: clinica.documentoTitular,
        cnpjEmpresa: clinica.cnpjEmpresa,
        cepClinica: clinica.cepClinica,
        enderecoClinica: clinica.enderecoClinica,
        quantidadeMedicos: clinica.quantidadeMedicos,
        logoPath: clinica.logoPath,
        cabecalhoLaudo: clinica.cabecalhoLaudo,
        rodapeLaudo: clinica.rodapeLaudo,
        medicos: clinica.medicos,
        exames: clinica.exames,
        dispositivos: clinica.dispositivos,
      })
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

    await registrarAcao({
      userId: session.user.id,
      acao: 'APROVAR',
      entidade: 'Clinica',
      entidadeId: id,
      detalhes: {
        jiraIssueKey,
        nomeClinica: clinica.nomeClinica,
      }
    })

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
        medicos: { select: { nome: true, documento: true, email: true, tipo: true, assinaturaPath: true } },
        exames: { select: { nome: true, laudoPath: true } },
        dispositivos: { select: { tipo: true, marca: true, modelo: true, numeroSerie: true } },
      },
    })

    if (!clinica) return { erro: 'Submissão não encontrada' }
    if (clinica.status !== 'APROVADA') return { erro: 'A clínica não está aprovada' }
    if (clinica.jiraSyncStatus === 'SINCRONIZADO') return { erro: 'Jira já sincronizado' }

    const jiraIssueKey = await criarCardJira({
      id: clinica.id,
      nomeEmpresa: clinica.nomeEmpresa,
      nomeClinica: clinica.nomeClinica,
      nomeTitular: clinica.nomeTitular,
      emailTitular: clinica.emailTitular,
      celularTitular: clinica.celularTitular,
      documentoTitular: clinica.documentoTitular,
      cnpjEmpresa: clinica.cnpjEmpresa,
      cepClinica: clinica.cepClinica,
      enderecoClinica: clinica.enderecoClinica,
      quantidadeMedicos: clinica.quantidadeMedicos,
      logoPath: clinica.logoPath,
      cabecalhoLaudo: clinica.cabecalhoLaudo,
      rodapeLaudo: clinica.rodapeLaudo,
      medicos: clinica.medicos,
      exames: clinica.exames,
      dispositivos: clinica.dispositivos,
    })
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
