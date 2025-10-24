import { getAllUsers } from '@/lib/admin/user-management'
import { UsersManagementClient } from '@/components/admin/UsersManagementClient'
import { User } from '@/lib/types/api'

export default async function AdminUsersPage() {
  // Layout already handles authentication
  let users: any[] = []

  try {
    users = await getAllUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
    // Return empty array if fetching users fails
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user roles, permissions, and account status</p>
        </div>

        <UsersManagementClient users={users} />
      </div>
    </div>
  )
}
