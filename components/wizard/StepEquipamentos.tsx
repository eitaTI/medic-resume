'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface Equipamento {
  tipo: string
  marca: string
  modelo: string
  numeroSerie: string
}

interface StepEquipamentosProps {
  equipamentos: Equipamento[]
  onChange: (equipamentos: Equipamento[]) => void
}

export function StepEquipamentos({ equipamentos, onChange }: StepEquipamentosProps) {
  const adicionarEquipamento = () => {
    onChange([...equipamentos, { tipo: '', marca: '', modelo: '', numeroSerie: '' }])
  }

  const removerEquipamento = (index: number) => {
    onChange(equipamentos.filter((_, i) => i !== index))
  }

  const atualizarEquipamento = (index: number, dados: Partial<Equipamento>) => {
    const novos = [...equipamentos]
    novos[index] = { ...novos[index], ...dados }
    onChange(novos)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Equipamentos</h2>

      {equipamentos.map((equipamento, index) => (
        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Equipamento {index + 1}</h3>
            <Button
              variante="perigo"
              tamanho="pequeno"
              onClick={() => removerEquipamento(index)}
            >
              Remover
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tipo"
              value={equipamento.tipo}
              onChange={(e) => atualizarEquipamento(index, { tipo: e.target.value })}
              placeholder="Ex: Raio-X, Ultrassom"
              required
            />
            <Input
              label="Marca"
              value={equipamento.marca}
              onChange={(e) => atualizarEquipamento(index, { marca: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Modelo"
              value={equipamento.modelo}
              onChange={(e) => atualizarEquipamento(index, { modelo: e.target.value })}
              required
            />
            <Input
              label="Nº de Série"
              value={equipamento.numeroSerie}
              onChange={(e) => atualizarEquipamento(index, { numeroSerie: e.target.value })}
              required
            />
          </div>
        </div>
      ))}

      <Button variante="secundario" onClick={adicionarEquipamento}>
        + Adicionar Equipamento
      </Button>
    </div>
  )
}
