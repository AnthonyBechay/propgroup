import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiClient } from '@/lib/api/client'

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
 * Get the current authenticated user with role information from JWT token
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await apiClient.getCurrentUser()
    
    if (response.success && response.user) {
      return {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        isActive: response.user.isActive,
        bannedAt: response.user.bannedAt,
        emailVerifiedAt: response.user.emailVerifiedAt,
      }
    }
    
    return null
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
    
    // The audit logging is now handled by the backend middleware
    // This function is kept for compatibility but doesn't need to do anything
    // as the backend automatically logs admin actions
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string) {
  try {
    // The last login is now automatically updated by the backend
    // when users log in through the /api/auth/login endpoint
    // This function is kept for compatibility
  } catch (error) {
    console.error('Error updating last login:', error)
  }
}
