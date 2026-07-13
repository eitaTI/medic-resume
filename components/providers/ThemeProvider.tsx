'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useBranding } from '@/components/providers/BrandingProvider'
import type { Branding } from '@/lib/branding'

type Tema = 'claro' | 'escuro'

interface ThemeContextValue {
  tema: Tema
  alternarTema: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const CHAVE = 'medic-resume-tema'

function getTema(): Tema {
  if (typeof window === 'undefined') return 'claro'
  const salvo = localStorage.getItem(CHAVE)
  if (salvo === 'claro' || salvo === 'escuro') return salvo
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

function apply(tema: Tema, branding: Branding) {
  const root = document.documentElement
  if (tema === 'escuro') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  const href = tema === 'escuro' ? branding.iconDark : branding.iconLight
  const fav = document.getElementById('favicon') as HTMLLinkElement | null
  if (fav) fav.href = href
  const apple = document.getElementById('favicon-apple') as HTMLLinkElement | null
  if (apple) apple.href = href
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const branding = useBranding()
  const [tema, setTema] = useState<Tema>('claro')

  useEffect(() => {
    const t = getTema()
    setTema(t)
    apply(t, branding)
  }, [])

  const alternarTema = () => {
    setTema((prev) => {
      const next = prev === 'claro' ? 'escuro' : 'claro'
      apply(next, branding)
      localStorage.setItem(CHAVE, next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve estar dentro de ThemeProvider')
  return ctx
}