# Padrões de Server Actions

Guia para criação de Server Actions no projeto ZScan Formulário.

## Visão Geral

Server Actions são funções executadas no servidor, chamadas diretamente de Client Components. Substituem API Routes tradicionais no Next.js 15.

## Estrutura de Arquivos

```
actions/
├── submeter-formulario.ts    # pública
├── submissoes.ts             # protegida
├── admins.ts                 # protegida
├── auditoria.ts              # protegida
└── login.ts                  # pública
```

## Padrão Básico

```typescript
// actions/exemplo.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 1. Schema de validação
const schemaExemplo = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido')
})

// 2. Função com retorno padronizado
export async function criarExemplo(formData: FormData) {
  try {
    // 3. Extrair dados do FormData
    const dados = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string
    }
    
    // 4. Validar
    const validacao = schemaExemplo.safeParse(dados)
    if (!validacao.success) {
      return { erro: validacao.error.errors[0].message }
    }
    
    // 5. Executar operação
    const registro = await prisma.exemplo.create({
      data: validacao.data
    })
    
    // 6. Retornar sucesso
    return { sucesso: true, registro }
  } catch (error) {
    // 7. Tratar erros
    console.error('Erro ao criar exemplo:', error)
    return { erro: 'Erro interno do servidor' }
  }
}
```

## Retorno Padronizado

### Tipo de Retorno

```typescript
type Resultado<T> = 
  | { sucesso: true; dados: T } 
  | { sucesso: false; erro: string }
```

### Exemplo de Uso

```typescript
// Na Server Action
export async function buscarSubmissao(id: number): Promise<Resultado<Submissao>> {
  const submissao = await prisma.clinica.findUnique({ where: { id } })
  
  if (!submissao) {
    return { sucesso: false, erro: 'Submissão não encontrada' }
  }
  
  return { sucesso: true, dados: submissao }
}

// No Client Component
const resultado = await buscarSubmissao(1)
if (resultado.sucesso) {
  console.log(resultado.dados)
} else {
  console.error(resultado.erro)
}
```

## Server Actions Públicas

### submeter-formulario.ts

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

export async function submeterFormulario(_prev: unknown, formData: FormData) {
  try {
    // Extrair dados
    const dadosClinica = {
      nomeEmpresa: formData.get('nomeEmpresa') as string,
      nomeClinica: formData.get('nomeClinica') as string,
      nomeTitular: formData.get('nomeTitular') as string,
      emailTitular: formData.get('emailTitular') as string,
      quantidadeMedicos: parseInt(formData.get('quantidadeMedicos') as string)
    }

    // Validar
    const validacao = schemaClinica.safeParse(dadosClinica)
    if (!validacao.success) {
      return { erro: validacao.error.errors[0].message }
    }

    // Salvar arquivo
    const logoPath = await salvarArquivo(
      formData.get('logo') as File | null, 
      'logos'
    )

    // Criar registro
    const clinica = await prisma.clinica.create({
      data: {
        ...validacao.data,
        logoPath,
        cabecalhoLaudo: formData.get('cabecalhoLaudo') as string || '',
        rodapeLaudo: formData.get('rodapeLaudo') as string || '',
        status: 'PENDENTE',
        medicos: {
          create: extrairArray(formData, 'medicos').map((m) => ({
            nome: m.nome || '',
            documento: m.documento || '',
            email: m.email || ''
          }))
        },
        exames: {
          create: extrairArray(formData, 'exames').map((e) => ({
            nome: e.nome || ''
          }))
        },
        dispositivos: {
          create: extrairArray(formData, 'dispositivos').map((d) => ({
            tipo: d.tipo || '',
            marca: d.marca || '',
            modelo: d.modelo || '',
            numeroSerie: d.numeroSerie || ''
          }))
        }
      }
    })

    revalidatePath('/admin')
    return { sucesso: true }
  } catch (error) {
    console.error('Erro ao submeter formulário:', error)
    return { erro: 'Erro interno do servidor' }
  }
}
```

## Server Actions Protegidas

### submissoes.ts

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { criarCardJira } from '@/lib/jira'

// Helper de autenticação
async function verificarAutenticacao() {
  const session = await auth()
  if (!session) {
    throw new Error('Não autenticado')
  }
  return session
}

export async function listarSubmissoes(filtro?: string) {
  await verificarAutenticacao()
  
  const where = filtro ? { status: filtro } : {}

  return prisma.clinica.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { medicos: true }
  })
}

export async function aprovarSubmissao(id: number) {
  const session = await verificarAutenticacao()

  const clinica = await prisma.clinica.findUnique({
    where: { id },
    include: { exames: true, dispositivos: true }
  })

  if (!clinica) {
    return { erro: 'Clínica não encontrada' }
  }

  // Criar card no Jira
  const jiraIssueKey = await criarCardJira(clinica)

  // Atualizar status
  await prisma.clinica.update({
    where: { id },
    data: {
      status: 'APROVADA',
      jiraIssueKey,
      reviewedAt: new Date()
    }
  })

  return { sucesso: true, jiraIssueKey }
}

export async function rejeitarSubmissao(id: number, motivo: string) {
  await verificarAutenticacao()

  if (!motivo.trim()) {
    return { erro: 'Motivo da rejeição é obrigatório' }
  }

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

### admins.ts

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

  // Verificar email duplicado
  const existente = await prisma.admin.findUnique({
    where: { email: dados.email }
  })

  if (existente) {
    return { erro: 'Email já cadastrado' }
  }

  // Hash da senha
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

  // Não permitir auto-exclusão
  if (session.user.id === id) {
    return { erro: 'Não é possível excluir seu próprio admin' }
  }

  await prisma.admin.delete({ where: { id } })

  return { sucesso: true }
}
```

## Helper de Auditoria

```typescript
// lib/audit.ts
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

### Integração com Auditoria

```typescript
// Na Server Action de aprovação
await registrarAcao({
  adminId: session.user.id,
  acao: 'APROVAR',
  entidade: 'Clinica',
  entidadeId: clinica.id,
  detalhes: { jiraIssueKey, nomeClinica: clinica.nomeClinica }
})
```

## Uso com useActionState

### Client Component

```tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { criarExemplo } from '@/actions/exemplo'

export function ExemploForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const resultado = await criarExemplo(formData)
      if (resultado.sucesso) {
        router.refresh()
      }
      return resultado
    },
    null
  )

  return (
    <form action={formAction} className="space-y-4">
      {state?.erro && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {state.erro}
        </div>
      )}
      {state?.sucesso && (
        <div className="p-3 bg-green-100 text-green-700 rounded">
          Criado com sucesso!
        </div>
      )}
      
      <input name="nome" required />
      <input name="email" type="email" required />
      
      <Button type="submit" disabled={pending}>
        {pending ? 'Criando...' : 'Criar'}
      </Button>
    </form>
  )
}
```

## Tratamento de FormData

### Extrair Array

```typescript
function extrairArray(formData: FormData, prefix: string): Record<string, string>[] {
  const indices = new Set<number>()
  const regex = new RegExp(`^${prefix}\\[(\\d+)\\]\\.(.+)$`)

  for (const key of formData.keys()) {
    const match = key.match(regex)
    if (match) indices.add(parseInt(match[1]))
  }

  return Array.from(indices).sort().map((i) => {
    const item: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      const match = key.match(new RegExp(`^${prefix}\\[${i}\\]\\.(.+)$`))
      if (match) item[match[1]] = value as string
    }
    return item
  })
}
```

### Salvar Arquivo

```typescript
async function salvarArquivo(file: File | null, subdir: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const caminho = join('data/uploads', subdir, `${Date.now()}-${file.name}`)
  
  await writeFile(caminho, buffer)
  return caminho
}
```

## Checklist

- [ ] Directiva `'use server'` no início do arquivo
- [ ] Validação com Zod
- [ ] Retorno padronizado (`sucesso` ou `erro`)
- [ ] Tratamento de erros com try/catch
- [ ] Autenticação em ações protegidas
- [ ] Auditoria em ações de mutação
- [ ] `revalidatePath()` após mutações
