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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <SeedDataButton />
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-md
              ${user?.role === 'SUPER_ADMIN'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}>
              <Shield className="h-4 w-4 mr-2" />
              {user?.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Updated with gradient theme */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statItems.map((item, index) => {
          const gradients = [
            'from-cyan-500 to-blue-600',
            'from-green-500 to-emerald-600',
            'from-purple-500 to-pink-600',
            'from-orange-500 to-red-600'
          ]
          return (
            <div key={item.name} className="bg-white border-2 border-slate-100 overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index]} rounded-xl flex items-center justify-center shadow-md`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className={`flex items-baseline text-sm font-bold px-3 py-1 rounded-lg ${
                    item.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.change}
                  </div>
                </div>
                <dt className="text-sm font-medium text-slate-600 mb-1">
                  {item.name}
                </dt>
                <dd className="text-3xl font-black text-gray-900">
                  {item.value.toLocaleString()}
                </dd>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Properties - Updated styling */}
        <div className="bg-white border-2 border-slate-100 shadow-lg rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              Recent Properties
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="flow-root">
              <ul className="-my-3 divide-y divide-slate-100">
                {recentProperties.map((property) => (
                  <li key={property.id} className="py-4 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {property.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {property.country} • {property.currency} {property.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Users - Updated styling */}
        <div className="bg-white border-2 border-slate-100 shadow-lg rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              Recent Users
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="flow-root">
              <ul className="-my-3 divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <li key={user.id} className="py-4 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email
                          }
                        </p>
                        <p className="text-sm text-slate-600">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
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
