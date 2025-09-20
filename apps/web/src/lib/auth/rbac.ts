import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  isActive: boolean
  bannedAt?: Date | null
  emailVerifiedAt?: Date | null
}

/**
 * Get the current authenticated user with role information from Supabase metadata
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    // Get user role from Supabase user metadata
    const userRole = user.user_metadata?.role || 'USER'
    const isActive = user.user_metadata?.is_active !== false // Default to true
    const bannedAt = user.user_metadata?.banned_at ? new Date(user.user_metadata.banned_at) : null
    
    return {
      id: user.id,
      email: user.email || '',
      role: userRole as UserRole,
      isActive,
      bannedAt,
      emailVerifiedAt: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if the current user has admin privileges
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null && 
         (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && 
         user.isActive && 
         !user.bannedAt
}

/**
 * Check if the current user is a super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null && 
         user.role === 'SUPER_ADMIN' && 
         user.isActive && 
         !user.bannedAt
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/') {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.redirect(new URL(`/auth/login?next=${encodeURIComponent(redirectTo)}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
  
  if (!user.isActive || user.bannedAt) {
    return NextResponse.redirect(new URL('/auth/banned', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
  
  return user
}

/**
 * Require admin role - redirects to unauthorized if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth('/admin')
  
  if (user instanceof NextResponse) {
    return user // It's a redirect response
  }
  
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
  
  return user
}

/**
 * Require super admin role - redirects to unauthorized if not super admin
 */
export async function requireSuperAdmin() {
  const user = await requireAuth('/admin')
  
  if (user instanceof NextResponse) {
    return user // It's a redirect response
  }
  
  if (user.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
  
  return user
}

/**
 * Log admin action to audit log
 */
export async function logAdminAction(
  action: string,
  targetType?: string,
  targetId?: string,
  details?: any,
  request?: NextRequest
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized to log admin action')
    }
    
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const auditLog = {
      admin_id: user.id,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip'),
      user_agent: request?.headers.get('user-agent'),
    }
    
    const { error } = await supabase
      .from('admin_audit_logs')
      .insert(auditLog)
    
    if (error) {
      console.error('Failed to log admin action:', error)
    }
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId)
  } catch (error) {
    console.error('Error updating last login:', error)
  }
}
