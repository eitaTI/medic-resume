'use client'

import { useEffect, useState } from 'react'

export interface PcInfo {
  nucleos: number | null
  memoriaGb: number | null
  gpu: string | null
  plataforma: string | null
  discoEstimadoGb: number | null
  discoEstimadoOrigem: 'storage-estimate' | null
  benchmarkMbps: number | null
  benchmarkEstado: 'pendente' | 'rodando' | 'ok' | 'indisponivel'
}

const INICIAL: PcInfo = {
  nucleos: null,
  memoriaGb: null,
  gpu: null,
  plataforma: null,
  discoEstimadoGb: null,
  discoEstimadoOrigem: null,
  benchmarkMbps: null,
  benchmarkEstado: 'pendente',
}

function lerGpu(): string | null {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
    if (!gl) return null
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (!ext) return 'GPU detectada (modelo oculto pelo navegador)'
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as unknown
    return typeof renderer === 'string' && renderer ? renderer : null
  } catch {
    return null
  }
}

async function estimarDiscoGb(): Promise<number | null> {
  try {
    if (!('storage' in navigator) || typeof navigator.storage?.estimate !== 'function') return null
    const { quota } = await navigator.storage.estimate()
    // Chromium: quota ≈ 60% do disco → estima o total. Firefox/Safari usam
    // outra base, então o valor é aproximado — serve como indício, não prova.
    if (!quota || quota <= 0) return null
    return Math.round(quota / 0.6 / 1024 / 1024 / 1024)
  } catch {
    return null
  }
}

const BENCH_BYTES = 8 * 1024 * 1024
const BENCH_TIMEOUT_MS = 3000

async function benchmarkDiscoMbps(signal: AbortSignal): Promise<number | null> {
  try {
    if (typeof indexedDB === 'undefined' || typeof performance === 'undefined') return null
    const dados = new Uint8Array(BENCH_BYTES)
    crypto.getRandomValues(dados.slice(0, 65536))
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase('pc-benchmark')
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error ?? new Error('indexedDB indisponível'))
      req.onblocked = () => reject(new Error('indexedDB bloqueado'))
    })
    const abrir = () =>
      new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open('pc-benchmark', 1)
        req.onupgradeneeded = () => req.result.createObjectStore('blobs')
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB indisponível'))
      })
    const db = await abrir()
    try {
      const t0 = performance.now()
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('blobs', 'readwrite')
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error ?? new Error('escrita falhou'))
        tx.objectStore('blobs').put(dados, 'amostra')
      })
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('blobs', 'readonly')
        const get = tx.objectStore('blobs').get('amostra')
        get.onsuccess = () => resolve()
        get.onerror = () => reject(get.error ?? new Error('leitura falhou'))
      })
      const ms = performance.now() - t0
      if (signal.aborted || ms <= 0) return null
      return Math.round(((BENCH_BYTES * 2) / 1024 / 1024 / (ms / 1000)) * 10) / 10
    } finally {
      db.close()
      await new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase('pc-benchmark')
        req.onsuccess = () => resolve()
        req.onerror = () => resolve()
        req.onblocked = () => resolve()
      })
    }
  } catch {
    return null
  }
}

/**
 * Lê o que o navegador expõe do PC, sem instalar nada (indícios, não prova).
 *
 * PORQUÊ: o browser bloqueia por privacidade o exato (modelo da CPU, SSD vs
 * HDD, RAM exata). Coletamos núcleos, faixa de RAM, GPU, plataforma, disco
 * estimado e um benchmark rápido de IndexedDB (~8 MB, timeout 3s). O cliente
 * confirma manualmente os requisitos — a leitura automática é evidência
 * complementar salva junto no JSON de confirmações.
 */
export function usePcInfo(ativo: boolean): PcInfo {
  const [info, setInfo] = useState<PcInfo>(INICIAL)

  useEffect(() => {
    if (!ativo) return
    let cancelado = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), BENCH_TIMEOUT_MS)

    const nav = navigator as Navigator & {
      deviceMemory?: number
      userAgentData?: { platform?: string }
    }
    const nucleos =
      typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency > 0
        ? nav.hardwareConcurrency
        : null
    const memoriaGb =
      typeof nav.deviceMemory === 'number' && nav.deviceMemory > 0 ? nav.deviceMemory : null
    const plataforma =
      nav.userAgentData?.platform ?? nav.platform ?? nav.userAgent ?? null

    setInfo((atual) => ({ ...atual, nucleos, memoriaGb, gpu: lerGpu(), plataforma, benchmarkEstado: 'rodando' }))

    estimarDiscoGb().then((discoEstimadoGb) => {
      if (!cancelado && discoEstimadoGb !== null) {
        setInfo((atual) => ({ ...atual, discoEstimadoGb, discoEstimadoOrigem: 'storage-estimate' }))
      }
    })

    benchmarkDiscoMbps(controller.signal).then((benchmarkMbps) => {
      if (cancelado) return
      setInfo((atual) => ({
        ...atual,
        benchmarkMbps,
        benchmarkEstado: benchmarkMbps === null ? 'indisponivel' : 'ok',
      }))
    })

    return () => {
      cancelado = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [ativo])

  return info
}
