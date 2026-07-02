# Padrões de Código

Guia de estilo e convenções de código para o projeto ZScan Formulário.

## TypeScript

### Configuração

```json
{
  "strict": true,
  "noEmit": true,
  "esModuleInterop": true,
  "isolatedModules": true
}
```

### Nomenclatura

| Tipo | Exemplo | Regra |
|------|---------|-------|
| Variável | `nomeClinica` | camelCase |
| Função | `listarSubmissoes` | camelCase |
| Componente | `SubmissaoCard` | PascalCase |
| Interface | `SubmissaoCardProps` | PascalCase + sufixo `Props` |
| Tipo | `StatusType` | PascalCase |
| Constante | `MAX_FILE_SIZE` | UPPER_SNAKE_CASE |
| Arquivo | `submissoes.ts` | kebab-case |
| Componente (arquivo) | `SubmissaoCard.tsx` | PascalCase |

### Tipagem

```typescript
// ✅ Bom - Interfaces explícitas
interface Medico {
  id: number
  nome: string
  documento: string
  email: string
  assinaturaPath?: string
}

// ❌ Ruim - Usar any
const medico: any = {}
```

### Uso de `any`

Evite `any` quando possível. Use alternativas:

```typescript
// ❌ Ruim
function processar(dados: any) { ... }

// ✅ Bom - Usar unknown ou tipos específicos
function processar(dados: Record<string, unknown>) { ... }
function processar(dados: { nome: string; email: string }) { ... }
```

### Enums vs Union Types

Prefira Union Types em vez de enums:

```typescript
// ❌ Evitar
enum Status {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA'
}

// ✅ Preferir
type Status = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

const status: Status = 'PENDENTE'
```

## Funções

### Server Actions

```typescript
// actions/exemplo.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação
const schemaExemplo = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido')
})

// Função com tratamento de erro padronizado
export async function criarExemplo(formData: FormData) {
  try {
    const dados = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string
    }
    
    const validacao = schemaExemplo.safeParse(dados)
    if (!validacao.success) {
      return { erro: validacao.error.errors[0].message }
    }
    
    const registro = await prisma.exemplo.create({
      data: validacao.data
    })
    
    return { sucesso: true, registro }
  } catch (error) {
    console.error('Erro ao criar exemplo:', error)
    return { erro: 'Erro interno do servidor' }
  }
}
```

### Funções Auxiliares

```typescript
// lib/utils.ts

// ✅ Funções puras e testáveis
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data)
}

// ✅ Funções com tipos explícitos
export function extrairArray(
  formData: FormData, 
  prefix: string
): Record<string, string>[] {
  // Implementação
}
```

## Tratamento de Erros

### Padronizado

```typescript
// ✅ Retorno padronizado para Server Actions
type Resultado<T> = 
  | { sucesso: true; dados: T } 
  | { sucesso: false; erro: string }

export async function buscarSubmissao(id: number): Promise<Resultado<Submissao>> {
  try {
    const submissao = await prisma.clinica.findUnique({ where: { id } })
    
    if (!submissao) {
      return { sucesso: false, erro: 'Submissão não encontrada' }
    }
    
    return { sucesso: true, dados: submissao }
  } catch (error) {
    return { sucesso: false, erro: 'Erro ao buscar submissão' }
  }
}
```

### Em Componentes

```typescript
// ✅ Tratamento de erro em Client Components
'use client'

import { useActionState } from 'react'

export function MeuFormulario() {
  const [state, formAction, pending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const resultado = await criarRegistro(formData)
      
      if (resultado.erro) {
        // Mostrar erro para o usuário
        return { erro: resultado.erro }
      }
      
      // Sucesso - redirecionar ou atualizar
      return { sucesso: true }
    },
    null
  )

  return (
    <div>
      {state?.erro && (
        <div className="text-red-600">{state.erro}</div>
      )}
      {/* Formulário */}
    </div>
  )
}
```

## Imports

### Ordem dos Imports

```typescript
// 1. Bibliotecas externas
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

// 2. Componentes
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// 3. Utilitários locais
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// 4. Tipos
import type { Submissao } from '@/types'
```

### Uso de `@/`

Use o alias `@/` para imports relativos à raiz do projeto:

```typescript
// ✅ Bom
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/Button'

// ❌ Ruim
import { prisma } from '../../lib/prisma'
import { Button } from '../components/ui/Button'
```

## Constantes

```typescript
// lib/constants.ts

// Limites
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_MEDICOS = 50
export const ITEMS_PER_PAGE = 50

// Status
export const STATUS_CLINICA = {
  PENDENTE: 'PENDENTE',
  APROVADA: 'APROVADA',
  REJEITADA: 'REJEITADA'
} as const

// Ações de Auditoria
export const ACAO_AUDITORIA = {
  CRIAR: 'CRIAR',
  APROVAR: 'APROVAR',
  REJEITAR: 'REJEITAR',
  EXCLUIR: 'EXCLUIR',
  LOGIN: 'LOGIN'
} as const
```

## Validação

### Com Zod

```typescript
import { z } from 'zod'

// Schema reutilizável
export const schemaEmail = z.string().email('Email inválido')

export const schemaClinica = z.object({
  nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório'),
  nomeClinica: z.string().min(1, 'Nome da clínica é obrigatório'),
  nomeTitular: z.string().min(1, 'Nome do titular é obrigatório'),
  emailTitular: schemaEmail,
  quantidadeMedicos: z.number().min(1, 'Deve ter pelo menos 1 médico')
})

// Uso
const resultado = schemaClinica.safeParse(dados)
if (!resultado.success) {
  console.error(resultado.error.errors)
}
```

## Comentários

### Quando Comentar

```typescript
// ✅ Bom - Explicar "porquê", não "o que"
// O timeout é 30s porque uploads grandes podem demorar
const TIMEOUT = 30000

// ❌ Ruim - Comentar o óbvio
// Retorna o usuário
function getUsuario() { ... }
```

### TODOs

```typescript
// TODO: Implementar paginação
// FIXME: Bug no upload de arquivos grandes
// HACK: Workaround para bug do Next.js 15
```

## Checklist de Código

- [ ] TypeScript sem erros
- [ ] Sem `any` desnecessário
- [ ] Funções com tipos explícitos
- [ ] Tratamento de erros
- [ ] Validação com Zod
- [ ] Imports organizados
- [ ] Sem comentários desnecessários
