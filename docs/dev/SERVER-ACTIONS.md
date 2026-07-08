# Padrões de Server Actions

Guia para criação de Server Actions no projeto Medic Resume.

## Visão Geral

Server Actions são funções executadas no servidor chamadas de Client Components. Substituem API Routes tradicionais no Next.js 15.

## Arquivos

```
actions/
├── submeter-formulario.ts    # pública — submissão do wizard
├── login.ts                  # pública — autenticação admin
├── submissoes.ts             # protegida — listar, aprovar, rejeitar
├── admins.ts                 # protegida — CRUD de admins
└── auditoria.ts              # protegida — listar logs
```

## Padrão Básico

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  nome: z.string().min(1),
  email: z.string().email()
})

export async function criarRegistro(formData: FormData) {
  try {
    const dados = { nome: formData.get('nome') as string, ... }
    const valido = schema.safeParse(dados)
    if (!valido.success) return { erro: valido.error.errors[0].message }

    const registro = await prisma.nome.create({ data: valido.data })
    return { sucesso: true, registro }
  } catch {
    return { erro: 'Erro interno do servidor' }
  }
}
```

## Retorno Padronizado

Sempre retorne `{ sucesso: true, dados? }` ou `{ erro: string }` — nunca lance exceções.

```typescript
type Resultado<T> =
  | { sucesso: true; dados: T }
  | { sucesso: false; erro: string }
```

## Actions Protegidas

Verifique a sessão no início de cada action:

```typescript
const session = await auth()
if (!session) return { erro: 'Não autenticado' }
```

## Integração com Auditoria

Use o helper `registrarAcao` de `lib/audit.ts` em ações de mutação:

```typescript
import { registrarAcao } from '@/lib/audit'

await registrarAcao({
  adminId: session.user.id,
  acao: 'APROVAR',
  entidade: 'Clinica',
  entidadeId: clinica.id
})
```

## Uso com useActionState (Client Component)

```tsx
'use client'

import { useActionState } from 'react'

export function MeuForm() {
  const [state, formAction, pending] = useActionState(
    async (prev, formData) => await minhaAction(formData), null
  )

  return (
    <form action={formAction}>
      {state?.erro && <div className="text-red-600">{state.erro}</div>}
      <button disabled={pending}>{pending ? '...' : 'Enviar'}</button>
    </form>
  )
}
```

## Checklist

- [ ] `'use server'` no início
- [ ] Validação com Zod
- [ ] Retorno `{ sucesso }` ou `{ erro }`
- [ ] try/catch nas ações
- [ ] Autenticação em ações protegidas
- [ ] Auditoria em mutações
- [ ] `revalidatePath()` após criar/alterar dados
