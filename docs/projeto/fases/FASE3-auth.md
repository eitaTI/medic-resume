# Fase 3: Autenticação e Login

Sistema de autenticação para o painel administrativo.

## Objetivo

Permitir que admins façam login seguro para acessar o painel.

## Componentes

### 1. Configuração do Better Auth

Crie `lib/auth.ts` (se já não foi criado na Fase 1):

```typescript
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite'
  }),
  emailAndPassword: {
    enabled: true
  }
})
```

### 2. Server Action de Login

Crie `actions/login.ts`:

```typescript
'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function login(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('senha') as string

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers()
    })

    if (!result) {
      return { erro: 'Credenciais inválidas' }
    }

    return { sucesso: true }
  } catch {
    return { erro: 'Credenciais inválidas' }
  }
}
```

### 3. Tela de Login

Crie `app/login/page.tsx` usando `useActionState`:

```tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { login } from '@/actions/login'

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(login, null)

  if (state?.sucesso) {
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>

        {state?.erro && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
            {state.erro}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            required
          />

          <Input
            label="Senha"
            type="password"
            name="senha"
            required
          />

          <Button
            type="submit"
            variante="primario"
            className="w-full"
            disabled={pending}
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

### 3. Middleware de Proteção

Crie `middleware.ts` na raiz:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  
  // Rotas protegidas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirecionar logado da página de login
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}
```

## Fluxo de Login

```
1. Usuário acessa /login
2. Preenche email e senha
3. Envia para /api/auth/sign-in/email
4. Better Auth valida credenciais
5. Cookie de sessão é criado
6. Redireciona para /admin
7. Middleware valida sessão em rotas /admin
```

## Testes

1. Acesse `/login`
2. Use credenciais do seed: `admin@zscan.com` / `admin123`
3. Verifique se redireciona para `/admin`
4. Teste com credenciais inválidas
5. Acesse `/admin` sem login — deve redirecionar para `/login`

## Checklist

- [ ] Better Auth configurado
- [ ] Tela de login estilizada
- [ ] Middleware de proteção funcionando
- [ ] Login/logout testados
- [ ] Sessão persistente