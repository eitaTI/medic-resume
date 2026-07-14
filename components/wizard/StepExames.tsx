'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import type { FormularioValues } from '@/lib/validacoes'

export function StepExames() {
  const { register, setValue, watch, control, formState: { errors } } = useFormContext<FormularioValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'exames' })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Exames</h2>

      <div className="space-y-1">
        <label htmlFor="cabecalho-laudo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Cabeçalho do Laudo <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cabecalho-laudo"
          rows={3}
          {...register('cabecalhoLaudo')}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.cabecalhoLaudo ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ex: Clínica Médica de Gastro EitaTI, Dr. João Silva - CRM 1234..."
        />
        {errors.cabecalhoLaudo && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.cabecalhoLaudo.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="rodape-laudo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Rodapé do Laudo <span className="text-red-500">*</span>
        </label>
        <textarea
          id="rodape-laudo"
          rows={3}
          {...register('rodapeLaudo')}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${errors.rodapeLaudo ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ex: Endereço Rua X, nº 123 - Bairro, Cidade/UF - Contato: (62) 99999-8888"
        />
        {errors.rodapeLaudo && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.rodapeLaudo.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Lista de Exames</h3>

        {fields.map((field, index) => {
          const temLaudo = watch(`exames.${index}.temLaudo`)
          const temTopicos = watch(`exames.${index}.temTopicos`)

          return (
            <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Exame {index + 1}</h4>
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

              <Input
                label="Nome do Exame"
                {...register(`exames.${index}.nome`)}
                erro={errors.exames?.[index]?.nome?.message}
                placeholder="Ex: Hemograma Completo"
                required
              />

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Possui PDF do Laudo?</span>
                  <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setValue(`exames.${index}.temLaudo`, true, { shouldValidate: true })}
                      className={`px-3 py-1 text-sm font-medium transition-colors ${temLaudo ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue(`exames.${index}.temLaudo`, false, { shouldValidate: true })}
                      className={`px-3 py-1 text-sm font-medium border-l border-gray-300 dark:border-gray-600 transition-colors ${!temLaudo ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      Não
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Possui Tópicos de conteúdo?</span>
                  <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setValue(`exames.${index}.temTopicos`, true, { shouldValidate: true })}
                      className={`px-3 py-1 text-sm font-medium transition-colors ${temTopicos ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue(`exames.${index}.temTopicos`, false, { shouldValidate: true })}
                      className={`px-3 py-1 text-sm font-medium border-l border-gray-300 dark:border-gray-600 transition-colors ${!temTopicos ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      Não
                    </button>
                  </div>
                </div>
              </div>

              {temLaudo && (
                <div className="space-y-1">
                  <FileUpload
                    label="PDF do Laudo"
                    accept=".pdf"
                    acceptHint="Apenas arquivos PDF"
                    onFile={(file) => setValue(`exames.${index}.laudo`, file, { shouldValidate: true })}
                  />
                  {errors.exames?.[index]?.temLaudo?.message && (
                    <p className="text-red-500 text-xs mt-1" role="alert">{errors.exames?.[index]?.temLaudo?.message}</p>
                  )}
                </div>
              )}

              {temTopicos && (
                <div className="space-y-2">
                  <Input
                    label="Tópicos de conteúdo"
                    {...register(`exames.${index}.topicos`)}
                    erro={errors.exames?.[index]?.topicos?.message}
                    placeholder="Descrição - Biopsia - Duodeno - Conclusão - etc"
                  />
                  <div className="flex flex-wrap gap-2">
                    {watch(`exames.${index}.topicos`)?.split('-').map((t) => t.trim()).filter(Boolean).map((topico, ti) => (
                      <span
                        key={ti}
                        className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 dark:bg-blue-900/40 dark:text-blue-200"
                      >
                        {topico}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.exames?.[index]?.temTopicos?.message && (
                <p className="text-red-500 text-xs mt-1" role="alert">{errors.exames?.[index]?.temTopicos?.message}</p>
              )}
            </div>
          )
        })}

        <Button
          variante="secundario"
          onClick={() => append({ nome: '', temLaudo: false, temTopicos: false })}
        >
          + Adicionar Exame
        </Button>
      </div>
    </div>
  )
}
