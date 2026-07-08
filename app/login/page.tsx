'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [erro, setErro] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string

    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.message || 'Credenciais inválidas')
        return
      }

      router.push('/admin')
    } catch {
      setErro('Erro ao conectar com o servidor')
    } finally {
      setIsPending(false)
    }
  }

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

          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-sm text-red-600 dark:text-red-400">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
