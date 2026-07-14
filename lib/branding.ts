import fs from 'node:fs'
import path from 'node:path'

// Server-only: lê a pasta public/branding em runtime. Trocar a marca = apenas
// substituir os arquivos (ex.: eitati-logo-light.png) sem mexer no código.

const BRANDING_DIR = path.join(process.cwd(), 'public', 'branding')

function resolve(name: string): string {
  try {
    const files = fs.readdirSync(BRANDING_DIR)
    const hit = files.find((f) => f.replace(/\.[^.]+$/, '') === name)
    const file = hit ? hit : `${name}.png`
    let version = ''
    try {
      const mtime = Math.floor(fs.statSync(path.join(BRANDING_DIR, file)).mtimeMs)
      version = `?v=${mtime}`
    } catch {
      version = ''
    }
    return `/branding/${file}${version}`
  } catch {
    return `/branding/${name}.png`
  }
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
