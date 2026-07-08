# Task 5: Atualizar `middleware.ts` para proteger `/api/uploads/`

❌ **Pendente**

Adicionar `/api/uploads/:path*` ao `matcher` do middleware existente para redirecionar usuários não autenticados antes mesmo de chegarem à rota de arquivos.

## O que fazer

### 1. Alterar `middleware.ts`

Adicionar `/api/uploads/:path*` ao array `matcher`:

```typescript
export const config = {
  matcher: ['/admin/:path*', '/login', '/api/uploads/:path*'],
}
```

### 2. Comportamento esperado

- Usuário **não autenticado** tentando acessar `/api/uploads/...` → redirecionado para `/login`
- Usuário **autenticado** (com cookie `better-auth.session`) → requisição passa para a rota
- A rota da Task 4 também faz sua própria verificação de autenticação (defesa em profundidade)

### 3. Código completo resultante

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'
  const isUploadsRoute = pathname.startsWith('/api/uploads/')

  const sessionCookie = request.cookies.get('better-auth.session')

  if ((isAdminRoute || isUploadsRoute) && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/api/uploads/:path*'],
}
```

## Critérios de aceite

- [ ] `/api/uploads/:path*` adicionado ao `matcher`
- [ ] Middleware redireciona não autenticados para `/login`
- [ ] Middleware NÃO redireciona requisições autenticadas
- [ ] Defesa em profundidade mantida (rota também verifica auth)
- [ ] Build passa sem erros

## Dependências

- Task 4 (rota API) — opcional, mas recomenda-se fazer após criar a rota

## Commit

```
feat(auth): adicionar /api/uploads/:path* ao matcher do middleware
```
