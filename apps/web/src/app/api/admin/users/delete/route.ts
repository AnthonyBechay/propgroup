import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/rbac'
import { deleteUser } from '@/lib/admin/user-management'

export async function POST(request: NextRequest) {
  try {
    // Check if user is super admin (only super admins can delete users)
    const user = await requireSuperAdmin()
    if (user instanceof NextResponse) {
      return user // It's a redirect response
    }

    const formData = await request.formData()
    const userId = formData.get('userId') as string

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    const success = await deleteUser(userId)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
