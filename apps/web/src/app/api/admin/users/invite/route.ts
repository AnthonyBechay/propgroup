import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/rbac'
import { inviteAdminUser } from '@/lib/admin/user-management'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await requireAdmin()
    if (user instanceof NextResponse) {
      return user // It's a redirect response
    }

    const formData = await request.formData()
    const email = formData.get('email') as string
    const role = formData.get('role') as 'ADMIN' | 'SUPER_ADMIN'

    if (!email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const success = await inviteAdminUser(email, role)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error inviting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
