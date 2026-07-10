'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login')
            router.refresh()
          },
        },
      })
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
    >
      Sair
    </button>
  )
}
