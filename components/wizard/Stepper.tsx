'use client'

interface StepperProps {
  passoAtual: number
  totalPassos: number
  labels: string[]
}

export function Stepper({ passoAtual, totalPassos, labels }: StepperProps) {
  return (
    <ol
      className="flex justify-between items-start relative w-full mb-8"
      role="progressbar"
      aria-label="Progresso do cadastro"
      aria-valuenow={passoAtual + 1}
      aria-valuemin={1}
      aria-valuemax={totalPassos}
    >
      <div className="absolute top-4 left-[5%] right-[5%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />

      {labels.map((label, index) => {
        const isActive = index === passoAtual
        const isCompleted = index < passoAtual
        const circleClass = isCompleted
          ? 'bg-blue-600 border-blue-600 text-white'
          : isActive
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'

        return (
          <li key={index} className="flex flex-col items-center relative z-10 flex-1 text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 border-2 transition-all ${circleClass}`}>
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`text-xs font-semibold ${isCompleted || isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
