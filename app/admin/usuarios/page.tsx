import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { AdminForm } from '@/components/admin/AdminForm'
import { AdminDeleteButton } from '@/components/admin/AdminDeleteButton'

/**
 * Página de Gerenciamento de Usuários.
 *
 * Após a migração para o Better Auth, os usuários do sistema são registros do
 * modelo `User` (Better Auth). Esta página lista os usuários e permite criar
 * (via `AdminForm`) e excluir (via `AdminDeleteButton`) administradores.
 */
export default async function UsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const usuarioLogadoId = session?.user.id

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Gerenciar Usuários
      </h1>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Novo Administrador
        </h2>
        <AdminForm />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Usuários Cadastrados
        </h2>

        {usuarios.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum usuário cadastrado.
          </p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {usuario.name}
                    {usuario.id === usuarioLogadoId && (
                      <span className="ml-2 text-xs text-gray-400">(você)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {usuario.email}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {usuario.createdAt.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {usuario.id !== usuarioLogadoId && (
                    <AdminDeleteButton userId={usuario.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
