import fs from 'node:fs'
import path from 'node:path'

// Server-only: resolve branding assets from data/branding (overrides) first,
// then public/branding (defaults). Assets are served via /api/branding route.

const OVERRIDE_DIR = path.join(process.cwd(), 'data', 'branding')
const DEFAULT_DIR = path.join(process.cwd(), 'public', 'branding')

function findFile(dir: string, name: string): string | null {
  try {
    const files = fs.readdirSync(dir)
    const hit = files.find((f) => f.replace(/\.[^.]+$/, '') === name)
    return hit ?? null
  } catch {
    return null
  }
}

function resolve(name: string): string {
  const overrideFile = findFile(OVERRIDE_DIR, name)
  const defaultFile = findFile(DEFAULT_DIR, name)
  const file = overrideFile ?? defaultFile
  const dir = overrideFile ? OVERRIDE_DIR : DEFAULT_DIR

  if (!file) return `/api/branding/${name}.png`

  let version = ''
  try {
    const mtime = Math.floor(fs.statSync(path.join(dir, file)).mtimeMs)
    version = `${mtime}`
  } catch {
    version = ''
  }

  return version ? `/api/branding/v${version}/${file}` : `/api/branding/${file}`
}

export interface Branding {
  logoLight: string
  logoDark: string
  wallpaperLight: string
  wallpaperDark: string
  iconLight: string
  iconDark: string
}

export function getBranding(): Branding {
  return {
    logoLight: resolve('eitati-logo-light'),
    logoDark: resolve('eitati-logo-dark'),
    wallpaperLight: `url('${resolve('eitati-light-wallpaper')}')`,
    wallpaperDark: `url('${resolve('eitati-dark-wallpaper')}')`,
    iconLight: resolve('eitati-icon-light'),
    iconDark: resolve('eitati-icon-dark'),
  }
}
