# Fase 2: Formulário Público

Wizard de 4 etapas para coleta de dados de clínicas.

## Objetivo

Criar um formulário completo onde clínicas preenchem seus dados antes de enviar para revisão.

## Estrutura do Wizard

```
Etapa 1: Clínica
  → Nome da empresa
  → Nome da clínica
  → Nome do titular
  → Email do titular
  → Quantidade de médicos
  → Logo (upload)

Etapa 2: Médicos
  → Lista dinâmica de médicos
  → Para cada médico: nome, documento, email, assinatura (upload)

Etapa 3: Exames
  → Cabeçalho do laudo (textarea)
  → Rodapé do laudo (textarea)
  → Lista dinâmica de exames
  → Para cada exame: nome, PDF do laudo (upload)

Etapa 4: Dispositivos
  → Lista dinâmica de dispositivos
  → Para cada dispositivo: tipo, marca, modelo, número de série
```

## Componentes a Criar

### 1. Stepper.tsx

Indicador visual do progresso:

```tsx
// components/wizard/Stepper.tsx
'use client'

interface StepperProps {
  passoAtual: number
  totalPassos: number
  labels: string[]
}

export function Stepper({ passoAtual, totalPassos, labels }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {labels.map((label, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${index <= passoAtual 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
              }`}
          >
            {index + 1}
          </div>
          <span className="ml-2 text-sm font-medium">{label}</span>
          {index < totalPassos - 1 && (
            <div className="w-12 h-0.5 bg-gray-300 mx-4" />
          )}
        </div>
      ))}
    </div>
  )
}
```

### 2. StepClinica.tsx

Formulário da primeira etapa:

```tsx
// components/wizard/StepClinica.tsx
'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'

interface StepClinicaProps {
  dados: any
  onChange: (dados: any) => void
}

export function StepClinica({ dados, onChange }: StepClinicaProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Dados da Clínica</h2>
      
      <Input
        label="Nome da Empresa"
        value={dados.nomeEmpresa || ''}
        onChange={(e) => onChange({ ...dados, nomeEmpresa: e.target.value })}
        required
      />
      
      <Input
        label="Nome da Clínica"
        value={dados.nomeClinica || ''}
        onChange={(e) => onChange({ ...dados, nomeClinica: e.target.value })}
        required
      />
      
      <Input
        label="Nome do Titular"
        value={dados.nomeTitular || ''}
        onChange={(e) => onChange({ ...dados, nomeTitular: e.target.value })}
        required
      />
      
      <Input
        label="Email do Titular"
        type="email"
        value={dados.emailTitular || ''}
        onChange={(e) => onChange({ ...dados, emailTitular: e.target.value })}
        required
      />
      
      <Input
        label="Quantidade de Médicos"
        type="number"
        min="1"
        value={dados.quantidadeMedicos || ''}
        onChange={(e) => onChange({ ...dados, quantidadeMedicos: parseInt(e.target.value) })}
        required
      />
      
      <FileUpload
        label="Logo da Clínica"
        accept="image/*"
        onFile={(file) => onChange({ ...dados, logo: file })}
      />
    </div>
  )
}
```

### 3. StepMedicos.tsx

Lista dinâmica de médicos:

```tsx
// components/wizard/StepMedicos.tsx
'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'

interface Medico {
  nome: string
  documento: string
  email: string
  assinatura?: File
}

interface StepMedicosProps {
  medicos: Medico[]
  onChange: (medicos: Medico[]) => void
}

export function StepMedicos({ medicos, onChange }: StepMedicosProps) {
  const adicionarMedico = () => {
    onChange([...medicos, { nome: '', documento: '', email: '' }])
  }

  const removerMedico = (index: number) => {
    onChange(medicos.filter((_, i) => i !== index))
  }

  const atualizarMedico = (index: number, dados: Partial<Medico>) => {
    const novosMedicos = [...medicos]
    novosMedicos[index] = { ...novosMedicos[index], ...dados }
    onChange(novosMedicos)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Médicos</h2>
      
      {medicos.map((medico, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Médico {index + 1}</h3>
            <Button
              variante="perigo"
              tamanho="pequeno"
              onClick={() => removerMedico(index)}
            >
              Remover
            </Button>
          </div>
          
          <Input
            label="Nome"
            value={medico.nome}
            onChange={(e) => atualizarMedico(index, { nome: e.target.value })}
            required
          />
          
          <Input
            label="Documento (CRM/CPF)"
            value={medico.documento}
            onChange={(e) => atualizarMedico(index, { documento: e.target.value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={medico.email}
            onChange={(e) => atualizarMedico(index, { email: e.target.value })}
            required
          />
          
          <FileUpload
            label="Assinatura (imagem)"
            accept="image/*"
            onFile={(file) => atualizarMedico(index, { assinatura: file })}
          />
        </div>
      ))}
      
      <Button variante="secundario" onClick={adicionarMedico}>
        + Adicionar Médico
      </Button>
    </div>
  )
}
```

### 4. StepExames.tsx

Formulário de exames com cabeçalho/rodapé:

```tsx
// components/wizard/StepExames.tsx
'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'

interface Exame {
  nome: string
  laudo?: File
}

interface StepExamesProps {
  cabecalho: string
  rodape: string
  exames: Exame[]
  onChange: (dados: { cabecalho: string; rodape: string; exames: Exame[] }) => void
}

export function StepExames({ cabecalho, rodape, exames, onChange }: StepExamesProps) {
  const adicionarExame = () => {
    onChange({ cabecalho, rodape, exames: [...exames, { nome: '' }] })
  }

  const removerExame = (index: number) => {
    onChange({ cabecalho, rodape, exames: exames.filter((_, i) => i !== index) })
  }

  const atualizarExame = (index: number, dados: Partial<Exame>) => {
    const novosExames = [...exames]
    novosExames[index] = { ...novosExames[index], ...dados }
    onChange({ cabecalho, rodape, exames: novosExames })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Exames</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Cabeçalho do Laudo</label>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={3}
          value={cabecalho}
          onChange={(e) => onChange({ cabecalho: e.target.value, rodape, exames })}
          placeholder="Texto que aparece no cabeçalho de todos os laudos"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Rodapé do Laudo</label>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={3}
          value={rodape}
          onChange={(e) => onChange({ cabecalho, rodape: e.target.value, exames })}
          placeholder="Texto que aparece no rodapé de todos os laudos"
        />
      </div>
      
      <hr className="my-4" />
      
      {exames.map((exame, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Exame {index + 1}</h3>
            <Button
              variante="perigo"
              tamanho="pequeno"
              onClick={() => removerExame(index)}
            >
              Remover
            </Button>
          </div>
          
          <Input
            label="Nome do Exame"
            value={exame.nome}
            onChange={(e) => atualizarExame(index, { nome: e.target.value })}
            required
          />
          
          <FileUpload
            label="PDF do Laudo"
            accept=".pdf"
            onFile={(file) => atualizarExame(index, { laudo: file })}
          />
        </div>
      ))}
      
      <Button variante="secundario" onClick={adicionarExame}>
        + Adicionar Exame
      </Button>
    </div>
  )
}
```

### 5. StepDispositivos.tsx

Lista dinâmica de dispositivos:

```tsx
// components/wizard/StepDispositivos.tsx
'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Dispositivo {
  tipo: string
  marca: string
  modelo: string
  numeroSerie: string
}

interface StepDispositivosProps {
  dispositivos: Dispositivo[]
  onChange: (dispositivos: Dispositivo[]) => void
}

export function StepDispositivos({ dispositivos, onChange }: StepDispositivosProps) {
  const adicionarDispositivo = () => {
    onChange([...dispositivos, { tipo: '', marca: '', modelo: '', numeroSerie: '' }])
  }

  const removerDispositivo = (index: number) => {
    onChange(dispositivos.filter((_, i) => i !== index))
  }

  const atualizarDispositivo = (index: number, dados: Partial<Dispositivo>) => {
    const novosDispositivos = [...dispositivos]
    novosDispositivos[index] = { ...novosDispositivos[index], ...dados }
    onChange(novosDispositivos)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Dispositivos</h2>
      
      {dispositivos.map((dispositivo, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Dispositivo {index + 1}</h3>
            <Button
              variante="perigo"
              tamanho="pequeno"
              onClick={() => removerDispositivo(index)}
            >
              Remover
            </Button>
          </div>
          
          <Input
            label="Tipo"
            value={dispositivo.tipo}
            onChange={(e) => atualizarDispositivo(index, { tipo: e.target.value })}
            placeholder="Ex: Raio-X, Ultrassom, etc."
            required
          />
          
          <Input
            label="Marca"
            value={dispositivo.marca}
            onChange={(e) => atualizarDispositivo(index, { marca: e.target.value })}
            required
          />
          
          <Input
            label="Modelo"
            value={dispositivo.modelo}
            onChange={(e) => atualizarDispositivo(index, { modelo: e.target.value })}
            required
          />
          
          <Input
            label="Número de Série"
            value={dispositivo.numeroSerie}
            onChange={(e) => atualizarDispositivo(index, { numeroSerie: e.target.value })}
            required
          />
        </div>
      ))}
      
      <Button variante="secundario" onClick={adicionarDispositivo}>
        + Adicionar Dispositivo
      </Button>
    </div>
  )
}
```

## Página Principal do Wizard

Crie `app/formulario/page.tsx` usando `useActionState` para o envio final:

```tsx
// app/formulario/page.tsx
'use client'

import { useState, useActionState } from 'react'
import { Stepper } from '@/components/wizard/Stepper'
import { StepClinica } from '@/components/wizard/StepClinica'
import { StepMedicos } from '@/components/wizard/StepMedicos'
import { StepExames } from '@/components/wizard/StepExames'
import { StepDispositivos } from '@/components/wizard/StepDispositivos'
import { Button } from '@/components/ui/Button'
import { submeterFormulario } from '@/actions/submeter-formulario'

const LABELS = ['Clínica', 'Médicos', 'Exames', 'Dispositivos']

export default function FormularioPage() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [dados, setDados] = useState({
    clinica: {},
    medicos: [{}],
    cabecalhoLaudo: '',
    rodapeLaudo: '',
    exames: [{}],
    dispositivos: [{}]
  })
  const [state, formAction, pending] = useActionState(submeterFormulario, null)

  const proximoPasso = () => {
    if (passoAtual < 3) setPassoAtual(passoAtual + 1)
  }

  const passoAnterior = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastro da Clínica</h1>

      {state?.sucesso && (
        <div className="p-4 mb-4 bg-green-100 text-green-800 rounded-lg">
          Formulário enviado com sucesso!
        </div>
      )}

      {state?.erro && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-lg">
          {state.erro}
        </div>
      )}

      <Stepper passoAtual={passoAtual} totalPassos={4} labels={LABELS} />

      {passoAtual === 0 && (
        <StepClinica
          dados={dados.clinica}
          onChange={(clinica) => setDados({ ...dados, clinica })}
        />
      )}

      {passoAtual === 1 && (
        <StepMedicos
          medicos={dados.medicos}
          onChange={(medicos) => setDados({ ...dados, medicos })}
        />
      )}

      {passoAtual === 2 && (
        <StepExames
          cabecalho={dados.cabecalhoLaudo}
          rodape={dados.rodapeLaudo}
          exames={dados.exames}
          onChange={({ cabecalho, rodape, exames }) =>
            setDados({ ...dados, cabecalhoLaudo: cabecalho, rodapeLaudo: rodape, exames })
          }
        />
      )}

      {passoAtual === 3 && (
        <StepDispositivos
          dispositivos={dados.dispositivos}
          onChange={(dispositivos) => setDados({ ...dados, dispositivos })}
        />
      )}

      <div className="flex justify-between mt-8">
        <Button
          variante="secundario"
          onClick={passoAnterior}
          disabled={passoAtual === 0}
        >
          Anterior
        </Button>

        {passoAtual < 3 ? (
          <Button onClick={proximoPasso}>
            Próximo
          </Button>
        ) : (
          <form action={formAction}>
            <Button type="submit" variante="primario" disabled={pending}>
              {pending ? 'Enviando...' : 'Enviar Formulário'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
```

## Componentes UI Necessários

Crie os componentes em `components/ui/`:

### Button.tsx

```tsx
'use client'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'perigo'
  tamanho?: 'normal' | 'pequeno'
}

export function Button({ variante = 'primario', tamanho = 'normal', className, ...props }: ButtonProps) {
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
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 ${estilos[variante]} ${tamanhos[tamanho]} ${className || ''}`}
      {...props}
    />
  )
}
```

### Input.tsx

```tsx
'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        {...props}
      />
    </div>
  )
}
```

### FileUpload.tsx

```tsx
'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  label: string
  accept: string
  onFile: (file: File) => void
}

export function FileUpload({ label, accept, onFile }: FileUploadProps) {
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {preview && (
        <img src={preview} alt="Preview" className="mt-2 max-h-32 rounded border" />
      )}
    </div>
  )
}
```

## Validação com Zod

Adicione validação antes de enviar:

```typescript
// lib/validacoes.ts
import { z } from 'zod'

export const schemaClinica = z.object({
  nomeEmpresa: z.string().min(1, 'Nome da empresa é obrigatório'),
  nomeClinica: z.string().min(1, 'Nome da clínica é obrigatório'),
  nomeTitular: z.string().min(1, 'Nome do titular é obrigatório'),
  emailTitular: z.string().email('Email inválido'),
  quantidadeMedicos: z.number().min(1, 'Deve ter pelo menos 1 médico')
})

export const schemaMedico = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  documento: z.string().min(1, 'Documento é obrigatório'),
  email: z.string().email('Email inválido')
})

export const schemaExame = z.object({
  nome: z.string().min(1, 'Nome do exame é obrigatório')
})

export const schemaDispositivo = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  numeroSerie: z.string().min(1, 'Número de série é obrigatório')
})
```

## Server Action para Envio

Crie `actions/submeter-formulario.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { schemaClinica, schemaMedico, schemaExame, schemaDispositivo } from '@/lib/validacoes'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

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

async function salvarArquivo(file: File | null, subdir: string): Promise<string | null> {
  if (!file || file.size === 0) return null
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const caminho = join('data/uploads', subdir, `${Date.now()}-${file.name}`)
  await writeFile(caminho, buffer)
  return caminho
}

export async function submeterFormulario(_prev: unknown, formData: FormData) {
  try {
    const dadosClinica = {
      nomeEmpresa: formData.get('nomeEmpresa') as string,
      nomeClinica: formData.get('nomeClinica') as string,
      nomeTitular: formData.get('nomeTitular') as string,
      emailTitular: formData.get('emailTitular') as string,
      quantidadeMedicos: parseInt(formData.get('quantidadeMedicos') as string)
    }

    const validacao = schemaClinica.safeParse(dadosClinica)
    if (!validacao.success) {
      return { erro: validacao.error.errors[0].message }
    }

    const logoPath = await salvarArquivo(formData.get('logo') as File | null, 'logos')

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

## Checklist

- [ ] Stepper criado e funcionando
- [ ] StepClinica com todos os campos
- [ ] StepMedicos com adição/remoção dinâmica
- [ ] StepExames com cabeçalho/rodapé
- [ ] StepDispositivos com adição/remoção dinâmica
- [ ] FileUpload funcionando
- [ ] Validação com Zod
- [ ] Server Action de envio
- [ ] Teste completo do fluxo