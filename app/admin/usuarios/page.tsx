import { prisma } from '@/lib/prisma'

/**
 * Página de Gerenciamento de Usuários.
 *
 * Após a migração para o Better Auth, os usuários do sistema passam a ser
 * registros do modelo `User` (Better Auth), e não mais do modelo `Admin`
 * (removido). Esta página lista os usuários existentes em ordem de criação.
 *
 * Server Component (leitura apenas):
 * - Busca a lista completa de usuários ordenados pela data de criação.
 * - Exibe nome, e-mail e data de cadastro de cada usuário.
 */
export default async function UsuariosPage() {
  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Gerenciar Usuários
      </h1>

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
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {usuario.email}
                  </p>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {usuario.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
