'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { FormularioValues } from '@/lib/validacoes'

export function StepEquipamentos() {
  const { control, register, formState: { errors } } = useFormContext<FormularioValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'equipamentos' })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Equipamentos</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Equipamento {index + 1}</h3>
            {index > 0 && (
              <Button
                variante="perigo"
                tamanho="pequeno"
                onClick={() => remove(index)}
              >
                Remover
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tipo"
              {...register(`equipamentos.${index}.tipo`)}
              erro={errors.equipamentos?.[index]?.tipo?.message}
              placeholder="Ex: Raio-X, Ultrassom"
              required
            />
            <Input
              label="Marca"
              {...register(`equipamentos.${index}.marca`)}
              erro={errors.equipamentos?.[index]?.marca?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Modelo"
              {...register(`equipamentos.${index}.modelo`)}
              erro={errors.equipamentos?.[index]?.modelo?.message}
              required
            />
            <Input
              label="Nº de Série"
              {...register(`equipamentos.${index}.numeroSerie`)}
              erro={errors.equipamentos?.[index]?.numeroSerie?.message}
              required
            />
          </div>
        </div>
      ))}

      <Button
        variante="secundario"
        onClick={() => append({ tipo: '', marca: '', modelo: '', numeroSerie: '' })}
      >
        + Adicionar Equipamento
      </Button>
    </div>
  )
}
