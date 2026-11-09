'use client'

import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { FormularioValues } from '@/lib/validacoes'
import { REQUISITOS_PC_PADRAO, APENDICE_PC_PADRAO } from '@/lib/listas'
import { usePcInfo } from '@/hooks/usePcInfo'

function Aceite({
  name,
  texto,
  erro,
}: {
  name: 'cienteRequisitosPc' | 'cienteProblemasPcFraco' | 'autorizaUsoDados'
  texto: string
  erro?: string
}) {
  const { register, watch, setValue } = useFormContext<FormularioValues>()
  const marcado = !!watch(name)

  return (
    <div className="space-y-1">
      <button
        type="button"
        role="checkbox"
        aria-checked={marcado}
        onClick={() => setValue(name, !marcado, { shouldValidate: true })}
        className="flex items-start gap-3 text-left w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
      >
        <span
          aria-hidden="true"
          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-sm font-bold ${marcado ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent'}`}
        >
          ✓
        </span>
        <span className="text-sm text-gray-700 dark:text-gray-200">{texto}</span>
      </button>
      <input type="checkbox" {...register(name)} checked={marcado} readOnly className="sr-only" aria-hidden="true" tabIndex={-1} />
      {erro && (
        <p className="text-red-500 text-xs mt-1" role="alert">{erro}</p>
      )}
    </div>
  )
}

export function StepConfirmacoes() {
  const { setValue, formState: { errors } } = useFormContext<FormularioValues>()
  const [requisitos, setRequisitos] = useState<string[]>(REQUISITOS_PC_PADRAO)
  const [apendiceAberto, setApendiceAberto] = useState(false)
  const pc = usePcInfo(true)

  useEffect(() => {
    fetch('/api/opcoes-cadastro')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.requisitosPc) && d.requisitosPc.length > 0) setRequisitos(d.requisitosPc)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setValue('pcInfo', {
      nucleos: pc.nucleos,
      memoriaGb: pc.memoriaGb,
      gpu: pc.gpu,
      plataforma: pc.plataforma,
      discoEstimadoGb: pc.discoEstimadoGb,
      discoEstimadoOrigem: pc.discoEstimadoOrigem,
      benchmarkMbps: pc.benchmarkMbps,
      benchmarkEstado: pc.benchmarkEstado,
    }, { shouldValidate: false })
  }, [pc, setValue])

  const benchmarkTexto =
    pc.benchmarkEstado === 'rodando' ? 'Verificando velocidade do armazenamento…' :
    pc.benchmarkEstado === 'ok' && pc.benchmarkMbps !== null ? `Leitura/escrita estimada: ${pc.benchmarkMbps} MB/s (indício — não prova o tipo de disco)` :
    pc.benchmarkEstado === 'indisponivel' ? 'Verificação automática indisponível neste navegador — vale a confirmação manual abaixo.' :
    'Verificação automática do armazenamento ainda não concluída.'

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirmações</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Antes de enviar, confirme que leu e está de acordo com os itens abaixo.
      </p>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Requisitos do computador</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Para o melhor desempenho e funcionamento do sistema, o computador precisa atender aos
          requisitos abaixo. Caso não atenda, podem ocorrer problemas em geral.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {requisitos.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 dark:text-gray-400" role="status">{benchmarkTexto}</p>
        {(pc.nucleos !== null || pc.memoriaGb !== null || pc.discoEstimadoGb !== null) && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Leitura automática deste aparelho:
            {[pc.nucleos !== null ? `${pc.nucleos} núcleos` : null,
              pc.memoriaGb !== null ? `~${pc.memoriaGb} GB de RAM` : null,
              pc.discoEstimadoGb !== null ? `disco estimado em ~${pc.discoEstimadoGb} GB` : null,
              pc.gpu ? `GPU: ${pc.gpu}` : null,
            ].filter(Boolean).join(' • ')}
            {' '}(indício coletado automaticamente — o navegador não revela modelo da CPU, RAM exata ou se o disco é SSD).
          </p>
        )}
      </div>

      <Aceite
        name="cienteRequisitosPc"
        texto="Estou ciente dos requisitos do computador e entendo que, caso não atendidos, podem ocorrer problemas em geral."
        erro={errors.cienteRequisitosPc?.message as string | undefined}
      />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">O que pode ocorrer em um PC abaixo dos requisitos</h3>
          <button
            type="button"
            onClick={() => setApendiceAberto((v) => !v)}
            aria-expanded={apendiceAberto}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 shrink-0"
          >
            {apendiceAberto ? 'Ocultar detalhes' : 'Ler detalhes'}
          </button>
        </div>
        {!apendiceAberto && (
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {APENDICE_PC_PADRAO.map((a) => (
              <li key={a.id}>• <strong>{a.titulo}:</strong> {a.resumo}</li>
            ))}
          </ul>
        )}
        {apendiceAberto && (
          <div className="space-y-3">
            {APENDICE_PC_PADRAO.map((a) => (
              <div key={a.id}>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.titulo}</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {a.detalhes.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <Aceite
        name="cienteProblemasPcFraco"
        texto="Li o resumo acima (e posso ler os detalhes) e estou ciente dos problemas que podem ocorrer caso o computador esteja abaixo dos requisitos."
        erro={errors.cienteProblemasPcFraco?.message as string | undefined}
      />

      <Aceite
        name="autorizaUsoDados"
        texto="Autorizo o uso dos dados enviados neste cadastro (incluindo a leitura automática do aparelho acima) para análise e implantação do sistema."
        erro={errors.autorizaUsoDados?.message as string | undefined}
      />
    </div>
  )
}
