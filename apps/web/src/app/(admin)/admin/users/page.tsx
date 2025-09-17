import { getCurrentUser } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/admin/UserTable'
import { Shield, Users as UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminUsersPage() {
  // Check if user is admin
  const currentUser = await getCurrentUser()
  
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized')
  }

  // Fetch all users with their statistics
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          favoriteProperties: true,
          propertyInquiries: true,
          ownedProperties: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Count users by role
  const roleStats = {
    total: users.length,
    users: users.filter(u => u.role === 'USER').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length,
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="h-6 w-6" />
            Users Overview
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View all platform users and their activity. 
            {currentUser.role === 'SUPER_ADMIN' && (
              <span> You can manage users in the dedicated management panel.</span>
            )}
          </p>
        </div>
        {currentUser.role === 'SUPER_ADMIN' && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link href="/admin/users/manage">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Shield className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Users
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {roleStats.total}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Regular Users
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">
              {roleStats.users}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Admins
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-orange-600">
              {roleStats.admins}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Super Admins
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-purple-600">
              {roleStats.superAdmins}
            </dd>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div>
        <UserTable users={users} />
      </div>

      {/* Admin Note */}
      {currentUser.role === 'ADMIN' && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Limited Access
          </h3>
          <p className="text-sm text-blue-700">
            As an admin, you can view user information but cannot modify user roles or ban users. 
            Contact a super admin for user management tasks.
          </p>
        </div>
      )}
    </div>
  )
}
