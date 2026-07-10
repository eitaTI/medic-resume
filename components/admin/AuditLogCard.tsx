'use client'

import { useState } from 'react'

/**
 * Interface que define a estrutura de um log de auditoria.
 *
 * Cada log representa uma ação realizada no sistema,
 * como criar, aprovar, rejeitar ou excluir registros.
 */
interface AuditLog {
  id: number
  createdAt: string | Date
  acao: string
  entidade: string
  entidadeId?: number | null
  detalhes?: string | null
  admin?: { nome: string; email: string } | null
}

/**
 * Props do componente AuditLogCard.
 *
 * - log: objeto com os dados do registro de auditoria
 */
interface AuditLogCardProps {
  log: AuditLog
}

/**
 * Mapa de cores para cada tipo de ação.
 *
 * Cada ação tem uma cor específica para facilitar
 * a identificação visual na interface:
 * - APROVAR: verde (sucesso)
 * - REJEITAR: vermelho (erro/rejeição)
 * - CRIAR: azul (criação)
 * - EXCLUIR: cinza (exclusão)
 * - LOGIN: roxo (autenticação)
 *
 * Padrão de cores (light/dark):
 * - Light: bg-{color}-100 text-{color}-800
 * - Dark: bg-{color}-900/40 text-{color}-300
 */
const coresPorAcao: Record<string, string> = {
  APROVAR: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  REJEITAR: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  CRIAR: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  EXCLUIR: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  LOGIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
}

/**
 * AuditLogCard - Card de exibição de um log de auditoria.
 *
 * Exibe um resumo da ação realizada com badge colorido,
 * nome do admin, entidade afetada e data/hora.
 *
 * Funcionalidades:
 * - Badge colorido por tipo de ação
 * - Clicável para expandir/colapsar detalhes
 * - Detalhes formatados em JSON legível
 *
 * @param log - Dados do log de auditoria a ser exibido
 */
export function AuditLogCard({ log }: AuditLogCardProps) {
  // Estado para controlar se os detalhes estão expandidos ou colapsados
  const [expandido, setExpandido] = useState(false)

  // Busca a cor correspondente à ação, ou usa cor padrão (cinza)
  const corBadge = coresPorAcao[log.acao] || coresPorAcao.EXCLUIR

  // Formata a data/hora no padrão brasileiro (dd/mm/aaaa hh:mm)
  const dataFormatada = new Date(log.createdAt).toLocaleString('pt-BR')

  // Monta o texto da entidade: "Clinica#15" ou apenas "Clinica" se não tiver ID
  const entidadeTexto = log.entidadeId
    ? `${log.entidade}#${log.entidadeId}`
    : log.entidade

  // Parse dos detalhes: se for string JSON, converte para objeto
  // Se não tiver detalhes ou não for JSON válido, retorna null
  let detalhesFormatados: string | null = null
  if (log.detalhes) {
    try {
      const parsed = JSON.parse(log.detalhes)
      detalhesFormatados = JSON.stringify(parsed, null, 2)
    } catch {
      // Se não for JSON válido, exibe a string original
      detalhesFormatados = log.detalhes
    }
  }

  return (
    <div
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
      onClick={() => setExpandido(!expandido)}
    >
      {/* Cabeçalho do card: badge + admin + data */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badge da ação + entidade */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${corBadge}`}>
              {log.acao}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {entidadeTexto}
            </span>
          </div>

          {/* Nome do admin e data/hora */}
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{log.admin?.nome || 'Sistema'}</span>
            <span>·</span>
            <span>{dataFormatada}</span>
          </div>
        </div>

        {/* Ícone de expandir/colapsar */}
        <svg
          className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${expandido ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Detalhes expandíveis (só aparece quando expandido) */}
      {expandido && detalhesFormatados && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Detalhes
          </p>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
            {detalhesFormatados}
          </pre>
        </div>
      )}

      {/* Mensagem quando não há detalhes (só aparece quando expandido) */}
      {expandido && !detalhesFormatados && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            Nenhum detalhe registrado
          </p>
        </div>
      )}
    </div>
  )
}
