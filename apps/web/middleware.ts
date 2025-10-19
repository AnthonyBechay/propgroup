import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware simplified - auth is now handled client-side via AuthContext
  // Protected routes will check auth status on the client side
  // This middleware can be enhanced later with JWT verification if needed

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
