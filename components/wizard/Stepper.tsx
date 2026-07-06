'use client'

interface StepperProps {
  passoAtual: number
  totalPassos: number
  labels: string[]
}

export function Stepper({ passoAtual, totalPassos, labels }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {labels.map((label, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${index <= passoAtual
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
              }`}
          >
            {index + 1}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
          {index < totalPassos - 1 && (
            <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600 mx-4" />
          )}
        </div>
      ))}
    </div>
  )
}
