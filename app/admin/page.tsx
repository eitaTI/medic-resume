'use client'

import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function AdminPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
        bg-[url('/images/zscan-light-wallpaper.png')]
        dark:bg-[url('/images/zscan-dark-wallpaper.png')]"
    >
      <ThemeToggle />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Painel Administrativo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Bem-vindo ao painel de administração.
          </p>
        </div>
      </div>
    </div>
  )
}
