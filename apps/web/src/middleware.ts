import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Check for JWT token in cookies
    const token = request.cookies.get('token')?.value

    // Check protected routes
    const protectedPaths = ['/portal', '/admin']
    const isProtectedPath = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Special handling for login page - prevent redirect loop
    const isLoginPage = request.nextUrl.pathname.startsWith('/auth/login')

    if (isProtectedPath) {
      if (!token) {
        // No token, redirect to login with next parameter
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/auth/login'
        redirectUrl.searchParams.set('next', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Token exists, let the request continue
      // The actual token validation will happen in the API routes and layouts
      return NextResponse.next()
    }

    // If user has a token and tries to visit login, allow it
    // The login page itself will handle the redirect
    if (isLoginPage && token) {
      // Let the login page handle the redirect based on user role
      return NextResponse.next()
    }

    return NextResponse.next()
  } catch (e) {
    // Handle any unexpected errors
    console.error('[Middleware] Error:', e)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled by backend)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}