'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import type { FormularioValues } from '@/lib/validacoes'

function formatCelular(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatDocumento(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) {
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function StepClinica() {
  const { register, setValue, formState: { errors } } = useFormContext<FormularioValues>()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dados da Clínica</h2>

      <Input
        label="Nome da Clínica"
        {...register('nomeClinica')}
        erro={errors.nomeClinica?.message}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome do Titular"
          {...register('nomeTitular')}
          erro={errors.nomeTitular?.message}
          required
        />
        <Input
          label="Email do Titular"
          type="email"
          {...register('emailTitular')}
          erro={errors.emailTitular?.message}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Celular"
          placeholder="(62) 99999-8888"
          {...register('celularTitular')}
          onChange={(e) => {
            setValue('celularTitular', formatCelular(e.target.value), { shouldValidate: false })
          }}
        />
        <Input
          label="Documento (CPF/CNPJ)"
          placeholder="000.000.000-00"
          {...register('documentoTitular')}
          onChange={(e) => {
            setValue('documentoTitular', formatDocumento(e.target.value), { shouldValidate: false })
          }}
        />
      </div>

      <FileUpload
        label="Logo da Clínica"
        accept="image/*"
        acceptHint="PNG, JPG ou JPEG"
        onFile={(file) => setValue('logo', file)}
      />
    </div>
  )
}
