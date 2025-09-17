'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser, isSuperAdmin, logAdminAction } from '@/lib/auth/rbac'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@/lib/auth/rbac'

export async function updateUserRole(userId: string, newRole: UserRole) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Only super admins can update user roles')
  }
  
  if (currentUser.id === userId) {
    throw new Error('You cannot change your own role')
  }
  
  try {
    // Get the target user's current role
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    })
    
    if (!targetUser) {
      throw new Error('User not found')
    }
    
    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })
    
    // Log the action
    await logAdminAction(
      'UPDATE_ROLE',
      'user',
      userId,
      {
        oldRole: targetUser.role,
        newRole: newRole,
        userEmail: targetUser.email
      }
    )
    
    revalidatePath('/admin/users/manage')
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }
}

export async function banUser(userId: string, reason: string) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized: Only admins can ban users')
  }
  
  if (currentUser.id === userId) {
    throw new Error('You cannot ban yourself')
  }
  
  try {
    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    })
    
    if (!targetUser) {
      throw new Error('User not found')
    }
    
    // Only super admins can ban other admins
    if ((targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN') && currentUser.role !== 'SUPER_ADMIN') {
      throw new Error('Only super admins can ban other admins')
    }
    
    // Ban the user
    const bannedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        bannedAt: new Date(),
        bannedBy: currentUser.id,
        bannedReason: reason
      }
    })
    
    // Log the action
    await logAdminAction(
      'BAN_USER',
      'user',
      userId,
      {
        reason: reason,
        userEmail: targetUser.email,
        userRole: targetUser.role
      }
    )
    
    revalidatePath('/admin/users')
    revalidatePath('/admin/users/manage')
    return { success: true, user: bannedUser }
  } catch (error) {
    console.error('Error banning user:', error)
    throw new Error('Failed to ban user')
  }
}

export async function unbanUser(userId: string) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized: Only admins can unban users')
  }
  
  try {
    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true, bannedReason: true }
    })
    
    if (!targetUser) {
      throw new Error('User not found')
    }
    
    // Only super admins can unban other admins
    if ((targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN') && currentUser.role !== 'SUPER_ADMIN') {
      throw new Error('Only super admins can unban other admins')
    }
    
    // Unban the user
    const unbannedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        bannedAt: null,
        bannedBy: null,
        bannedReason: null
      }
    })
    
    // Log the action
    await logAdminAction(
      'UNBAN_USER',
      'user',
      userId,
      {
        previousBanReason: targetUser.bannedReason,
        userEmail: targetUser.email,
        userRole: targetUser.role
      }
    )
    
    revalidatePath('/admin/users')
    revalidatePath('/admin/users/manage')
    return { success: true, user: unbannedUser }
  } catch (error) {
    console.error('Error unbanning user:', error)
    throw new Error('Failed to unban user')
  }
}

export async function deleteUser(userId: string) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Only super admins can delete users')
  }
  
  if (currentUser.id === userId) {
    throw new Error('You cannot delete yourself')
  }
  
  try {
    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    })
    
    if (!targetUser) {
      throw new Error('User not found')
    }
    
    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    })
    
    // Log the action
    await logAdminAction(
      'DELETE_USER',
      'user',
      userId,
      {
        userEmail: targetUser.email,
        userRole: targetUser.role
      }
    )
    
    revalidatePath('/admin/users')
    revalidatePath('/admin/users/manage')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }
}

export async function inviteAdmin(email: string, role: 'ADMIN' | 'SUPER_ADMIN') {
  const currentUser = await getCurrentUser()
  
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Only super admins can invite other admins')
  }
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })
    
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    // Create user with admin role (they'll need to set password on first login)
    const newAdmin = await prisma.user.create({
      data: {
        email,
        role,
        invitedBy: currentUser.id,
        isActive: true
      }
    })
    
    // Log the action
    await logAdminAction(
      'INVITE_ADMIN',
      'user',
      newAdmin.id,
      {
        email,
        role,
        invitedBy: currentUser.email
      }
    )
    
    // TODO: Send invitation email with magic link
    // await sendAdminInvitationEmail(email, role)
    
    revalidatePath('/admin/users/manage')
    return { success: true, user: newAdmin }
  } catch (error) {
    console.error('Error inviting admin:', error)
    throw new Error('Failed to invite admin')
  }
}
