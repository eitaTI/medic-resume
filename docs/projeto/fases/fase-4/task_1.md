# Task 1: Server Actions de Submissões

❌ **Pendente** — criar `actions/submissoes.ts`

Criar `actions/submissoes.ts` (`'use server'`):

```ts
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
```

**Ações:**

- **`listarSubmissoes(filtro?: { status?: string })`**:
  - Verificar sessão com `auth.api.getSession({ headers: await headers() })` — se não existir, retornar `{ erro: 'Não autenticado' }`
  - Buscar clínicas do Prisma com filtro opcional por `status` (string), ordenar por `createdAt desc`
  - Incluir `medicos` (apenas `id`, `nome`, `tipo` para o card) e `count` na query
  - Retornar array de submissões

- **`detalharSubmissao(id: number)`**:
  - Verificar sessão
  - Buscar clínica por ID incluindo: `medicos` (todos os campos), `exames`, `dispositivos`
  - Se não encontrar, retornar `{ erro: 'Submissão não encontrada' }`
  - Retornar objeto completo da clínica com relações

- **`aprovarSubmissao(id: number)`**:
  - Verificar sessão
  - Atualizar `status` para `'APROVADA'`, salvar `reviewedAt: new Date()`
  - Retornar `{ sucesso: true }`

- **`rejeitarSubmissao(id: number, motivo: string)`**:
  - Verificar sessão
  - Atualizar `status` para `'REJEITADA'`, salvar `motivoRejeicao` e `reviewedAt: new Date()`
  - Retornar `{ sucesso: true }`

**Observações:**
- Usar `revalidatePath('/admin')` após aprovar/rejeitar para atualizar a listagem
- Tratar erros com try/catch, retornando `{ erro: 'Erro interno do servidor' }`
- O `auth()` direto não existe — usar `auth.api.getSession({ headers: await headers() })`

## Commit

```
feat(admin): criar server actions de listagem, detalhe, aprovação e rejeição
```
