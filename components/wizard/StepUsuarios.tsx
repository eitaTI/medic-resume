'use client'

import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'

const TIPOS_USUARIO = [
  { value: 'examinador', label: 'Médico Examinador' },
  { value: 'solicitante', label: 'Médico Solicitante' },
  { value: 'recepcao', label: 'Recepção' },
] as const

export interface Usuario {
  nome: string
  documento: string
  email: string
  tipo: 'examinador' | 'solicitante' | 'recepcao'
  temAssinatura: boolean
  assinatura?: File
}

interface StepUsuariosProps {
  usuarios: Usuario[]
  onChange: (usuarios: Usuario[]) => void
}

export function criarUsuarioVazio(tipo?: Usuario['tipo']): Usuario {
  return { nome: '', documento: '', email: '', tipo: tipo || 'examinador', temAssinatura: false }
}

export function StepUsuarios({ usuarios, onChange }: StepUsuariosProps) {
  const adicionarUsuario = () => {
    onChange([...usuarios, criarUsuarioVazio()])
  }

  const removerUsuario = (index: number) => {
    onChange(usuarios.filter((_, i) => i !== index))
  }

  const atualizarUsuario = (index: number, dados: Partial<Usuario>) => {
    const novos = [...usuarios]
    novos[index] = { ...novos[index], ...dados }
    onChange(novos)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Usuários</h2>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tipos disponíveis: <strong>Médico Examinador</strong>, <strong>Médico Solicitante</strong> e <strong>Recepção</strong>.
      </p>

      {usuarios.map((usuario, index) => {
        const isPrimeiro = index === 0

        return (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Usuário {index + 1}</h3>
              {!isPrimeiro && (
                <Button
                  variante="perigo"
                  tamanho="pequeno"
                  onClick={() => removerUsuario(index)}
                >
                  Remover
                </Button>
              )}
            </div>

            <Input
              label="Nome completo"
              value={usuario.nome}
              onChange={(e) => atualizarUsuario(index, { nome: e.target.value })}
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
                <div className="space-y-1">
                  <label htmlFor={`tipo-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo</label>
                  <select
                    id={`tipo-${index}`}
                    value={usuario.tipo}
                    onChange={(e) => atualizarUsuario(index, { tipo: e.target.value as Usuario['tipo'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    {TIPOS_USUARIO.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Documento (CRM/CPF)"
                value={usuario.documento}
                onChange={(e) => atualizarUsuario(index, { documento: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={usuario.email}
              onChange={(e) => atualizarUsuario(index, { email: e.target.value })}
              required
            />

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={usuario.temAssinatura}
                onChange={(e) => {
                  const checked = e.target.checked
                  atualizarUsuario(index, { temAssinatura: checked, ...(checked ? {} : { assinatura: undefined }) })
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Possui assinatura digitalizada</span>
            </label>

            {usuario.temAssinatura && (
              <FileUpload
                label="Assinatura (imagem)"
                accept="image/*"
                acceptHint="PNG, JPG ou JPEG"
                onFile={(file) => atualizarUsuario(index, { assinatura: file })}
              />
            )}
          </div>
        )
      })}

      <Button variante="secundario" onClick={adicionarUsuario}>
        + Adicionar Usuário
      </Button>
    </div>
  )
}
