'use server'

import fs from 'node:fs/promises'
import path from 'node:path'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { registrarAcao } from '@/lib/audit'

const BRAND_DIR = path.join(process.cwd(), 'data', 'branding')

const SLOTS: Record<string, string> = {
  'logo-light': 'eitati-logo-light.png',
  'logo-dark': 'eitati-logo-dark.png',
  'wallpaper-light': 'eitati-light-wallpaper.png',
  'wallpaper-dark': 'eitati-dark-wallpaper.png',
  'icon-light': 'eitati-icon-light.png',
  'icon-dark': 'eitati-icon-dark.png',
}

async function obterSessaoAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  return session
}

export async function restaurarBrandingSlot(slot: string) {
  const session = await obterSessaoAdmin()
  if (!session) return { erro: 'Não autenticado' }

  if (!SLOTS[slot]) {
    return { erro: 'Slot de branding inválido' }
  }

  try {
    const filePath = path.join(BRAND_DIR, SLOTS[slot])
    await fs.unlink(filePath)

    await registrarAcao({
      userId: session.user.id,
      acao: 'RESTAURAR',
      entidade: 'Branding',
      entidadeId: null,
      detalhes: { slot, arquivo: SLOTS[slot] },
    })

    return { sucesso: true }
  } catch {
    return { erro: 'Este slot já está usando o padrão de fábrica.' }
  }
}

export async function restaurarBrandingPadrao() {
  const session = await obterSessaoAdmin()
  if (!session) return { erro: 'Não autenticado' }

  try {
    const files = await fs.readdir(BRAND_DIR)
    for (const file of files) {
      await fs.unlink(path.join(BRAND_DIR, file))
    }

    await registrarAcao({
      userId: session.user.id,
      acao: 'RESTAURAR',
      entidade: 'Branding',
      entidadeId: null,
      detalhes: { todos: true },
    })

    return { sucesso: true }
  } catch {
    return { erro: 'Erro ao restaurar branding padrão.' }
  }
}
