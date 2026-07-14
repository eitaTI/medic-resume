'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { alterarSenha } from '@/actions/admins'

export function MudarSenhaButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(
    async (_prev: { erro?: string } | null, formData: FormData) => {
      const resultado = await alterarSenha({
        senhaAtual: formData.get('senhaAtual') as string,
        novaSenha: formData.get('novaSenha') as string,
        confirmarSenha: formData.get('confirmarSenha') as string,
      })
      if (resultado.sucesso) {
        setIsOpen(false)
      }
      return resultado
    },
    null
  )

  return (
    <>
      <Button variante="secundario" onClick={() => setIsOpen(true)}>
        Mudar Senha
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Mudar Senha
            </h2>

            {state && 'erro' in state && state.erro && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/50 p-3 text-sm text-red-600 dark:text-red-400">
                {state.erro}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <Input
                label="Senha Atual"
                type="password"
                name="senhaAtual"
                required
              />
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  A senha deve ter no mínimo 8 caracteres, letras, números e um caractere especial (!@#$%^&*).
                </p>
                <Input
                  label="Nova Senha"
                  type="password"
                  name="novaSenha"
                  required
                />
                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  name="confirmarSenha"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variante="secundario"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? 'Alterando...' : 'Alterar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
