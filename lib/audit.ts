'use server'

import { prisma } from './prisma'

/**
 * Parâmetros aceitos pela função registrarAcao.
 *
 * - adminId: ID do administrador que realizou a ação (opcional para ações anônimas)
 * - acao: tipo da ação realizada (CRIAR, APROVAR, REJEITAR, EXCLUIR, LOGIN)
 * - entidade: nome da entidade afetada (Clinica, Medico, Admin, etc.)
 * - entidadeId: ID da entidade afetada (opcional)
 * - detalhes: objeto com informações extras sobre a ação (opcional)
 * - ipAddress: endereço IP de onde a ação foi realizada (opcional)
 */
interface RegistrarAcaoParams {
  adminId?: number
  acao: string
  entidade: string
  entidadeId?: number
  detalhes?: Record<string, unknown>
  ipAddress?: string
}

/**
 * Registra uma ação de auditoria no banco de dados.
 *
 * Esta função é responsável por salvar um registro de todas as ações
 * importantes realizadas no sistema, como criar, aprovar, rejeitar
 * ou excluir registros. Isso permite rastrear quem fez o quê e quando.
 *
 * Exemplo de uso:
 * ```ts
 * await registrarAcao({
 *   adminId: 1,
 *   acao: 'CRIAR',
 *   entidade: 'Clinica',
 *   entidadeId: 15,
 *   detalhes: { nomeClinica: 'Clínica Saúde' },
 *   ipAddress: '192.168.1.1'
 * })
 * ```
 *
 * @param params - Parâmetros da ação a ser registrada
 * @returns O registro de auditoria criado no banco
 */
export async function registrarAcao(params: RegistrarAcaoParams) {
  // Converte o objeto detalhes para JSON string antes de salvar
  // O Prisma não aceita objetos diretamente, apenas strings no campo 'detalhes'
  const detalhesJson = params.detalhes
    ? JSON.stringify(params.detalhes)
    : null

  // Insere o registro de auditoria no banco de dados
  return prisma.auditLog.create({
    data: {
      adminId: params.adminId,
      acao: params.acao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      detalhes: detalhesJson,
      ipAddress: params.ipAddress
    }
  })
}
