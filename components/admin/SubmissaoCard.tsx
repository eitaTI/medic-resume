'use client'

import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface MedicoResumo {
  id: number
  nome: string
  tipo: string
}

interface SubmissaoCardProps {
  submissao: {
    id: number
    nomeClinica: string
    nomeTitular: string
    status: string
    createdAt: string | Date
    medicos: MedicoResumo[]
  }
}

const labelsTipo: Record<string, string> = {
  examinador: 'examinador',
  solicitante: 'solicitante',
  recepcao: 'recepção',
}

function contarMedicos(medicos: MedicoResumo[]) {
  const total = medicos.length
  if (total === 0) return 'Nenhum usuário'

  const contagem: Record<string, number> = {}
  for (const m of medicos) {
    const label = labelsTipo[m.tipo] || m.tipo
    contagem[label] = (contagem[label] || 0) + 1
  }

  const partes = Object.entries(contagem).map(
    ([tipo, qtd]) => `${qtd} ${tipo}${qtd > 1 ? 's' : ''}`
  )

  return `${total} usuário${total > 1 ? 's' : ''} (${partes.join(', ')})`
}

export function SubmissaoCard({ submissao }: SubmissaoCardProps) {
  const dataFormatada = new Date(submissao.createdAt).toLocaleDateString('pt-BR')

  return (
    <Link
      href={`/admin/submissao/${submissao.id}`}
      className="block bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
          {submissao.nomeClinica}
        </h3>
        <StatusBadge status={submissao.status as 'PENDENTE' | 'APROVADA' | 'REJEITADA'} />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {submissao.nomeTitular}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {contarMedicos(submissao.medicos)}
      </p>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        {dataFormatada}
      </p>
    </Link>
  )
}
