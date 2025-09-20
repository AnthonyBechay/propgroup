import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export interface AdminUser {
  id: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isActive: boolean
  bannedAt?: string | null
  emailVerifiedAt?: string | null
  createdAt: string
  lastLoginAt?: string | null
}

/**
 * Get all users for admin management
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const adminSupabase = createAdminClient()
    
    const { data: { users }, error } = await adminSupabase.auth.admin.listUsers()
    
    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
    
    return users.map(user => ({
      id: user.id,
      email: user.email || '',
      role: (user.user_metadata?.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN') || 'USER',
      isActive: user.user_metadata?.is_active !== false,
      bannedAt: user.user_metadata?.banned_at || null,
      emailVerifiedAt: user.email_confirmed_at || null,
      createdAt: user.created_at,
      lastLoginAt: user.last_sign_in_at || null,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient()
    
    const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })
    
    if (error) {
      console.error('Error updating user role:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error updating user role:', error)
    return false
  }
}

/**
 * Ban/unban user
 */
export async function toggleUserBan(userId: string, ban: boolean, reason?: string): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient()
    
    const userMetadata = {
      is_active: !ban,
      banned_at: ban ? new Date().toISOString() : null,
      banned_reason: ban ? reason : null
    }
    
    const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
      user_metadata: userMetadata
    })
    
    if (error) {
      console.error('Error updating user ban status:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error updating user ban status:', error)
    return false
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient()
    
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)
    
    if (error) {
      console.error('Error deleting user:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}

/**
 * Create admin user (invite)
 */
export async function inviteAdminUser(email: string, role: 'ADMIN' | 'SUPER_ADMIN'): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient()
    
    const { error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role,
        is_active: true,
        invited_by: (await getCurrentUser())?.id
      }
    })
    
    if (error) {
      console.error('Error inviting admin user:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error inviting admin user:', error)
    return false
  }
}

/**
 * Get current user (helper function)
 */
async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    return null
  }
}
