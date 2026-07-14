import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 })
    }

    const { path: segments } = await params
    if (!segments || segments.length === 0) {
      return NextResponse.json({ erro: 'Caminho inválido' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'data', 'uploads', ...segments)
    const resolvedPath = path.resolve(filePath)
    const allowedBase = path.resolve(process.cwd(), 'data', 'uploads')

    if (!resolvedPath.startsWith(allowedBase)) {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 })
    }

    const ext = path.extname(resolvedPath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    const buffer = await readFile(resolvedPath)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename="${path.basename(resolvedPath)}"`,
      },
    })
  } catch {
    return NextResponse.json({ erro: 'Arquivo não encontrado' }, { status: 404 })
  }
}
