'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { criarAdmin } from '@/actions/admins'

type AdminResult = { sucesso: true } | { erro: string } | null

export function AdminForm() {
  const criarAction = async (
    _prev: AdminResult,
    formData: FormData,
  ): Promise<AdminResult> => {
    const res = await criarAdmin({
      nome: (formData.get('nome') as string) || '',
      email: (formData.get('email') as string) || '',
      senha: (formData.get('senha') as string) || '',
    })
    if (res && 'sucesso' in res) return { sucesso: true }
    if (res && 'erro' in res) return { erro: res.erro }
    return null
  }

  const [result, formAction, pendente] = useActionState<AdminResult, FormData>(
    criarAction,
    null,
  )

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          name="nome"
          placeholder="Nome"
          required
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="senha"
          type="password"
          placeholder="Senha (mín. 6)"
          minLength={6}
          required
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" tamanho="pequeno" disabled={pendente}>
          {pendente ? 'Criando...' : 'Criar Admin'}
        </Button>
        {result && 'sucesso' in result && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Administrador criado com sucesso.
          </p>
        )}
        {result && 'erro' in result && (
          <p className="text-sm text-red-600 dark:text-red-400">{result.erro}</p>
        )}
      </div>
    </form>
  )
}
