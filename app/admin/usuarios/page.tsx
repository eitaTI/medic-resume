import { prisma } from '@/lib/prisma'
import { AdminForm } from '@/components/admin/AdminForm'

/**
 * Página de Gerenciamento de Usuários (Administradores).
 * 
 * Server Component:
 * - Busca a lista completa de administradores ordenados pela data de criação.
 * - Exibe formulário de criação (AdminForm) para novos administradores.
 * - Lista usuários existentes com nome, email e data de cadastro.
 */
export default async function UsuariosPage() {
  // Busca todos os administradores ordenados do mais recente para o mais antigo.
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Gerenciar Usuários
      </h1>

      {/* Formulário de Criação no Topo */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Novo Usuário
        </h2>
        <AdminForm />
      </div>

      {/* Seção de Listagem */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Usuários Cadastrados
        </h2>

        {admins.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum usuário cadastrado.
          </p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {admin.nome}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {admin.email}
                  </p>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {/* Data formatada em PT-BR */}
                  {admin.createdAt.toLocaleDateString('pt-BR', {
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
