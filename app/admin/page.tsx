import Link from 'next/link'
import { listarSubmissoes } from '@/actions/submissoes'
import { SubmissaoCard } from '@/components/admin/SubmissaoCard'

interface Props {
  searchParams: Promise<{ status?: string }>
}

const filtros = [
  { label: 'Todas', valor: undefined },
  { label: 'Pendente', valor: 'PENDENTE' },
  { label: 'Aprovada', valor: 'APROVADA' },
  { label: 'Rejeitada', valor: 'REJEITADA' },
]

export default async function AdminPage({ searchParams }: Props) {
  const { status } = await searchParams
  const resultado = await listarSubmissoes({ status })

  if ('erro' in resultado) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{resultado.erro}</p>
      </div>
    )
  }

  const submissoes = resultado

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Submissões
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {filtros.map((f) => {
          const ativo = f.valor === undefined ? !status : status === f.valor
          const href = f.valor ? `?status=${f.valor}` : '/admin'
          return (
            <Link
              key={f.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                ativo
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </Link>
          )
        })}
      </div>

      {submissoes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma submissão encontrada
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {submissoes.map((submissao) => (
            <SubmissaoCard key={submissao.id} submissao={submissao as never} />
          ))}
        </div>
      )}
    </div>
  )
}
