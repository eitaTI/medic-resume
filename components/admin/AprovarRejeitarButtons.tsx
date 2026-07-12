'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { aprovarSubmissao, rejeitarSubmissao, sincronizarJira } from '@/actions/submissoes'

interface AprovarRejeitarButtonsProps {
  clinicaId: number
  status: string
  jiraSyncStatus?: string | null
  jiraIssueKey?: string | null
}

type AprovarResult = { sucesso: boolean; jiraIssueKey?: string | null; jiraErro?: string | null } | { erro: string } | null
type SincronizarResult = { sucesso: boolean; jiraIssueKey: string } | { erro: string } | null

function FeedbackJira({
  clinicaId,
  jiraSyncStatus,
  jiraIssueKey,
  sincResult,
  sincState,
  sincando,
}: {
  clinicaId: number
  jiraSyncStatus?: string | null
  jiraIssueKey?: string | null
  sincResult: SincronizarResult
  sincState: (formData: FormData) => void
  sincando: boolean
}) {
  if (jiraSyncStatus === 'SINCRONIZADO') {
    return (
      <p className="text-sm text-green-600 dark:text-green-400">
        Card criado: {jiraIssueKey}
      </p>
    )
  }

  if (jiraSyncStatus === 'ERRO') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Card Jira pendente — tente novamente
        </p>
        <form action={sincState} className="flex gap-2 items-center">
          <input type="hidden" name="clinicaId" value={clinicaId} />
          <Button type="submit" variante="secundario" tamanho="pequeno" disabled={sincando}>
            {sincando ? 'Sincronizando...' : 'Tentar novamente Jira'}
          </Button>
        </form>
        {sincResult && 'erro' in sincResult && (
          <p className="text-sm text-red-600 dark:text-red-400">{sincResult.erro}</p>
        )}
      </div>
    )
  }

  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">Sincronizando com o Jira...</p>
  )
}

export function AprovarRejeitarButtons({
  clinicaId,
  status,
  jiraSyncStatus,
  jiraIssueKey,
}: AprovarRejeitarButtonsProps) {
  const router = useRouter()
  const [mostrarMotivo, setMostrarMotivo] = useState(false)
  const [motivo, setMotivo] = useState('')

  const aprovarAction = async (_prev: AprovarResult, formData: FormData): Promise<AprovarResult> => {
    const id = parseInt(formData.get('clinicaId') as string)
    const res = await aprovarSubmissao(id)
    if (res && 'sucesso' in res) router.refresh()
    return res
  }

  const rejeitarAction = async (_prev: unknown, formData: FormData) => {
    const id = parseInt(formData.get('clinicaId') as string)
    const motivoTexto = formData.get('motivo') as string
    const res = await rejeitarSubmissao(id, motivoTexto)
    if (res && 'sucesso' in res) router.refresh()
    return res
  }

  const sincronizarAction = async (_prev: SincronizarResult, formData: FormData): Promise<SincronizarResult> => {
    const id = parseInt(formData.get('clinicaId') as string)
    const res = await sincronizarJira(id)
    if (res && 'sucesso' in res) router.refresh()
    return res
  }

  const [aprovarResult, aprovarFormAction, aprovando] = useActionState<AprovarResult, FormData>(aprovarAction, null)
  const [, rejeitarFormAction, rejeitando] = useActionState(rejeitarAction, null)
  const [sincResult, sincFormAction, sincando] = useActionState<SincronizarResult, FormData>(sincronizarAction, null)

  if (status !== 'PENDENTE') {
    return (
      <div className="flex flex-col gap-2 items-end">
        <StatusBadge status={status as 'PENDENTE' | 'APROVADA' | 'REJEITADA'} />
        <FeedbackJira
          clinicaId={clinicaId}
          jiraSyncStatus={jiraSyncStatus}
          jiraIssueKey={jiraIssueKey}
          sincResult={sincResult}
          sincState={sincFormAction}
          sincando={sincando}
        />
        {aprovarResult && 'sucesso' in aprovarResult && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {aprovarResult.jiraIssueKey
              ? `Card criado: ${aprovarResult.jiraIssueKey}`
              : 'Aprovação concluída — card Jira pendente'}
          </p>
        )}
      </div>
    )
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
