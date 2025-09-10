import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Try to get the user, but handle refresh token errors gracefully
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle refresh token errors silently
    if (error && (
      error.message?.includes('refresh_token_not_found') || 
      error.message?.includes('Invalid Refresh Token') ||
      error.message?.includes('Refresh Token Not Found')
    )) {
      // Clear invalid auth cookies
      const response = NextResponse.next()
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
      
      // Only redirect if trying to access protected routes
      const protectedPaths = ['/portal', '/admin']
      const isProtectedPath = protectedPaths.some(path => 
        request.nextUrl.pathname.startsWith(path)
      )
      
      if (isProtectedPath) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
      }
      
      return response
    }

    // Check protected routes
    const protectedPaths = ['/portal', '/admin']
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('auth', 'required')
      return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
  } catch (e) {
    // Handle any unexpected errors silently
    console.error('Middleware error:', e)
    return supabaseResponse
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
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
