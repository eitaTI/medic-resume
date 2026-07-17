import { NextResponse } from 'next/server'
import { readFile, stat, writeFile, mkdir, unlink, readdir } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'
import { registrarAcao } from '@/lib/audit'

const BRAND_DIR = path.join(process.cwd(), 'data', 'branding')
const DEFAULT_DIR = path.join(process.cwd(), 'public', 'branding')

const SLOTS: Record<string, string> = {
  'logo-light': 'eitati-logo-light.png',
  'logo-dark': 'eitati-logo-dark.png',
  'wallpaper-light': 'eitati-light-wallpaper.png',
  'wallpaper-dark': 'eitati-dark-wallpaper.png',
  'icon-light': 'eitati-icon-light.png',
  'icon-dark': 'eitati-icon-dark.png',
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

function parseMultipart(buffer: Buffer, boundary: string) {
  const boundaryBuf = Buffer.from(`--${boundary}`)
  const parts: Buffer[] = []
  let pos = 0

  while (pos < buffer.length) {
    const start = buffer.indexOf(boundaryBuf, pos)
    if (start === -1) break
    const nextPart = buffer.indexOf(boundaryBuf, start + boundaryBuf.length)
    if (nextPart === -1) break
    parts.push(buffer.subarray(start + boundaryBuf.length, nextPart))
    pos = nextPart
  }

  let slot = ''
  let fileBuffer: Buffer | null = null
  let fileName = ''
  let fileType = ''

  for (const part of parts) {
    const headerEnd = part.indexOf('\r\n\r\n')
    if (headerEnd === -1) continue
    const header = part.subarray(0, headerEnd).toString()
    const body = part.subarray(headerEnd + 4, part.length - 2)

    const nameMatch = header.match(/name="([^"]+)"/)
    if (!nameMatch) continue
    const name = nameMatch[1]

    if (name === 'slot') {
      slot = body.toString().trim()
    } else if (name === 'arquivo') {
      const fnMatch = header.match(/filename="([^"]+)"/)
      if (fnMatch) fileName = fnMatch[1]
      const ctMatch = header.match(/Content-Type:\s*(\S+)/i)
      if (ctMatch) fileType = ctMatch[1]
      fileBuffer = body
    }
  }

  if (!slot || !fileBuffer || !fileName) return null
  return { slot, file: fileBuffer, fileName, fileType }
}

// POST /api/branding/upload — upload a branding asset
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''
    const boundaryMatch = contentType.match(/boundary=(.+)/)
    if (!boundaryMatch) {
      return NextResponse.json({ erro: 'Requisição inválida' }, { status: 400 })
    }

    const arrayBuffer = await request.arrayBuffer()
    const body = Buffer.from(arrayBuffer)

    if (body.length > MAX_SIZE) {
      return NextResponse.json({ erro: 'Arquivo excede o limite de 5 MB.' }, { status: 413 })
    }

    const parsed = parseMultipart(body, boundaryMatch[1])
    if (!parsed) {
      return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400 })
    }

    const { slot, file, fileType } = parsed

    if (!SLOTS[slot]) {
      return NextResponse.json({ erro: 'Slot de branding inválido' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ erro: 'Tipo não suportado. Use PNG, JPEG ou WebP.' }, { status: 400 })
    }

    await mkdir(BRAND_DIR, { recursive: true })
    const filePath = path.join(BRAND_DIR, SLOTS[slot])
    await writeFile(filePath, file)

    await registrarAcao({
      userId: session.user.id,
      acao: 'ATUALIZAR',
      entidade: 'Branding',
      entidadeId: null,
      detalhes: { slot, arquivo: SLOTS[slot] },
    })

    return NextResponse.json({ sucesso: true })
  } catch {
    return NextResponse.json({ erro: 'Erro interno ao salvar.' }, { status: 500 })
  }
}

// GET /api/branding/[...path] — serve a branding asset
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  if (!segments || segments.length === 0) {
    return NextResponse.json({ erro: 'Caminho inválido' }, { status: 400 })
  }

  const fileName = segments[segments.length - 1]

  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return NextResponse.json({ erro: 'Caminho inválido' }, { status: 400 })
  }

  const ext = path.extname(fileName).toLowerCase()
  if (!MIME_TYPES[ext]) {
    return NextResponse.json({ erro: 'Tipo de arquivo não suportado' }, { status: 400 })
  }

  const ct = MIME_TYPES[ext]

  // Try override (data/branding) first, then default (public/branding)
  try {
    const resolved = path.resolve(path.join(BRAND_DIR, fileName))
    if (!resolved.startsWith(path.resolve(BRAND_DIR))) {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 })
    }
    await stat(resolved)
    const buffer = await readFile(resolved)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    })
  } catch {
    // fall through
  }

  try {
    const resolved = path.resolve(path.join(DEFAULT_DIR, fileName))
    if (!resolved.startsWith(path.resolve(DEFAULT_DIR))) {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 })
    }
    await stat(resolved)
    const buffer = await readFile(resolved)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    })
  } catch {
    return NextResponse.json({ erro: 'Arquivo não encontrado' }, { status: 404 })
  }
}

// DELETE /api/branding/[...path] — reset branding slot(s)
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
    }

    const { slot } = await request.json()

    if (slot) {
      if (!SLOTS[slot]) {
        return NextResponse.json({ erro: 'Slot inválido' }, { status: 400 })
      }
      try {
        await unlink(path.join(BRAND_DIR, SLOTS[slot]))
      } catch {
        return NextResponse.json({ erro: 'Este slot já está usando o padrão.' }, { status: 404 })
      }
      await registrarAcao({
        userId: session.user.id,
        acao: 'RESTAURAR',
        entidade: 'Branding',
        entidadeId: null,
        detalhes: { slot, arquivo: SLOTS[slot] },
      })
      return NextResponse.json({ sucesso: true })
    }

    // Reset all
    try {
      const files = await readdir(BRAND_DIR)
      for (const file of files) {
        await unlink(path.join(BRAND_DIR, file))
      }
    } catch {
      // dir might not exist
    }
    await registrarAcao({
      userId: session.user.id,
      acao: 'RESTAURAR',
      entidade: 'Branding',
      entidadeId: null,
      detalhes: { todos: true },
    })
    return NextResponse.json({ sucesso: true })
  } catch {
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 })
  }
}
