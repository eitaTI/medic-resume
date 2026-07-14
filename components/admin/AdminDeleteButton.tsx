'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { excluirAdmin } from '@/actions/admins'

type DeleteResult = { sucesso: true } | { erro: string } | null

export function AdminDeleteButton({ userId }: { userId: string }) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)

  const excluirAction = async (
    _prev: DeleteResult,
    _formData: FormData,
  ): Promise<DeleteResult> => {
    const res = await excluirAdmin(userId)
    if (res && 'sucesso' in res) {
      router.refresh()
      return { sucesso: true }
    }
    if (res && 'erro' in res) return { erro: res.erro }
    return null
  }

  const [result, formAction, pendente] = useActionState<DeleteResult, FormData>(
    excluirAction,
    null,
  )

  if (confirmando) {
    return (
      <div className="flex items-center gap-2">
        <form action={formAction}>
          <Button type="submit" variante="perigo" tamanho="pequeno" disabled={pendente}>
            {pendente ? 'Excluindo...' : 'Confirmar'}
          </Button>
        </form>
        <Button
          type="button"
          variante="secundario"
          tamanho="pequeno"
          onClick={() => setConfirmando(false)}
          disabled={pendente}
        >
          Cancelar
        </Button>
        {result && 'erro' in result && (
          <p className="text-sm text-red-600 dark:text-red-400">{result.erro}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variante="perigo"
        tamanho="pequeno"
        onClick={() => setConfirmando(true)}
      >
        Excluir
      </Button>
      {result && 'erro' in result && (
        <p className="text-sm text-red-600 dark:text-red-400">{result.erro}</p>
      )}
    </div>
  )
}
