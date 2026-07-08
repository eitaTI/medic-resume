'use client'

import { useId } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  opcoes: readonly SelectOption[]
  erro?: string
}

export function Select({ label, opcoes, erro, id, className, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id || generatedId

  return (
    <div className="space-y-1">
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${erro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} ${className || ''}`}
        {...props}
      >
        {opcoes.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      {erro && (
        <p className="text-red-500 text-xs mt-1" role="alert">{erro}</p>
      )}
    </div>
  )
}
