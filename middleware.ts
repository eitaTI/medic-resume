import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'
  const isUploadsRoute = pathname.startsWith('/api/uploads/')

  const sessionCookie = request.cookies.get('better-auth.session_token')

  if ((isAdminRoute || isUploadsRoute) && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/api/uploads/:path*'],
}
