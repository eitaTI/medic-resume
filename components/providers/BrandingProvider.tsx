'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Branding } from '@/lib/branding'

const BrandingContext = createContext<Branding | null>(null)

export function BrandingProvider({
  value,
  children,
}: {
  value: Branding
  children: ReactNode
}) {
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
}

export function useBranding(): Branding {
  const ctx = useContext(BrandingContext)
  if (!ctx) throw new Error('useBranding deve estar dentro de BrandingProvider')
  return ctx
}
