'use client'

import { useTheme } from "@/components/providers/ThemeProvider"

export function ThemeToggle() {
  const { tema, mounted, alternarTema } = useTheme()

  return (
    <button
      onClick={alternarTema}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        border border-gray-200 dark:border-gray-700
        shadow-lg hover:shadow-xl
        text-sm font-medium text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-all duration-200"
      aria-label="Alternar tema"
    >
      {mounted && tema === 'claro' ? (
        <>
          <span className="text-lg">🌙</span>
          <span className="hidden sm:inline">Modo escuro</span>
        </>
      ) : mounted && tema === 'escuro' ? (
        <>
          <span className="text-lg">☀️</span>
          <span className="hidden sm:inline">Modo claro</span>
        </>
      ) : (
        <>
          <span className="text-lg">{'\u200B'}</span>
          <span className="hidden sm:inline">Tema</span>
        </>
      )}
    </button>
  )
}
