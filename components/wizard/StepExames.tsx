'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import type { Exame } from '@/lib/validacoes'

// Contador para gerar IDs únicos para cada exame
let exameIdCounter = 0

// Interface que representa um exame com ID para controle do React
interface ExameComId extends Exame {
  id: string
}

// Factory function para criar um exame vazio com ID único
export function criarExameVazio(): ExameComId {
  return { id: `exame_${++exameIdCounter}`, nome: '' }
}

// Props do componente StepExames
interface StepExamesProps {
  cabecalho: string
  rodape: string
  exames: ExameComId[]
  onChange: (dados: { cabecalho: string; rodape: string; exames: ExameComId[] }) => void
}

/**
 * Componente StepExames - Passo do wizard para cadastro de exames
 *
 * Funcionalidades:
 * - Textarea para cabeçalho do laudo (3 linhas)
 * - Textarea para rodapé do laudo (3 linhas)
 * - Lista dinâmica de exames com adicionar/remover
 * - Cada exame possui: Nome do Exame (Input) e PDF do Laudo (FileUpload)
 */
export function StepExames({ cabecalho, rodape, exames, onChange }: StepExamesProps) {
  // Adiciona um novo exame vazio à lista
  const adicionarExame = () => {
    onChange({ cabecalho, rodape, exames: [...exames, criarExameVazio()] })
  }

  // Remove um exame da lista pelo índice
  const removerExame = (index: number) => {
    onChange({ cabecalho, rodape, exames: exames.filter((_, i) => i !== index) })
  }

  // Atualiza os dados de um exame específico (nome ou laudo)
  const atualizarExame = (index: number, dados: Partial<Exame>) => {
    const novosExames = [...exames]
    novosExames[index] = { ...novosExames[index], ...dados }
    onChange({ cabecalho, rodape, exames: novosExames })
  }

  // Atualiza o cabeçalho do laudo
  const atualizarCabecalho = (valor: string) => {
    onChange({ cabecalho: valor, rodape, exames })
  }

  // Atualiza o rodapé do laudo
  const atualizarRodape = (valor: string) => {
    onChange({ cabecalho, rodape: valor, exames })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Exames</h2>

      {/* Campo de cabeçalho do laudo */}
      <div className="space-y-1">
        <label htmlFor="cabecalho-laudo" className="block text-sm font-medium text-gray-700">
          Cabeçalho do Laudo
        </label>
        <textarea
          id="cabecalho-laudo"
          rows={3}
          value={cabecalho}
          onChange={(e) => atualizarCabecalho(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder="Ex: Laboratório de Análises Clínicas..."
        />
      </div>

      {/* Campo de rodapé do laudo */}
      <div className="space-y-1">
        <label htmlFor="rodape-laudo" className="block text-sm font-medium text-gray-700">
          Rodapé do Laudo
        </label>
        <textarea
          id="rodape-laudo"
          rows={3}
          value={rodape}
          onChange={(e) => atualizarRodape(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder="Ex: Resultados validados pelo Dr...."
        />
      </div>

      {/* Lista dinâmica de exames */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Lista de Exames</h3>

        {exames.map((exame, index) => (
          <div key={exame.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
            {/* Cabeçalho do card com número e botão remover */}
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Exame {index + 1}</h4>
              <Button
                variante="perigo"
                tamanho="pequeno"
                onClick={() => removerExame(index)}
              >
                Remover
              </Button>
            </div>

            {/* Campo: Nome do Exame */}
            <Input
              label="Nome do Exame"
              value={exame.nome}
              onChange={(e) => atualizarExame(index, { nome: e.target.value })}
              placeholder="Ex: Hemograma Completo"
              required
            />

            {/* Campo: Upload do Laudo em PDF */}
            <FileUpload
              label="PDF do Laudo"
              accept=".pdf"
              onFile={(file) => atualizarExame(index, { laudo: file })}
            />
          </div>
        ))}

        {/* Botão para adicionar novo exame */}
        <Button variante="secundario" onClick={adicionarExame}>
          + Adicionar Exame
        </Button>
      </div>
    </div>
  )
}
