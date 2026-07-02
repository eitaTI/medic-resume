# Fase 4: Painel Admin

Dashboard para visualização e gestão de submissões.

## Objetivo

Criar interface onde admins visualizam, revisam e gerenciam submissões pendentes.

## Estrutura

```
/admin                  → Dashboard (lista de submissões)
/admin/submissao/[id]   → Detalhe da submissão
```

## Componentes

### 1. Layout Protegido

Crie `app/admin/layout.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Verificar autenticação no servidor
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">ZScan Admin</h1>
          <div className="flex gap-4">
            <a href="/admin" className="hover:text-blue-600">Dashboard</a>
            <a href="/admin/admins" className="hover:text-blue-600">Admins</a>
            <a href="/admin/auditoria" className="hover:text-blue-600">Auditoria</a>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  )
}
```

### 2. Dashboard

Crie `app/admin/page.tsx` (Server Component que chama a Server Action):

```tsx
import { listarSubmissoes } from '@/actions/submissoes'
import { SubmissaoCard } from '@/components/admin/SubmissaoCard'

export default async function AdminDashboard({
  searchParams
}: {
  searchParams: { status?: string }
}) {
  const submissoes = await listarSubmissoes(searchParams.status)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Submissões</h2>

      <div className="flex gap-2 mb-4">
        {['', 'PENDENTE', 'APROVADA', 'REJEITADA'].map((s) => (
          <a
            key={s}
            href={s ? `?status=${s}` : '/'}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              (searchParams.status || '') === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {s || 'Todas'}
          </a>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {submissoes.map((submissao) => (
          <SubmissaoCard key={submissao.id} submissao={submissao} />
        ))}
      </div>

      {submissoes.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Nenhuma submissão encontrada
        </p>
      )}
    </div>
  )
}
```

### 3. SubmissaoCard

Crie `components/admin/SubmissaoCard.tsx`:

```tsx
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface SubmissaoCardProps {
  submissao: {
    id: number
    nomeClinica: string
    nomeTitular: string
    status: string
    createdAt: Date
    medicos: { id: number }[]
  }
}

export function SubmissaoCard({ submissao }: SubmissaoCardProps) {
  const data = new Date(submissao.createdAt).toLocaleDateString('pt-BR')
  
  return (
    <Link href={`/admin/submissao/${submissao.id}`}>
      <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{submissao.nomeClinica}</h3>
          <StatusBadge status={submissao.status} />
        </div>
        
        <p className="text-gray-600 text-sm">Titular: {submissao.nomeTitular}</p>
        <p className="text-gray-600 text-sm">Médicos: {submissao.medicos.length}</p>
        <p className="text-gray-500 text-xs mt-2">{data}</p>
      </div>
    </Link>
  )
}
```

### 4. StatusBadge

Crie `components/ui/StatusBadge.tsx`:

```tsx
interface StatusBadgeProps {
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const estilos = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    APROVADA: 'bg-green-100 text-green-800',
    REJEITADA: 'bg-red-100 text-red-800'
  }

  const labels = {
    PENDENTE: 'Pendente',
    APROVADA: 'Aprovada',
    REJEITADA: 'Rejeitada'
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${estilos[status]}`}>
      {labels[status]}
    </span>
  )
}
```

### 5. Página de Detalhe

Crie `app/admin/submissao/[id]/page.tsx`:

```tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AprovarRejeitarButtons } from '@/components/admin/AprovarRejeitarButtons'
import Image from 'next/image'

interface PageProps {
  params: { id: string }
}

export default async function SubmissaoDetalhePage({ params }: PageProps) {
  const clinica = await prisma.clinica.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      medicos: true,
      exames: true,
      dispositivos: true
    }
  })

  if (!clinica) notFound()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{clinica.nomeClinica}</h2>
        <AprovarRejeitarButtons clinicaId={clinica.id} status={clinica.status} />
      </div>

      {/* Dados da Clínica */}
      <section className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">Dados da Clínica</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Empresa:</strong> {clinica.nomeEmpresa}</div>
          <div><strong>Titular:</strong> {clinica.nomeTitular}</div>
          <div><strong>Email:</strong> {clinica.emailTitular}</div>
          <div><strong>Médicos:</strong> {clinica.quantidadeMedicos}</div>
        </div>
        
        {clinica.logoPath && (
          <div className="mt-4">
            <strong>Logo:</strong>
            <Image src={`/${clinica.logoPath}`} alt="Logo" width={200} height={100} />
          </div>
        )}
      </section>

      {/* Cabeçalho/Rodapé */}
      {(clinica.cabecalhoLaudo || clinica.rodapeLaudo) && (
        <section className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-2">Laudos</h3>
          {clinica.cabecalhoLaudo && (
            <div className="mb-2">
              <strong>Cabeçalho:</strong>
              <p className="text-sm text-gray-600">{clinica.cabecalhoLaudo}</p>
            </div>
          )}
          {clinica.rodapeLaudo && (
            <div>
              <strong>Rodapé:</strong>
              <p className="text-sm text-gray-600">{clinica.rodapeLaudo}</p>
            </div>
          )}
        </section>
      )}

      {/* Médicos */}
      <section className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">Médicos ({clinica.medicos.length})</h3>
        <div className="space-y-2">
          {clinica.medicos.map((medico) => (
            <div key={medico.id} className="p-2 bg-gray-50 rounded text-sm">
              <strong>{medico.nome}</strong> — {medico.documento} — {medico.email}
            </div>
          ))}
        </div>
      </section>

      {/* Exames */}
      <section className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">Exames ({clinica.exames.length})</h3>
        <div className="space-y-2">
          {clinica.exames.map((exame) => (
            <div key={exame.id} className="p-2 bg-gray-50 rounded text-sm">
              <strong>{exame.nome}</strong>
              {exame.laudoPath && (
                <a href={`/${exame.laudoPath}`} className="ml-2 text-blue-600 underline">
                  Ver PDF
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Dispositivos */}
      <section className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold mb-2">Dispositivos ({clinica.dispositivos.length})</h3>
        <div className="space-y-2">
          {clinica.dispositivos.map((dispositivo) => (
            <div key={dispositivo.id} className="p-2 bg-gray-50 rounded text-sm">
              <strong>{dispositivo.tipo}</strong> — {dispositivo.marca} {dispositivo.modelo}
              <span className="text-gray-500 ml-2">Série: {dispositivo.numeroSerie}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

## Server Actions

Crie `actions/submissoes.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function listarSubmissoes(filtro?: string) {
  const where = filtro ? { status: filtro } : {}

  return prisma.clinica.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { medicos: true }
  })
}

export async function detalharSubmissao(id: number) {
  return prisma.clinica.findUnique({
    where: { id },
    include: {
      medicos: true,
      exames: true,
      dispositivos: true
    }
  })
}

export async function aprovarSubmissao(id: number) {
  const session = await auth()
  if (!session) throw new Error('Não autenticado')

  const clinica = await prisma.clinica.findUnique({ where: { id } })
  if (!clinica) throw new Error('Clínica não encontrada')

  await prisma.clinica.update({
    where: { id },
    data: {
      status: 'APROVADA',
      reviewedAt: new Date()
    }
  })

  // Integração com Jira será adicionada na Fase 5
  return { sucesso: true }
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

  return { sucesso: true }
}
```

## Checklist

- [ ] Layout admin com nav
- [ ] Dashboard com lista de submissões
- [ ] SubmissaoCard estilizado
- [ ] StatusBadge funcionando
- [ ] Página de detalhe completa
- [ ] Server Actions de listagem
- [ ] Server Action aprovarSubmissao (básica, sem Jira)
- [ ] Server Action rejeitarSubmissao
- [ ] Dashboard usa listarSubmissoes() com filtro por status