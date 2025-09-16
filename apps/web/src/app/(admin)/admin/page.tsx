import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { 
  Building2, 
  Users, 
  Heart, 
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react'

export default async function AdminDashboard() {
  // Get the authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Not authenticated</div>
  }

  // Fetch dashboard statistics
  const [
    totalProperties,
    totalUsers,
    totalFavorites,
    totalInquiries,
    recentProperties,
    recentUsers
  ] = await Promise.all([
    prisma.property.count(),
    prisma.user.count(),
    prisma.favoriteProperty.count(),
    prisma.propertyInquiry.count(),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        developer: true,
        investmentData: true
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  const stats = [
    {
      name: 'Total Properties',
      value: totalProperties,
      icon: Building2,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Users',
      value: totalUsers,
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Favorites',
      value: totalFavorites,
      icon: Heart,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      name: 'Inquiries',
      value: totalInquiries,
      icon: FileText,
      change: '+23%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Properties */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Properties</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentProperties.map((property: any) => (
                  <li key={property.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {property.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property.country} • {property.currency} {property.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentUsers.map((user: any) => (
                  <li key={user.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
