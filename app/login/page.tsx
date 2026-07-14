'use client'

import { useActionState, useEffect, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useBranding } from '@/components/providers/BrandingProvider'
import { login } from '@/actions/login'

/**
 * Página de Login do Admin.
 *
 * Utiliza Server Action do Next.js para autenticar o usuário.
 * O login é processado server-side via Better Auth e registrado
 * no log de auditoria automaticamente.
 *
 * Funcionalidades:
 * - Formulário de email/senha
 * - Tratamento de erros (credenciais inválidas)
 * - Redirecionamento para /admin após sucesso
 * - Indicador de carregamento durante submissão
 */
export default function LoginPage() {
  const router = useRouter()
  const branding = useBranding()

  // useActionState gerencia o estado da server action
  // - state: resultado da última execução (null no início)
  // - formAction: função para submeter o formulário
  // - isPending: true enquanto a action está executando
  const [state, formAction, isPending] = useActionState(
    async (_prev: { erro?: string } | null, formData: FormData) => {
      const resultado = await login(formData)
      return resultado
    },
    null
  )

  // Se o login foi bem-sucedido, redireciona para o admin
  useEffect(() => {
    if (state && 'sucesso' in state && state.sucesso) {
      router.push('/admin')
    }
  }, [state, router])

  if (state && 'sucesso' in state && state.sucesso) {
    return null
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed transition-colors duration-300
        [background-image:var(--wp-light)] dark:[background-image:var(--wp-dark)]"
      style={{ '--wp-light': branding.wallpaperLight, '--wp-dark': branding.wallpaperDark } as CSSProperties}
    >
      <ThemeToggle />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Login Admin</h1>

          {/* Exibe mensagem de erro se houver */}
          {state && 'erro' in state && state.erro && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-sm text-red-600 dark:text-red-400">
              {state.erro}
            </div>
          )}

          {/* Formulário de login usando Server Action */}
          <form action={formAction} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              name="email"
              required
              placeholder="admin@eitati.com"
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
