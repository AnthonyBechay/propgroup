import { getCurrentUser, requireAdmin } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react'

export default async function AnalyticsPage() {
  // Check if user is admin
  const currentUser = await getCurrentUser()
  
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized')
  }

  // Fetch analytics data
  const [
    totalProperties,
    propertiesByCountry,
    propertiesByStatus,
    userGrowth,
    inquiriesByMonth,
    topProperties
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.groupBy({
      by: ['country'],
      _count: true,
    }),
    prisma.property.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.user.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
      take: 30
    }),
    prisma.propertyInquiry.findMany({
      select: { createdAt: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: {
        favoriteProperties: {
          _count: 'desc'
        }
      },
      include: {
        _count: {
          select: {
            favoriteProperties: true,
            propertyInquiries: true
          }
        }
      }
    })
  ])

  // Calculate growth rate
  const lastMonthUsers = userGrowth.filter(u => 
    u.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length
  const previousMonthUsers = userGrowth.filter(u => 
    u.createdAt > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) &&
    u.createdAt <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length
  const growthRate = previousMonthUsers > 0 
    ? ((lastMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
    : '100'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Track your platform's performance and user engagement metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Properties
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {totalProperties}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    User Growth
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    +{growthRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Monthly Inquiries
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {inquiriesByMonth.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg. Engagement
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {topProperties.length > 0 
                      ? Math.round(topProperties.reduce((acc, p) => acc + p._count.propertyInquiries, 0) / topProperties.length)
                      : 0
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Properties by Country */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Properties by Country
          </h3>
          <div className="space-y-3">
            {propertiesByCountry.map((item) => (
              <div key={item.country} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.country}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(item._count / totalProperties * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-900 font-medium w-12 text-right">
                    {item._count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Properties by Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Properties by Status
          </h3>
          <div className="space-y-3">
            {propertiesByStatus.map((item) => {
              const statusColors = {
                'OFF_PLAN': 'bg-yellow-600',
                'NEW_BUILD': 'bg-green-600',
                'RESALE': 'bg-purple-600'
              }
              return (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{item.status.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${statusColors[item.status as keyof typeof statusColors]} h-2 rounded-full`}
                        style={{ 
                          width: `${(item._count / totalProperties * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 font-medium w-12 text-right">
                      {item._count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Properties */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Properties
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Favorites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property._count.favoriteProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property._count.propertyInquiries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${property.status === 'OFF_PLAN' ? 'bg-yellow-100 text-yellow-800' : 
                          property.status === 'NEW_BUILD' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
