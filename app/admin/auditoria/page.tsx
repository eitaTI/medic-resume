import { listarAuditoria } from '@/actions/auditoria'
import { AuditLogCard } from '@/components/admin/AuditLogCard'

/**
 * Props da página de auditoria.
 *
 * searchParams contém os filtros enviados via URL:
 * - acao: tipo de ação para filtrar (APROVAR, CRIAR, etc.)
 * - dataInicio: data inicial do período (formato YYYY-MM-DD)
 * - dataFim: data final do período (formato YYYY-MM-DD)
 *
 * No Next.js 15, searchParams é uma Promise que precisa ser aguardada.
 */
interface Props {
  searchParams: Promise<{
    acao?: string
    dataInicio?: string
    dataFim?: string
  }>
}

/**
 * Página de auditoria - Lista os logs de ações do sistema.
 *
 * Permite filtrar por:
 * - Tipo de ação (APROVAR, REJEITAR, CRIAR, EXCLUIR, LOGIN)
 * - Período (data início e data fim)
 *
 * Os filtros são aplicados via URL (query params), permitindo
 * que a página seja compartilhada com os filtros aplicados.
 */
export default async function AuditoriaPage({ searchParams }: Props) {
  // Aguarda os searchParams (Promise no Next.js 15)
  const params = await searchParams

  // Extrai os filtros dos parâmetros de busca
  const filtros = {
    acao: params.acao || undefined,
    dataInicio: params.dataInicio || undefined,
    dataFim: params.dataFim || undefined
  }

  // Chama a server action com os filtros aplicados
  const logs = await listarAuditoria(filtros)

  // Se retornou erro, exibe mensagem de erro
  if ('erro' in logs) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Auditoria
        </h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600">{logs.erro}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Auditoria
      </h1>

      {/* Formulário de filtros */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <form className="flex flex-wrap items-end gap-4">
          {/* Filtro por tipo de ação */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="acao"
              className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Ação
            </label>
            <select
              id="acao"
              name="acao"
              defaultValue={params.acao || ''}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todas</option>
              <option value="APROVAR">Aprovar</option>
              <option value="REJEITAR">Rejeitar</option>
              <option value="CRIAR">Criar</option>
              <option value="EXCLUIR">Excluir</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>

          {/* Filtro por data início */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="dataInicio"
              className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Data Início
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              defaultValue={params.dataInicio || ''}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filtro por data fim */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="dataFim"
              className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Data Fim
            </label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              defaultValue={params.dataFim || ''}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Botão de filtrar */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Lista de logs de auditoria */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum registro encontrado.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <AuditLogCard key={log.id} log={log} />
          ))
        )}
      </div>

      {/* Contador de registros */}
      {logs.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {logs.length} registro(s)
        </div>
      )}
    </div>
  )
}
