# Task 5: Layout Protegido Admin

✅ **Concluído** — criar `app/admin/layout.tsx`

Criar `app/admin/layout.tsx` (Server Component):

- Verificar sessão com `auth.api.getSession({ headers: headers() })` — importar `auth` de `@/lib/auth` e `headers` de `next/headers`
- Se não existir sessão, `redirect('/login')` (importar de `next/navigation`)
- **Navbar fixa no topo**:
  - Fundo: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800`
  - À esquerda: logo "ZScan Admin" (texto bold)
  - À direita: links de navegação
    - Dashboard (`/admin`)
    - Admins (`/admin/admins`) — preparar para Fase 6
    - Auditoria (`/admin/auditoria`) — preparar para Fase 7
  - Links ativos com destaque (ex: `text-blue-600 dark:text-blue-400`)
  - `ThemeToggle` no canto direito (importar de `@/components/ui/ThemeToggle`)
- **Main content**: `max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8` com fundo da página usando wallpapers (aplicado no layout ou nos children)
- Deve ser Server Component puro (sem `'use client'`)

**Estrutura esperada:**

```tsx
// app/admin/layout.tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default async function AdminLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed ...">
      <nav>...</nav>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
```

## Commit

```
feat(admin): criar layout protegido com navbar e verificação de sessão
```
