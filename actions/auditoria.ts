'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

/**
 * Filtros opcionais para busca de logs de auditoria.
 *
 * - userId: filtra por ID do usuário que realizou a ação (Better Auth User.id)
 * - acao: filtra por tipo de ação (CRIAR, APROVAR, REJEITAR, EXCLUIR, LOGIN)
 * - dataInicio: data inicial do período (formato ISO: YYYY-MM-DD)
 * - dataFim: data final do período (formato ISO: YYYY-MM-DD)
 */
interface FiltrosAuditoria {
  userId?: string
  acao?: string
  dataInicio?: string
  dataFim?: string
}

/**
 * Lista logs de auditoria com filtros opcionais.
 *
 * Retorna os últimos 50 registros de auditoria do sistema,
 * incluindo o nome do administrador que realizou cada ação.
 *
 * Funcionalidades:
 * - Verifica se o usuário está autenticado
 * - Monta filtros dinamicamente (aplica só os filtros informados)
 * - Ordena do mais recente para o mais antigo
 * - Limita a 50 registros para performance
 *
 * @param filtros - Filtros opcionais para refinar a busca
 * @returns Array de logs de auditoria ou objeto de erro
 */
export async function listarAuditoria(filtros?: FiltrosAuditoria) {
  try {
    // Verifica se o usuário está autenticado antes de buscar os dados
    // Sem essa verificação, qualquer pessoa poderia acessar os logs
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { erro: 'Não autenticado' }

    // Monta o filtro de período de datas (data início e/ou data fim)
    // Usa gte (greater than or equal) e lte (less than or equal)
    let filtroData: { gte?: Date; lte?: Date } | undefined
    if (filtros?.dataInicio || filtros?.dataFim) {
      filtroData = {}
      if (filtros.dataInicio) {
        filtroData.gte = new Date(filtros.dataInicio)
      }
      if (filtros.dataFim) {
        filtroData.lte = new Date(filtros.dataFim)
      }
    }

    // Monta o objeto 'where' dinamicamente
    // Só inclui os filtros que foram informados pelo usuário
    const where = {
      // Filtro por usuário específico (Better Auth User.id)
      ...(filtros?.userId && { userId: filtros.userId }),
      // Filtro por tipo de ação (ex: apenas "APROVAR")
      ...(filtros?.acao && { acao: filtros.acao }),
      // Filtro por período (se informado)
      ...(filtroData && { createdAt: filtroData })
    }

    // Busca os logs no banco de dados
    const logs = await prisma.auditLog.findMany({
      where,
      // Inclui dados do usuário (Better Auth) para exibição na tela
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      // Ordena do mais recente para o mais antigo
      orderBy: { createdAt: 'desc' },
      // Limita a 50 registros para não sobrecarregar a página
      take: 50
    })

    return logs
  } catch {
    // Em caso de erro, retorna mensagem genérica (não expõe detalhes)
    return { erro: 'Erro interno do servidor' }
  }
}
