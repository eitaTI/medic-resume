'use client'

import { useEffect, useRef } from 'react'
import type { UseFormWatch, UseFormReset } from 'react-hook-form'
import type { FormularioValues } from '@/lib/validacoes'

const DRAFT_KEY = 'medic-resume-draft'

export function useDraftPersistence(watch: UseFormWatch<FormularioValues>, reset: UseFormReset<FormularioValues>) {
  const restored = useRef(false)

  useEffect(() => {
    if (restored.current) return
    restored.current = true

    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return

      const draft = JSON.parse(raw)
      if (!draft || typeof draft !== 'object') return

      const hasData = Object.values(draft).some((v) => {
        if (Array.isArray(v)) return v.length > 0 && v.some((item) => Object.values(item).some((val) => val))
        return v && v !== ''
      })
      if (hasData) reset(draft)
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [reset])

  useEffect(() => {
    const subscription = watch((values) => {
      try {
        const { logo: _, ...rest } = values as Record<string, unknown>
        if (rest.usuarios) {
          rest.usuarios = (rest.usuarios as Record<string, unknown>[]).map((u) => {
            const { assinatura: _a, ...usuario } = u
            return usuario
          })
        }
        if (rest.exames) {
          rest.exames = (rest.exames as Record<string, unknown>[]).map((e) => {
            const { laudo: _l, ...exame } = e
            return exame
          })
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
      } catch {
        /* ignore */
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  return {
    limparRascunho: () => localStorage.removeItem(DRAFT_KEY),
  }
}
