'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'

export interface Medico {
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
