'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import type { DadosClinica } from '@/lib/validacoes'

interface StepClinicaProps {
  dados: Partial<DadosClinica>
  onChange: (dados: Partial<DadosClinica>) => void
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
