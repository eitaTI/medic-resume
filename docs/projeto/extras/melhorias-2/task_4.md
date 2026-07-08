# Task 4: Criar Rota API `GET /api/uploads/[...path]` com Autenticação

❌ **Pendente**

Criar uma rota de API do Next.js que permita ao admin visualizar e baixar os arquivos enviados (logos, assinaturas, laudos) que estão armazenados em `data/uploads/`. A rota deve verificar autenticação e prevenir path traversal.

## O que fazer

### 1. Criar diretório e arquivo da rota

Criar `app/api/uploads/[...path]/route.ts`:

```typescript
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
  { params }: { params: Promise<{ path: string[] }> }
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

    // Resolver caminho absoluto e prevenir path traversal
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
```

### 2. Como usar no frontend

Com esta rota, o admin pode exibir/download dos arquivos usando o caminho relativo armazenado no banco:

```tsx
// Exemplo: exibir logo
const logoUrl = `/api/${clinica.logoPath}`
// Resultado: /api/data/uploads/1-minha-clinica/logo/123-a1b.png

// Exemplo: exibir assinatura
const assinaturaUrl = `/api/${medico.assinaturaPath}`

// Exemplo: link para download de laudo
<a href={`/api/${exame.laudoPath}`} target="_blank">Ver Laudo</a>
```

### 3. Mapeamento de MIME types

| Extensão | Content-Type |
|----------|-------------|
| `.png` | `image/png` |
| `.jpg` / `.jpeg` | `image/jpeg` |
| `.gif` | `image/gif` |
| `.webp` | `image/webp` |
| `.svg` | `image/svg+xml` |
| `.pdf` | `application/pdf` |
| outros | `application/octet-stream` |

## Critérios de aceite

- [ ] Rota `GET /api/uploads/[...path]` criada
- [ ] Autenticação verificada via `auth.api.getSession`
- [ ] Path traversal bloqueado (caminho deve estar dentro de `data/uploads/`)
- [ ] Content-Type correto baseado na extensão do arquivo
- [ ] Cache-Control configurado (`private, max-age=3600`)
- [ ] Retorna 401 se não autenticado
- [ ] Retorna 404 se arquivo não encontrado
- [ ] Build passa sem erros

## Observação

O prefixo `/api/` é adicionado porque os paths estão salvos como `data/uploads/...`. A URL final fica `/api/data/uploads/...`. Se preferir URLs mais limpas, os paths no banco poderiam ser salvos apenas como `uploads/...` e a rota trataria o prefixo. Isso pode ser refinado futuramente.

## Commit

```
feat(api): criar rota GET /api/uploads/[...path] com autenticação
```
