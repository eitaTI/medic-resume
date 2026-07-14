'use client'

interface StatusBadgeProps {
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA'
}

const cores: Record<StatusBadgeProps['status'], string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  APROVADA: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  REJEITADA: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

const labels: Record<StatusBadgeProps['status'], string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center ${cores[status]}`}
    >
      {labels[status]}
    </span>
  )
}
