'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import type { FormularioValues } from '@/lib/validacoes'

const TIPOS_USUARIO = [
  { value: 'examinador', label: 'Médico Examinador' },
  { value: 'solicitante', label: 'Médico Solicitante' },
  { value: 'recepcao', label: 'Recepção' },
] as const

export function StepUsuarios() {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext<FormularioValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'usuarios' })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Usuários</h2>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tipos disponíveis: <strong>Médico Examinador</strong>, <strong>Médico Solicitante</strong> e <strong>Recepção</strong>.
      </p>

      {fields.map((field, index) => {
        const isPrimeiro = index === 0

        return (
          <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Usuário {index + 1}</h3>
              {!isPrimeiro && (
                <Button
                  variante="perigo"
                  tamanho="pequeno"
                  onClick={() => remove(index)}
                >
                  Remover
                </Button>
              )}
            </div>

            <Input
              label="Nome completo"
              {...register(`usuarios.${index}.nome`)}
              erro={errors.usuarios?.[index]?.nome?.message}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isPrimeiro ? (
                <div className="space-y-1">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo</span>
                  <p className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    Médico Examinador
                  </p>
                </div>
              ) : (
                <Select
                  label="Tipo"
                  opcoes={TIPOS_USUARIO}
                  {...register(`usuarios.${index}.tipo`)}
                />
              )}

              <Input
                label="Documento (CRM/CPF)"
                {...register(`usuarios.${index}.documento`)}
                erro={errors.usuarios?.[index]?.documento?.message}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              {...register(`usuarios.${index}.email`)}
              erro={errors.usuarios?.[index]?.email?.message}
              required
            />

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register(`usuarios.${index}.temAssinatura`)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Possui assinatura digitalizada</span>
            </label>

            {watch(`usuarios.${index}.temAssinatura`) && (
              <FileUpload
                label="Assinatura (imagem)"
                accept="image/*"
                acceptHint="PNG, JPG ou JPEG"
                onFile={(file) => setValue(`usuarios.${index}.assinatura`, file)}
              />
            )}
          </div>
        )
      })}

      <Button
        variante="secundario"
        onClick={() => append({ nome: '', documento: '', email: '', tipo: 'examinador', temAssinatura: false })}
      >
        + Adicionar Usuário
      </Button>
    </div>
  )
}
