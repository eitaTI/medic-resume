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
  // Adiciona um novo dispositivo vazio à lista
  const adicionarDispositivo = () => {
    onChange([...dispositivos, { tipo: '', marca: '', modelo: '', numeroSerie: '' }])
  }

  // Remove um dispositivo pelo índice
  const removerDispositivo = (index: number) => {
    onChange(dispositivos.filter((_, i) => i !== index))
  }

  // Atualiza parcialmente um dispositivo no índice
  const atualizarDispositivo = (index: number, dados: Partial<Dispositivo>) => {
    const novos = [...dispositivos]
    novos[index] = { ...novos[index], ...dados }
    onChange(novos)
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
