import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie = request.cookies.get('better-auth.session')
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'

  if (isAdminRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdminRoute || isLoginRoute) {
    const session = await auth.api.getSession({ headers: request.headers })

    if (isAdminRoute && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isLoginRoute && session) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
