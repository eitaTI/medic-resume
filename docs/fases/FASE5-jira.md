# Fase 5: Integração Jira

Criação automática de cards no Jira após aprovação.

## Objetivo

Ao aprovar uma submissão, criar um card no Jira com os dados da clínica.

## Componentes

### 1. Cliente Jira

Crie `lib/jira.ts`:

```typescript
import { ofetch } from 'ofetch'

const jiraConfig = {
  baseUrl: process.env.JIRA_BASE_URL,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY
}

export async function criarCardJira(clinica: {
  id: number
  nomeClinica: string
  nomeEmpresa: string
  nomeTitular: string
  emailTitular: string
  quantidadeMedicos: number
  exames: { nome: string }[]
  dispositivos: { tipo: string }[]
}) {
  const auth = Buffer.from(
    `${jiraConfig.email}:${jiraConfig.apiToken}`
  ).toString('base64')

  const description = [
    `Clínica: ${clinica.nomeClinica}`,
    `Empresa: ${clinica.nomeEmpresa}`,
    `Titular: ${clinica.nomeTitular}`,
    `Email: ${clinica.emailTitular}`,
    `Médicos: ${clinica.quantidadeMedicos}`,
    `Exames: ${clinica.exames.map(e => e.nome).join(', ') || 'Nenhum'}`,
    `Dispositivos: ${clinica.dispositivos.map(d => d.tipo).join(', ') || 'Nenhum'}`
  ].join('\n')

  const response = await ofetch(`${jiraConfig.baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: {
      fields: {
        project: { key: jiraConfig.projectKey },
        issuetype: { name: 'Task' },
        summary: `[ZScan] Cadastro - ${clinica.nomeClinica}`,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: description
                }
              ]
            }
          ]
        },
        labels: ['cadastro', 'clinica']
      }
    }
  })

  return response.key // Ex: "ZSCAN-42"
}
```

### 2. Aprovar Submissão

Atualize `actions/submissoes.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { criarCardJira } from '@/lib/jira'

export async function aprovarSubmissao(id: number) {
  const session = await auth()
  if (!session) throw new Error('Não autenticado')

  const clinica = await prisma.clinica.findUnique({
    where: { id },
    include: { exames: true, dispositivos: true }
  })

  if (!clinica) throw new Error('Clínica não encontrada')

  // Criar card no Jira
  const jiraIssueKey = await criarCardJira(clinica)

  // Atualizar status no banco
  await prisma.clinica.update({
    where: { id },
    data: {
      status: 'APROVADA',
      jiraIssueKey,
      reviewedAt: new Date()
    }
  })

  // TODO: Registrar auditoria

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

  // TODO: Registrar auditoria

  return { sucesso: true }
}
```

### 3. Botões de Ação

Crie `components/admin/AprovarRejeitarButtons.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { aprovarSubmissao, rejeitarSubmissao } from '@/actions/submissoes'

interface AprovarRejeitarButtonsProps {
  clinicaId: number
  status: string
}

export function AprovarRejeitarButtons({ clinicaId, status }: AprovarRejeitarButtonsProps) {
  const [motivo, setMotivo] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  if (status !== 'PENDENTE') {
    return null
  }

  const handleAprovar = async () => {
    if (!confirm('Tem certeza que deseja aprovar esta submissão?')) return
    
    setCarregando(true)
    try {
      const result = await aprovarSubmissao(clinicaId)
      alert(`Aprovada! Card criado no Jira: ${result.jiraIssueKey}`)
      router.refresh()
    } catch (error) {
      alert('Erro ao aprovar')
    } finally {
      setCarregando(false)
    }
  }

  const handleRejeitar = async () => {
    if (!motivo.trim()) {
      alert('Informe o motivo da rejeição')
      return
    }
    
    setCarregando(true)
    try {
      await rejeitarSubmissao(clinicaId, motivo)
      alert('Submissão rejeitada')
      router.refresh()
    } catch (error) {
      alert('Erro ao rejeitar')
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
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Motivo da rejeição"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <Button
          variante="perigo"
          onClick={handleRejeitar}
          disabled={carregando}
        >
          Rejeitar
        </Button>
      </div>
    </div>
  )
}
```

## Variáveis de Ambiente

Adicione ao `.env`:

```env
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui
JIRA_PROJECT_KEY=ZSCAN
```

## Fluxo

```
1. Admin clica "Aprovar"
2. Frontend chama aprovarSubmissao(id)
3. Server Action busca dados da clínica
4. Chama criarCardJira() com dados
5. Jira retorna chave do issue (ZSCAN-42)
6. Banco atualizado com status APROVADA e jiraIssueKey
7. UI atualizada
```

## Checklist

- [ ] lib/jira.ts configurado
- [ ] AprovarSubmissao funcionando
- [ ] RejeitarSubmissao funcionando
- [ ] Botões de ação na UI
- [ ] Card criado no Jira corretamente
- [ ] Erros tratados