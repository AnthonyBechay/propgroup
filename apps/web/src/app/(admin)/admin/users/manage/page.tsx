import { getCurrentUser, requireSuperAdmin } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { UserManagementTable } from '@/components/admin/UserManagementTable'
import { InviteAdminModal } from '@/components/admin/InviteAdminModal'
import { Button } from '@/components/ui/button'
import { UserPlus, Shield, Activity } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function SuperAdminUsersPage() {
  // Check if user is super admin
  const currentUser = await getCurrentUser()
  
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    redirect('/unauthorized')
  }

  // Fetch all users with their details
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      bannedAt: true,
      bannedBy: true,
      bannedReason: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      _count: {
        select: {
          propertyInquiries: true,
          favoriteProperties: true,
          ownedProperties: true,
        }
      }
    },
    orderBy: [
      { role: 'desc' }, // Super admins first, then admins, then users
      { createdAt: 'desc' }
    ]
  })

  // Get admin activity stats
  const adminStats = await prisma.adminAuditLog.groupBy({
    by: ['adminId'],
    _count: {
      action: true
    },
    orderBy: {
      _count: {
        action: 'desc'
      }
    },
    take: 10
  })

  // Get recent admin actions
  const recentActions = await prisma.adminAuditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      admin: {
        select: {
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            User & Admin Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all users, admins, and their permissions. Only super admins can access this page.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <InviteAdminModal currentUserId={currentUser.id}>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Admin
            </Button>
          </InviteAdminModal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold">
            {users.filter(u => u.role === 'USER').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Admins</div>
          <div className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'ADMIN').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Super Admins</div>
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'SUPER_ADMIN').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Banned Users</div>
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => u.bannedAt).length}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Users</h2>
        </div>
        <UserManagementTable 
          users={users} 
          currentUserId={currentUser.id}
        />
      </div>

      {/* Recent Admin Activity */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Admin Activity
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActions.map((action) => (
                <tr key={action.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {action.admin.firstName} {action.admin.lastName || action.admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {action.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {action.targetType} {action.targetId && `(${action.targetId.slice(0, 8)}...)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(action.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
