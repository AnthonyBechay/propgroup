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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()
  
  const { pathname } = request.nextUrl
  
  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isSuperAdminRoute = pathname.startsWith('/admin/users/manage')
  const isPortalRoute = pathname.startsWith('/portal')
  const isAuthRoute = pathname.startsWith('/auth')
  
  // If accessing auth routes while logged in, redirect to appropriate dashboard
  if (isAuthRoute && user) {
    // Get user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userData) {
      // Redirect based on role
      if (userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  // Protect /portal/* routes - for regular users
  if (isPortalRoute) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Check if user is active and not banned
    const { data: userData } = await supabase
      .from('users')
      .select('is_active, banned_at')
      .eq('id', user.id)
      .single()
    
    if (userData && (!userData.is_active || userData.banned_at)) {
      return NextResponse.redirect(new URL('/auth/banned', request.url))
    }
  }

  // Protect /admin/* routes with role-based access
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Get user role and status from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, is_active, banned_at')
      .eq('id', user.id)
      .single()
    
    if (userError || !userData) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // Check if user is banned or inactive
    if (!userData.is_active || userData.banned_at) {
      return NextResponse.redirect(new URL('/auth/banned', request.url))
    }
    
    // Check if user is admin or super admin
    if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Check super admin specific routes
    if (isSuperAdminRoute && userData.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return supabaseResponse
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
