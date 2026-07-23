export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getBranding } from '@/lib/branding'

export async function GET() {
  const branding = getBranding()
  return NextResponse.json(branding)
}