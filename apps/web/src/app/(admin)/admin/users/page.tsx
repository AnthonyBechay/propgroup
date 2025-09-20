import { Suspense } from 'react'
import { requireAdmin } from '@/lib/auth/rbac'
import { getAllUsers, updateUserRole, toggleUserBan, deleteUser, inviteAdminUser } from '@/lib/admin/user-management'
import { Users, Plus, Shield, Ban, Trash2, Mail } from 'lucide-react'

export default async function AdminUsersPage() {
  await requireAdmin()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user roles, permissions, and account status</p>
        </div>

        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  )
}

async function UsersTable() {
  const users = await getAllUsers()
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          <InviteUserButton />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserRow({ user }: { user: any }) {
  const roleColors = {
    USER: 'bg-gray-100 text-gray-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    SUPER_ADMIN: 'bg-purple-100 text-purple-800'
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    banned: 'bg-red-100 text-red-800',
    inactive: 'bg-yellow-100 text-yellow-800'
  }

  const getStatus = () => {
    if (user.bannedAt) return 'banned'
    if (!user.isActive) return 'inactive'
    return 'active'
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.email}</div>
            <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
          {user.role}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[getStatus()]}`}>
          {getStatus()}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <RoleSelectButton userId={user.id} currentRole={user.role} />
          <BanButton userId={user.id} isBanned={!!user.bannedAt} />
          <DeleteButton userId={user.id} email={user.email} />
        </div>
      </td>
    </tr>
  )
}

function RoleSelectButton({ userId, currentRole }: { userId: string, currentRole: string }) {
  const handleRoleChange = async (newRole: string) => {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('role', newRole)
    
    const response = await fetch('/api/admin/users/update-role', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      window.location.reload()
    }
  }

  return (
    <select
      value={currentRole}
      onChange={(e) => handleRoleChange(e.target.value)}
      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="USER">User</option>
      <option value="ADMIN">Admin</option>
      <option value="SUPER_ADMIN">Super Admin</option>
    </select>
  )
}

function BanButton({ userId, isBanned }: { userId: string, isBanned: boolean }) {
  const handleToggleBan = async () => {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('ban', (!isBanned).toString())
    
    const response = await fetch('/api/admin/users/toggle-ban', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      window.location.reload()
    }
  }

  return (
    <button
      onClick={handleToggleBan}
      className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${
        isBanned 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      }`}
    >
      {isBanned ? <Shield className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
      <span>{isBanned ? 'Unban' : 'Ban'}</span>
    </button>
  )
}

function DeleteButton({ userId, email }: { userId: string, email: string }) {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return
    }
    
    const formData = new FormData()
    formData.append('userId', userId)
    
    const response = await fetch('/api/admin/users/delete', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      window.location.reload()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center space-x-1"
    >
      <Trash2 className="h-3 w-3" />
      <span>Delete</span>
    </button>
  )
}

function InviteUserButton() {
  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const response = await fetch('/api/admin/users/invite', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      window.location.reload()
    }
  }

  return (
    <form onSubmit={handleInvite} className="flex space-x-2">
      <input
        type="email"
        name="email"
        placeholder="admin@example.com"
        required
        className="text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="role"
        className="text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="ADMIN">Admin</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>
      <button
        type="submit"
        className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
      >
        <Mail className="h-4 w-4" />
        <span>Invite</span>
      </button>
    </form>
  )
}

function UsersTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}