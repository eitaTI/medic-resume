'use client'

import { useActionState, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { restaurarBrandingSlot, restaurarBrandingPadrao } from '@/actions/branding'

const SLOTS = [
  { key: 'logo-light', label: 'Logo (Claro)', hint: 'Barra superior e formulário' },
  { key: 'logo-dark', label: 'Logo (Escuro)', hint: 'Barra superior e formulário' },
  { key: 'wallpaper-light', label: 'Fundo (Claro)', hint: 'Login, sucesso e painel' },
  { key: 'wallpaper-dark', label: 'Fundo (Escuro)', hint: 'Login, sucesso e painel' },
  { key: 'icon-light', label: 'Ícone (Claro)', hint: 'Favicon e abas' },
  { key: 'icon-dark', label: 'Ícone (Escuro)', hint: 'Favicon e abas' },
] as const

type SlotKey = (typeof SLOTS)[number]['key']

type ActionState = { sucesso?: boolean; erro?: string } | null

const INPUT_CLS =
  'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 dark:file:text-blue-300'

function SlotCard({
  slot,
  label,
  hint,
}: {
  slot: SlotKey
  label: string
  hint: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploadPending, setUploadPending] = useState(false)
  const [uploadResult, setUploadResult] = useState<ActionState>(null)

  const handleUpload = async (formData: FormData) => {
    const arquivo = formData.get('arquivo') as File | null
    if (!arquivo || arquivo.size === 0) {
      setUploadResult({ erro: 'Selecione um arquivo.' })
      return
    }

    setUploadPending(true)
    setUploadResult(null)

    try {
      const fd = new FormData()
      fd.append('slot', slot)
      fd.append('arquivo', arquivo)

      const res = await fetch('/api/branding/upload', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.sucesso) {
        setUploadResult({ sucesso: true })
        formRef.current?.reset()
      } else {
        setUploadResult({ erro: data.erro || 'Erro ao salvar.' })
      }
    } catch {
      setUploadResult({ erro: 'Erro de conexão.' })
    } finally {
      setUploadPending(false)
    }
  }

  const resetAction = async (
    _prev: ActionState,
    _formData: FormData,
  ): Promise<ActionState> => {
    return restaurarBrandingSlot(slot)
  }

  const [resetResult, resetFormAction, resetPending] = useActionState<ActionState, FormData>(
    resetAction,
    null,
  )

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {label}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        </div>
        <form action={resetFormAction}>
          <Button type="submit" variante="secundario" tamanho="pequeno" disabled={resetPending}>
            {resetPending ? 'Restaurando...' : 'Restaurar Padrão'}
          </Button>
        </form>
      </div>

      <form ref={formRef} action={handleUpload} className="flex flex-col gap-3">
        <input
          type="file"
          name="arquivo"
          accept="image/png,image/jpeg,image/webp"
          required
          className={INPUT_CLS}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" tamanho="pequeno" disabled={uploadPending}>
            {uploadPending ? 'Salvando...' : 'Salvar'}
          </Button>
          {uploadResult && 'sucesso' in uploadResult && (
            <p className="text-sm text-green-600 dark:text-green-400">Salvo com sucesso.</p>
          )}
          {uploadResult && 'erro' in uploadResult && (
            <p className="text-sm text-red-600 dark:text-red-400">{uploadResult.erro}</p>
          )}
          {resetResult && 'sucesso' in resetResult && (
            <p className="text-sm text-green-600 dark:text-green-400">Padrão restaurado.</p>
          )}
          {resetResult && 'erro' in resetResult && (
            <p className="text-sm text-red-600 dark:text-red-400">{resetResult.erro}</p>
          )}
        </div>
      </form>
    </div>
  )
}

export function BrandingManager() {
  const globalResetAction = async (
    _prev: ActionState,
    _formData: FormData,
  ): Promise<ActionState> => {
    return restaurarBrandingPadrao()
  }

  const [resetAllResult, resetAllFormAction, resetAllPending] = useActionState<ActionState, FormData>(
    globalResetAction,
    null,
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Substitua os assets visuais da aplicação. Os arquivos são servidos a partir do
        armazenamento privado (<code>data/branding</code>) e persistem entre deploys.
        Formatos aceitos: PNG, JPEG, WebP. Limite: 5 MB.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SLOTS.map((s) => (
          <SlotCard key={s.key} slot={s.key} label={s.label} hint={s.hint} />
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
        <form action={resetAllFormAction} className="flex items-center gap-3">
          <Button type="submit" variante="perigo" tamanho="pequeno" disabled={resetAllPending}>
            {resetAllPending ? 'Restaurando...' : 'Restaurar Todos os Padrões'}
          </Button>
          {resetAllResult && 'sucesso' in resetAllResult && (
            <p className="text-sm text-green-600 dark:text-green-400">Todos os padrões restaurados.</p>
          )}
          {resetAllResult && 'erro' in resetAllResult && (
            <p className="text-sm text-red-600 dark:text-red-400">{resetAllResult.erro}</p>
          )}
        </form>
      </div>
    </div>
  )
}
