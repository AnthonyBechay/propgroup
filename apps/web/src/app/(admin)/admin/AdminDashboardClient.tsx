'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import {
  Building2,
  Users,
  Heart,
  FileText,
  Shield,
} from 'lucide-react'
import { SeedDataButton } from '@/components/admin/SeedDataButton'

interface DashboardStats {
  totalProperties: number
  totalUsers: number
  totalFavorites: number
  totalInquiries: number
}

interface Property {
  id: string
  title: string
  country: string
  currency: string
  price: number
  createdAt: string
}

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
}

export function AdminDashboardClient() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentProperties(data.recentProperties)
          setRecentUsers(data.recentUsers)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  const statItems = [
    {
      name: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Favorites',
      value: stats?.totalFavorites || 0,
      icon: Heart,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      name: 'Inquiries',
      value: stats?.totalInquiries || 0,
      icon: FileText,
      change: '+23%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <SeedDataButton />
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${user?.role === 'SUPER_ADMIN'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'}`}>
              <Shield className="h-4 w-4 mr-1" />
              {user?.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statItems.map((item) => (
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
                {recentProperties.map((property) => (
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
                {recentUsers.map((user) => (
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
