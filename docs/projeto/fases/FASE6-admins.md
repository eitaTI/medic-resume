# Fase 6: Gerenciar Admins

CRUD de administradores do sistema.

## Objetivo

Permitir que admins criem e gerenciem outros admins.

## Estrutura

```
/admin/admins          → Lista de admins + formulário de criação
```

## Componentes

### 1. Página de Admins

Crie `app/admin/admins/page.tsx`:

```tsx
import { prisma } from '@/lib/prisma'
import { AdminForm } from '@/components/admin/AdminForm'
import { Button } from '@/components/ui/Button'

export default async function AdminsPage() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Admins</h2>
      
      {/* Formulário de criação */}
      <AdminForm />
      
      {/* Lista de admins */}
      <section className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-4">Admins Cadastrados</h3>
        
        <div className="space-y-2">
          {admins.map((admin) => (
            <div key={admin.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <strong>{admin.nome}</strong>
                <span className="text-gray-500 ml-2">{admin.email}</span>
              </div>
              <span className="text-xs text-gray-400">
                Criado em {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
        
        {admins.length === 0 && (
          <p className="text-gray-500 text-center">Nenhum admin cadastrado</p>
        )}
      </section>
    </div>
  )
}
```

### 2. Formulário de Admin

Crie `components/admin/AdminForm.tsx` com `useActionState`:

```tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { criarAdmin } from '@/actions/admins'

export function AdminForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await criarAdmin({
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        senha: formData.get('senha') as string
      })
      if (result.sucesso) router.refresh()
      return result
    },
    null
  )

  return (
    <form action={formAction} className="p-4 bg-white rounded-lg shadow space-y-4">
      <h3 className="font-bold">Novo Admin</h3>

      {state?.erro && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{state.erro}</div>
      )}
      {state?.sucesso && (
        <div className="p-3 bg-green-100 text-green-700 rounded">Admin criado com sucesso!</div>
      )}

      <Input label="Nome" name="nome" required />
      <Input label="Email" type="email" name="email" required />
      <Input label="Senha" type="password" name="senha" minLength={6} required />

      <Button type="submit" variante="primario" disabled={pending}>
        {pending ? 'Criando...' : 'Criar Admin'}
      </Button>
    </form>
  )
}
```

### 3. Server Actions

Crie `actions/admins.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function criarAdmin(dados: {
  nome: string
  email: string
  senha: string
}) {
  const session = await auth()
  if (!session) return { erro: 'Não autenticado' }

  // Verificar se email já existe
  const existente = await prisma.admin.findUnique({
    where: { email: dados.email }
  })

  if (existente) {
    return { erro: 'Email já cadastrado' }
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10)

  const admin = await prisma.admin.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senha: senhaHash
    }
  })

  return { sucesso: true, admin }
}

export async function excluirAdmin(id: number) {
  const session = await auth()
  if (!session) return { erro: 'Não autenticado' }

  // Não permitir excluir a si mesmo
  if (session.user.id === id) {
    return { erro: 'Não é possível excluir seu próprio admin' }
  }

  await prisma.admin.delete({ where: { id } })

  return { sucesso: true }
}
```

## Validações

- Email deve ser único
- Senha deve ter no mínimo 6 caracteres
- Admin não pode excluir a si mesmo

## Checklist

- [ ] Página de admins criada
- [ ] Formulário de criação com useActionState
- [ ] Lista de admins exibida
- [ ] Server Actions CRUD (criarAdmin, excluirAdmin)
- [ ] Validação de email duplicado
- [ ] Proteção contra auto-exclusão