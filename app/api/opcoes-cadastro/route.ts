import { NextResponse } from 'next/server'
import { getVendedores, getTiposProcesso, getRequisitosPc } from '@/lib/listas'

/** Listas dinâmicas do formulário (vendedores + tipos de processo + requisitos de PC, via env). */
export async function GET() {
  return NextResponse.json({
    vendedores: getVendedores(),
    tiposProcesso: getTiposProcesso(),
    requisitosPc: getRequisitosPc(),
  })
}
