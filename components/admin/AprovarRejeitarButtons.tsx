'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { aprovarSubmissao, rejeitarSubmissao } from '@/actions/submissoes'

interface AprovarRejeitarButtonsProps {
  clinicaId: number
  status: string
}

export function AprovarRejeitarButtons({ clinicaId, status }: AprovarRejeitarButtonsProps) {
  const [mostrarMotivo, setMostrarMotivo] = useState(false)
  const [motivo, setMotivo] = useState('')

  const aprovarAction = async (_prev: unknown, formData: FormData) => {
    const id = parseInt(formData.get('clinicaId') as string)
    return aprovarSubmissao(id)
  }

  const rejeitarAction = async (_prev: unknown, formData: FormData) => {
    const id = parseInt(formData.get('clinicaId') as string)
    const motivoTexto = formData.get('motivo') as string
    return rejeitarSubmissao(id, motivoTexto)
  }

  const [, aprovarFormAction, aprovando] = useActionState(aprovarAction, null)
  const [, rejeitarFormAction, rejeitando] = useActionState(rejeitarAction, null)

  if (status !== 'PENDENTE') {
    return <StatusBadge status={status as 'PENDENTE' | 'APROVADA' | 'REJEITADA'} />
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <form action={aprovarFormAction}>
          <input type="hidden" name="clinicaId" value={clinicaId} />
          <Button type="submit" disabled={aprovando || rejeitando}>
            {aprovando ? 'Aprovando...' : 'Aprovar'}
          </Button>
        </form>

        {!mostrarMotivo && (
          <Button
            type="button"
            variante="perigo"
            onClick={() => setMostrarMotivo(true)}
            disabled={aprovando || rejeitando}
          >
            Rejeitar
          </Button>
        )}
      </div>

      {mostrarMotivo && (
        <form action={rejeitarFormAction} className="flex flex-col gap-2">
          <input type="hidden" name="clinicaId" value={clinicaId} />
          <textarea
            name="motivo"
            placeholder="Motivo da rejeição..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex gap-2">
            <Button type="submit" variante="perigo" tamanho="pequeno" disabled={rejeitando || !motivo.trim()}>
              {rejeitando ? 'Rejeitando...' : 'Confirmar Rejeição'}
            </Button>
            <Button type="button" variante="secundario" tamanho="pequeno" onClick={() => { setMostrarMotivo(false); setMotivo('') }}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
