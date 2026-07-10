# Task 1: Server Actions de Admins

✅ **Concluído** — criar `actions/admins.ts`

Criar `actions/admins.ts` (`'use server'`):

```ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import bcrypt from 'bcryptjs'
```

**Ações:**

- **`criarAdmin(dados: { nome, email, senha })`**:
  - Verificar sessão com `auth.api.getSession({ headers: await headers() })`
  - Checar email duplicado no modelo `Admin`
  - Hashear senha com `bcrypt.hashSync(senha, 10)` (usar `bcryptjs`, já instalado)
  - Criar no Prisma (`prisma.admin.create`)
  - Retornar `{ sucesso: true }` ou `{ erro: '...' }`

- **`excluirAdmin(id: number)`**:
  - Verificar sessão
  - Impedir auto-exclusão (comparar com `session.user.id` — notar que o session.user.id é do Better Auth, não do modelo Admin)
  - Deletar do Prisma
  - Retornar `{ sucesso: true }` ou `{ erro: '...' }`

**Observações:**
- O modelo `Admin` do Prisma é **separado** da tabela `user` do Better Auth — o Admin model gerencia os administradores do sistema, enquanto o Better Auth gerencia autenticação
- A senha é armazenada no campo `senha` do modelo `Admin` (hasheada com bcrypt)
- `revalidatePath('/admin/admins')` após criar/excluir

## Commit

```
feat(admin): criar server actions de admins (criar/excluir)
```
