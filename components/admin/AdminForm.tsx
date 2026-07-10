'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarAdmin } from '@/actions/admins'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface AdminFormState {
  sucesso?: boolean
  erro?: string
}

export function AdminForm() {
  const router = useRouter()

  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    async (_prev, formData) => {
      const nome = formData.get('nome') as string
      const email = formData.get('email') as string
      const senha = formData.get('senha') as string

      const resultado = await criarAdmin({ nome, email, senha })

      if (resultado.sucesso) {
        router.refresh()
        return { sucesso: true }
      }

      return { erro: resultado.erro }
    },
    {}
  )

  return (
    <form action={formAction} className="space-y-4">
      <Input
        label="Nome"
        name="nome"
        placeholder="Nome do administrador"
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="email@exemplo.com"
        required
      />
      <Input
        label="Senha"
        name="senha"
        type="password"
        placeholder="Mínimo 6 caracteres"
        minLength={6}
        required
      />

      {state.erro && (
        <p className="text-red-600 dark:text-red-400 text-sm">{state.erro}</p>
      )}

      {state.sucesso && (
        <p className="text-green-600 dark:text-green-400 text-sm">
          Administrador criado com sucesso!
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Criando...' : 'Criar Admin'}
      </Button>
    </form>
  )
}
