'use client'

import { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  erro?: string
}

export function Input({ label, erro, id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const erroId = erro ? `${inputId}-erro` : undefined

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${erro ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        aria-invalid={!!erro}
        aria-describedby={erroId}
        {...props}
      />
      {erro && (
        <p id={erroId} className="text-red-500 text-xs mt-1" role="alert">{erro}</p>
      )}
    </div>
  )
}
