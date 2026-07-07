'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/login'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()

  const loginAction = async (_prevState: unknown, formData: FormData) => {
    return login(formData)
  }

  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.sucesso) {
      router.push('/admin')
    }
  }, [state, router])

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
        bg-[url('/images/zscan-light-wallpaper.png')]
        dark:bg-[url('/images/zscan-dark-wallpaper.png')]"
    >
      <ThemeToggle />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Login Admin</h1>

          {state?.erro && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-sm text-red-600 dark:text-red-400">
              {state.erro}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              name="email"
              required
              placeholder="admin@zscan.com"
              disabled={isPending}
            />

            <Input
              label="Senha"
              type="password"
              name="senha"
              required
              placeholder="••••••••"
              disabled={isPending}
            />

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={isPending}
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variante="secundario"
                className="w-full justify-center"
                onClick={() => window.location.href = '/formulario'}
              >
                ← Voltar ao formulário
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
