import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/admin/UserTable'

export default async function AdminUsersPage() {
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

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage user accounts and their roles. View user activity and engagement.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <UserTable users={users} />
      </div>
    </div>
  )
}
