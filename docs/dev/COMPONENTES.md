# Padrões de Componentes

Guia para criação de componentes React no projeto ZScan Formulário.

## Estrutura de Pastas

```
components/
├── ui/                 # Componentes genéricos (reutilizáveis)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── FileUpload.tsx
│   └── StatusBadge.tsx
├── wizard/             # Componentes do formulário
│   ├── Stepper.tsx
│   ├── StepClinica.tsx
│   ├── StepMedicos.tsx
│   ├── StepExames.tsx
│   └── StepDispositivos.tsx
└── admin/              # Componentes do painel admin
    ├── SubmissaoCard.tsx
    ├── SubmissaoDetalhe.tsx
    ├── AprovarRejeitarButtons.tsx
    └── AdminForm.tsx
```

## Regras Gerais

1. **Um componente por arquivo**
2. **Nome do arquivo = Nome do componente** (PascalCase)
3. **Exportação nomeada** (não default)
4. **Server Component por padrão** (sem `'use client'`)

## Componente Básico

### Server Component (Padrão)

```tsx
// components/admin/SubmissaoCard.tsx

import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface SubmissaoCardProps {
  submissao: {
    id: number
    nomeClinica: string
    nomeTitular: string
    status: string
    createdAt: Date
  }
}

export function SubmissaoCard({ submissao }: SubmissaoCardProps) {
  const data = new Date(submissao.createdAt).toLocaleDateString('pt-BR')
  
  return (
    <Link href={`/admin/submissao/${submissao.id}`}>
      <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{submissao.nomeClinica}</h3>
          <StatusBadge status={submissao.status} />
        </div>
        <p className="text-gray-600 text-sm">Titular: {submissao.nomeTitular}</p>
        <p className="text-gray-500 text-xs mt-2">{data}</p>
      </div>
    </Link>
  )
}
```

### Client Component

```tsx
// components/admin/AprovarRejeitarButtons.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { aprovarSubmissao, rejeitarSubmissao } from '@/actions/submissoes'

interface AprovarRejeitarButtonsProps {
  clinicaId: number
  status: string
}

export function AprovarRejeitarButtons({ 
  clinicaId, 
  status 
}: AprovarRejeitarButtonsProps) {
  const [motivo, setMotivo] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  if (status !== 'PENDENTE') {
    return null
  }

  const handleAprovar = async () => {
    if (!confirm('Tem certeza que deseja aprovar?')) return
    
    setCarregando(true)
    try {
      await aprovarSubmissao(clinicaId)
      router.refresh()
    } catch (error) {
      alert('Erro ao aprovar')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex gap-4">
      <Button
        variante="primario"
        onClick={handleAprovar}
        disabled={carregando}
      >
        {carregando ? 'Processando...' : 'Aprovar'}
      </Button>
    </div>
  )
}
```

## Componentes UI (Genéricos)

### Button.tsx

```tsx
// components/ui/Button.tsx
'use client'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'perigo'
  tamanho?: 'normal' | 'pequeno'
}

export function Button({ 
  variante = 'primario', 
  tamanho = 'normal', 
  className, 
  ...props 
}: ButtonProps) {
  const estilos = {
    primario: 'bg-blue-600 text-white hover:bg-blue-700',
    secundario: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    perigo: 'bg-red-600 text-white hover:bg-red-700'
  }

  const tamanhos = {
    normal: 'px-4 py-2',
    pequeno: 'px-3 py-1 text-sm'
  }

  return (
    <button
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 
        ${estilos[variante]} ${tamanhos[tamanho]} ${className || ''}`}
      {...props}
    />
  )
}
```

### Input.tsx

```tsx
// components/ui/Input.tsx
'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  erro?: string
}

export function Input({ label, erro, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 outline-none
          ${erro ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {erro && (
        <p className="text-sm text-red-600">{erro}</p>
      )}
    </div>
  )
}
```

### StatusBadge.tsx

```tsx
// components/ui/StatusBadge.tsx

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

### FileUpload.tsx

```tsx
// components/ui/FileUpload.tsx
'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  label: string
  accept: string
  onFile: (file: File) => void
  erro?: string
}

export function FileUpload({ label, accept, onFile, erro }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 10MB.')
      return
    }

    onFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 
          file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium 
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
          ${erro ? 'border border-red-500 rounded-lg' : ''}`}
      />
      {preview && (
        <img 
          src={preview} 
          alt="Preview" 
          className="mt-2 max-h-32 rounded border" 
        />
      )}
      {erro && (
        <p className="text-sm text-red-600">{erro}</p>
      )}
    </div>
  )
}
```

## Padrões de Props

### Interface `Props`

```typescript
// ✅ Bom - Sufixo Props
interface MeuComponenteProps {
  titulo: string
  itens: Item[]
  onClick: (id: number) => void
}

// ❌ Ruim - Sem sufixo
interface MeuComponente {
  titulo: string
}
```

### Props com Default

```typescript
interface ButtonProps {
  variante?: 'primario' | 'secundario' // Opcional com default
  tamanho?: 'normal' | 'pequeno'
}

export function Button({ 
  variante = 'primario', 
  tamanho = 'normal' 
}: ButtonProps) {
  // ...
}
```

### Children

```typescript
interface CardProps {
  titulo: string
  children: React.ReactNode
}

export function Card({ titulo, children }: CardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-bold mb-2">{titulo}</h3>
      {children}
    </div>
  )
}
```

## Composição de Componentes

```tsx
// ✅ Bom - Composição
<SubmissaoCard>
  <SubmissaoCard.Header>
    <StatusBadge status="PENDENTE" />
  </SubmissaoCard.Header>
  <SubmissaoCard.Body>
    <p>Dados da clínica</p>
  </SubmissaoCard.Body>
</SubmissaoCard>

// ✅ Bom - Componentes pequenos e reutilizáveis
<div className="flex gap-2">
  <Button variante="primario">Aprovar</Button>
  <Button variante="perigo">Rejeitar</Button>
</div>
```

## Checklist

- [ ] Um componente por arquivo
- [ ] Nome PascalCase
- [ ] Exportação nomeada
- [ ] Props com interface `Props`
- [ ] Server Component por padrão
- [ ] `'use client'` apenas quando necessário
- [ ] Tipagem explícita
- [ ] Sem `any`
