import { NextResponse } from 'next/server'
import { getVendedores, getTiposProcesso } from '@/lib/listas'

/** Listas dinâmicas do formulário (vendedores + tipos de processo, via env). */
export async function GET() {
  return NextResponse.json({
    vendedores: getVendedores(),
    tiposProcesso: getTiposProcesso(),
  })
}
