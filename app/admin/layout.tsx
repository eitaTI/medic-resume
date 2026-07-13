import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminNavbar } from '@/components/admin/AdminNavbar'
import { LogoutButton } from '@/components/admin/LogoutButton'
import { getBranding } from '@/lib/branding'
import type { CSSProperties } from 'react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const branding = getBranding()

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
        [background-image:var(--wp-light)] dark:[background-image:var(--wp-dark)]"
      style={{ '--wp-light': branding.wallpaperLight, '--wp-dark': branding.wallpaperDark } as CSSProperties}
    >
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Botão de Logout fixo no canto inferior direito */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
