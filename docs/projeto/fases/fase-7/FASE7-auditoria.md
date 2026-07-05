# Fase 7: Sistema de Auditoria

Registro de todas as ações administrativas.

## Objetivo

Rastrear quem fez o quê e quando no sistema.

## Estrutura

```
/admin/auditoria       → Lista de logs com filtros
```

## Componentes

### 1. Atualizar Schema

Adicione ao `prisma/schema.prisma`:

```prisma
model AuditLog {
  id         Int      @id @default(autoincrement())
  adminId    Int?
  admin      Admin?   @relation(fields: [adminId], references: [id])
  acao       String   # CRIAR, APROVAR, REJEITAR, EXCLUIR, LOGIN
  entidade   String   # Clinica, Medico, Admin, etc.
  entidadeId Int?
  detalhes   String?  # JSON com dados extras
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

Execute migração:

```bash
npx prisma migrate dev --name add-audit-log
```

### 2. Helper de Auditoria

Crie `lib/audit.ts`:

```typescript
import { prisma } from './prisma'

interface RegistrarAcaoParams {
  adminId?: number
  acao: string
  entidade: string
  entidadeId?: number
  detalhes?: Record<string, unknown>
  ipAddress?: string
}

export async function registrarAcao(params: RegistrarAcaoParams) {
  return prisma.auditLog.create({
    data: {
      adminId: params.adminId,
      acao: params.acao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      detalhes: params.detalhes ? JSON.stringify(params.detalhes) : null,
      ipAddress: params.ipAddress
    }
  })
}
```

### 3. Integrar nas Server Actions

Atualize `actions/submissoes.ts` — integrar em todas as ações de mutação:

```typescript
import { registrarAcao } from '@/lib/audit'

export async function aprovarSubmissao(id: number) {
  const session = await auth()
  if (!session) throw new Error('Não autenticado')

  const clinica = await prisma.clinica.findUnique({
    where: { id },
    include: { exames: true, dispositivos: true }
  })

  if (!clinica) throw new Error('Clínica não encontrada')

  const jiraIssueKey = await criarCardJira(clinica)

  await prisma.clinica.update({
    where: { id },
    data: {
      status: 'APROVADA',
      jiraIssueKey,
      reviewedAt: new Date()
    }
  })

  await registrarAcao({
    adminId: session.user.id,
    acao: 'APROVAR',
    entidade: 'Clinica',
    entidadeId: id,
    detalhes: { jiraIssueKey, nomeClinica: clinica.nomeClinica }
  })

  return { sucesso: true, jiraIssueKey }
}

export async function rejeitarSubmissao(id: number, motivo: string) {
  const session = await auth()
  if (!session) throw new Error('Não autenticado')

  await prisma.clinica.update({
    where: { id },
    data: {
      status: 'REJEITADA',
      motivoRejeicao: motivo,
      reviewedAt: new Date()
    }
  })

  await registrarAcao({
    adminId: session.user.id,
    acao: 'REJEITAR',
    entidade: 'Clinica',
    entidadeId: id,
    detalhes: { motivo, nomeClinica: (await prisma.clinica.findUnique({ where: { id } }))?.nomeClinica }
  })

  return { sucesso: true }
}
```

Atualize `actions/admins.ts` — integrar auditoria no CRUD de admins:

```typescript
import { registrarAcao } from '@/lib/audit'

export async function criarAdmin(dados: { nome: string; email: string; senha: string }) {
  const session = await auth()
  if (!session) return { erro: 'Não autenticado' }

  const existente = await prisma.admin.findUnique({ where: { email: dados.email } })
  if (existente) return { erro: 'Email já cadastrado' }

  const senhaHash = await bcrypt.hash(dados.senha, 10)

  const admin = await prisma.admin.create({
    data: { nome: dados.nome, email: dados.email, senha: senhaHash }
  })

  await registrarAcao({
    adminId: session.user.id,
    acao: 'CRIAR',
    entidade: 'Admin',
    entidadeId: admin.id,
    detalhes: { email: admin.email }
  })

  return { sucesso: true, admin }
}

export async function excluirAdmin(id: number) {
  const session = await auth()
  if (!session) return { erro: 'Não autenticado' }
  if (session.user.id === id) return { erro: 'Não é possível excluir seu próprio admin' }

  await prisma.admin.delete({ where: { id } })

  await registrarAcao({
    adminId: session.user.id,
    acao: 'EXCLUIR',
    entidade: 'Admin',
    entidadeId: id
  })

  return { sucesso: true }
}
```

### 4. Componente AuditLogCard

Crie `components/admin/AuditLogCard.tsx`:

```tsx
'use client'

import { useState } from 'react'

interface AuditLog {
  id: number
  createdAt: Date
  acao: string
  entidade: string
  entidadeId?: number | null
  detalhes?: string | null
  admin?: { nome: string } | null
}

export function AuditLogCard({ log }: { log: AuditLog }) {
  const [expandido, setExpandido] = useState(false)

  const estilosAcao: Record<string, string> = {
    APROVAR: 'bg-green-100 text-green-800',
    REJEITAR: 'bg-red-100 text-red-800',
    CRIAR: 'bg-blue-100 text-blue-800',
    EXCLUIR: 'bg-gray-100 text-gray-800',
    LOGIN: 'bg-purple-100 text-purple-800'
  }

  return (
    <div
      className="p-3 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => setExpandido(!expandido)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${estilosAcao[log.acao] || 'bg-gray-100'}`}>
            {log.acao}
          </span>
          <span className="text-sm font-medium">{log.admin?.nome || 'Sistema'}</span>
          <span className="text-sm text-gray-500">{log.entidade}#{log.entidadeId}</span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(log.createdAt).toLocaleString('pt-BR')}
        </span>
      </div>

      {expandido && log.detalhes && (
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(JSON.parse(log.detalhes), null, 2)}
        </pre>
      )}
    </div>
  )
}
```

### 5. Página de Auditoria com Filtros

Crie `app/admin/auditoria/page.tsx`:

```tsx
import { Suspense } from 'react'
import { listarAuditoria } from '@/actions/auditoria'
import { AuditLogCard } from '@/components/admin/AuditLogCard'

export default async function AuditoriaPage({
  searchParams
}: {
  searchParams: { acao?: string; dataInicio?: string; dataFim?: string }
}) {
  const logs = await listarAuditoria({
    acao: searchParams.acao,
    dataInicio: searchParams.dataInicio,
    dataFim: searchParams.dataFim
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Auditoria</h2>

      {/* Filtros */}
      <div className="p-4 bg-white rounded-lg shadow">
        <form className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Ação</label>
            <select name="acao" defaultValue={searchParams.acao || ''}
              className="px-3 py-2 border rounded-lg text-sm">
              <option value="">Todas</option>
              <option value="APROVAR">APROVAR</option>
              <option value="REJEITAR">REJEITAR</option>
              <option value="CRIAR">CRIAR</option>
              <option value="EXCLUIR">EXCLUIR</option>
              <option value="LOGIN">LOGIN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data início</label>
            <input type="date" name="dataInicio" defaultValue={searchParams.dataInicio || ''}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data fim</label>
            <input type="date" name="dataFim" defaultValue={searchParams.dataFim || ''}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <button type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Filtrar
          </button>
        </form>
      </div>

      {/* Lista de logs */}
      <div className="space-y-2">
        {logs.map((log) => (
          <AuditLogCard key={log.id} log={log} />
        ))}

        {logs.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum registro encontrado</p>
        )}
      </div>
    </div>
  )
}
```

### 6. Registrar Login na Auditoria

Adicione em `actions/login.ts`:

```typescript
import { registrarAcao } from '@/lib/audit'
import { prisma } from '@/lib/prisma'

// Dentro da função login, após autenticar com sucesso:
const admin = await prisma.admin.findUnique({ where: { email } })
if (admin) {
  await registrarAcao({
    adminId: admin.id,
    acao: 'LOGIN',
    entidade: 'Admin',
    entidadeId: admin.id
  })
}
```

### 7. Actions de Auditoria

Crie `actions/auditoria.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'

export async function listarAuditoria(filtros?: {
  adminId?: number
  acao?: string
  dataInicio?: string
  dataFim?: string
}) {
  const where: any = {}

  if (filtros?.adminId) where.adminId = filtros.adminId
  if (filtros?.acao) where.acao = filtros.acao
  if (filtros?.dataInicio || filtros?.dataFim) {
    where.createdAt = {}
    if (filtros.dataInicio) where.createdAt.gte = new Date(filtros.dataInicio)
    if (filtros.dataFim) where.createdAt.lte = new Date(filtros.dataFim)
  }

  return prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { admin: true },
    take: 50
  })
}
```

## Ações Registradas

| Ação | Descrição |
|------|-----------|
| `CRIAR` | Criação de clínica, médico, admin |
| `APROVAR` | Aprovação de submissão |
| `REJEITAR` | Rejeição de submissão |
| `EXCLUIR` | Exclusão de registro |
| `LOGIN` | Login do admin |

## Checklist

- [ ] Modelo AuditLog no schema
- [ ] Migração executada
- [ ] Helper registrarAcao()
- [ ] Integrado em aprovarSubmissao, rejeitarSubmissao, criarAdmin, excluirAdmin
- [ ] Login registrado na auditoria
- [ ] Componente AuditLogCard com detalhes expandíveis
- [ ] Página de auditoria com filtros (ação, período)
- [ ] Paginação de 50 registros
- [ ] Testar geração de logs em todas as ações