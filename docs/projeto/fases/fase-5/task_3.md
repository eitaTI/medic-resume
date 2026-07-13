# Task 3: Botões Aprovar/Rejeitar com Feedback e Retry Jira

✅ **Concluído** — atualizar `components/admin/AprovarRejeitarButtons.tsx`

## Objetivo

Exibir feedback inline da criação do card Jira após aprovar (sucesso ou aviso de falha),
sem `alert()`, e oferecer retry quando o card não foi criado.

## Estado atual (Fase 4)

O componente já existe em `components/admin/AprovarRejeitarButtons.tsx`, usa
`useActionState` e chama `aprovarSubmissao(id)` / `rejeitarSubmissao(id, motivo)`.
Props atuais: `clinicaId: number`, `status: string`. É usado em
`app/admin/submissao/[id]/page.tsx` (passando `clinica.id` e `clinica.status`).

## Alterações

1. **Props**: adicionar `jiraSyncStatus?: string` (passado por
   `app/admin/submissao/[id]/page.tsx` junto com `status`).
2. **Capturar retorno de `aprovarSubmissao`** no `useActionState` e ler `jiraIssueKey` e
   `jiraErro` quando presentes.
3. **Feedback de sucesso** inline: ao aprovar com sucesso, mostrar
   `Card Jira criado: {jiraIssueKey}` (ex.: `Card Jira criado: EITATI-42`).
4. **Aviso de falha Jira** inline (nunca `alert`) quando `aprovarSubmissao` retornar
   `{ sucesso: true, jiraErro }` — ex.: `Card Jira pendente: {jiraErro}`.
5. **Retry**: nova action `sincronizarJira(id)` via `useActionState`; ao clicar, tenta
   recriar o card. Mostrar botão "Tentar novamente Jira" quando
   `status === 'APROVADA' && jiraSyncStatus !== 'SINCRONIZADO'`.
6. Manter: `router.refresh()` (de `next/navigation`) após sucesso.
7. Manter padrão `useActionState` para `pending`/`carregando`.
8. Manter: se `status === 'PENDENTE'`, exibir ações; se status final, exibir `<StatusBadge>`.

## Esboço de ajuste (preservar estrutura existente)

```tsx
'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { aprovarSubmissao, rejeitarSubmissao, sincronizarJira } from '@/actions/submissoes'

interface AprovarRejeitarButtonsProps {
  clinicaId: number
  status: string
  jiraSyncStatus?: string
}

export function AprovarRejeitarButtons({ clinicaId, status, jiraSyncStatus }: AprovarRejeitarButtonsProps) {
  const router = useRouter()
  // ...estado motivo/motivoTexto (já existe)...

  const aprovarAction = async (_prev: unknown, formData: FormData) => {
    const id = parseInt(formData.get('clinicaId') as string)
    const resultado = await aprovarSubmissao(id)
    if (resultado?.sucesso) router.refresh()
    return resultado // { sucesso, jiraIssueKey } | { sucesso, jiraErro } | { erro }
  }

  const sincronizarAction = async (_prev: unknown, formData: FormData) => {
    const id = parseInt(formData.get('clinicaId') as string)
    const resultado = await sincronizarJira(id)
    if (resultado?.sucesso) router.refresh()
    return resultado // { sucesso, jiraIssueKey } | { erro }
  }

  const [estadoAprovar, aprovarFormAction, aprovando] = useActionState(aprovarAction, null)
  const [estadoSync, sincronizarFormAction, sincronizando] = useActionState(sincronizarAction, null)

  if (status !== 'PENDENTE') {
    return (
      <div className="flex flex-col gap-3">
        <StatusBadge status={status as 'PENDENTE' | 'APROVADA' | 'REJEITADA'} />
        {(jiraSyncStatus === 'ERRO' || jiraSyncStatus === 'PENDENTE') && (
          <div className="flex flex-col gap-1">
            {estadoSync?.erro && (
              <p className="text-sm text-red-600 dark:text-red-400">{estadoSync.erro}</p>
            )}
            {estadoSync?.sucesso && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Card Jira criado: {estadoSync.jiraIssueKey}
              </p>
            )}
            <form action={sincronizarFormAction}>
              <input type="hidden" name="clinicaId" value={clinicaId} />
              <Button type="submit" variante="secundario" tamanho="pequeno" disabled={sincronizando}>
                {sincronizando ? 'Sincronizando...' : 'Tentar novamente Jira'}
              </Button>
            </form>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* feedback de aprovação Jira */}
      {estadoAprovar?.sucesso && estadoAprovar.jiraIssueKey && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Card Jira criado: {estadoAprovar.jiraIssueKey}
        </p>
      )}
      {estadoAprovar?.sucesso && estadoAprovar.jiraErro && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Card Jira pendente: {estadoAprovar.jiraErro}
        </p>
      )}
      {estadoAprovar?.erro && (
        <p className="text-sm text-red-600 dark:text-red-400">{estadoAprovar.erro}</p>
      )}

      {/* ...formulários de Aprovar/Rejeitar existentes... */}
    </div>
  )
}
```

> `app/admin/submissao/[id]/page.tsx:43` deve passar `jiraSyncStatus={clinica.jiraSyncStatus}`.

## Regras

- Usar `useActionState` (já em uso no componente).
- Feedback inline obrigatório; **proibido `alert()`**.
- `router.refresh()` após sucesso.
- Retry visível quando `status === 'APROVADA'` e `jiraSyncStatus` não for `SINCRONIZADO`.
- Tratar erro com mensagem inline legível.

## Commit

```
feat(jira): feedback inline e retry de card Jira nos botões AprovarRejeitar
```
