import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/rbac'
import { toggleUserBan } from '@/lib/admin/user-management'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await requireAdmin()
    if (user instanceof NextResponse) {
      return user // It's a redirect response
    }

    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const ban = formData.get('ban') === 'true'
    const reason = formData.get('reason') as string

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    const success = await toggleUserBan(userId, ban, reason)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update user ban status' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error toggling user ban:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
