'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  TrendingUp, 
  Home, 
  Calculator, 
  Heart, 
  FileText, 
  Users,
  DollarSign,
  MapPin,
  BarChart3,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockStats = {
  totalInvestment: 1250000,
  totalProperties: 3,
  averageROI: 12.5,
  monthlyIncome: 8500,
  portfolioGrowth: 15.3,
  savedProperties: 7
}

const mockRecentActivity = [
  { id: 1, type: 'inquiry', property: 'Luxury Villa in Cyprus', date: '2 hours ago' },
  { id: 2, type: 'favorite', property: 'Beachfront Apartment', date: '1 day ago' },
  { id: 3, type: 'view', property: 'Mountain Retreat', date: '3 days ago' },
]

const mockMarketTrends = [
  { country: 'Cyprus', trend: 'up', value: 8.5 },
  { country: 'Greece', trend: 'up', value: 6.2 },
  { country: 'Georgia', trend: 'stable', value: 4.1 },
  { country: 'Lebanon', trend: 'down', value: -2.3 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'Investor'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your investment portfolio and market insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Investment"
            value={`$${mockStats.totalInvestment.toLocaleString()}`}
            change="+12.5%"
            trend="up"
            color="blue"
          />
          <StatCard
            icon={<Building2 className="w-6 h-6" />}
            title="Properties Owned"
            value={mockStats.totalProperties}
            change="+1 this month"
            trend="up"
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Average ROI"
            value={`${mockStats.averageROI}%`}
            change="+2.3%"
            trend="up"
            color="purple"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="Saved Properties"
            value={mockStats.savedProperties}
            change="View all"
            trend="neutral"
            color="pink"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickActionCard
            href="/properties"
            icon={<Home className="w-8 h-8" />}
            title="Browse Properties"
            description="Explore new opportunities"
            color="blue"
          />
          <QuickActionCard
            href="/portal/calculator"
            icon={<Calculator className="w-8 h-8" />}
            title="ROI Calculator"
            description="Calculate returns"
            color="green"
          />
          <QuickActionCard
            href="/portal/market-analysis"
            icon={<BarChart3 className="w-8 h-8" />}
            title="Market Analysis"
            description="View market trends"
            color="purple"
          />
          <QuickActionCard
            href="/portal/portfolio"
            icon={<FileText className="w-8 h-8" />}
            title="My Portfolio"
            description="Manage investments"
            color="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Trends */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Market Trends</h2>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {mockMarketTrends.map((market) => (
                <div key={market.country} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{market.country}</h3>
                      <p className="text-sm text-gray-500">Real Estate Market</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-semibold ${
                      market.trend === 'up' ? 'text-green-600' : 
                      market.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {market.value > 0 ? '+' : ''}{market.value}%
                    </span>
                    {market.trend === 'up' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : market.trend === 'down' ? (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <span className="w-5 h-5 text-gray-400">→</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/portal/market-analysis" 
              className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View detailed analysis
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'inquiry' ? 'bg-blue-500' :
                    activity.type === 'favorite' ? 'bg-pink-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {activity.type === 'inquiry' && 'Sent inquiry for '}
                      {activity.type === 'favorite' && 'Saved '}
                      {activity.type === 'view' && 'Viewed '}
                      <span className="font-medium">{activity.property}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              href="/portal/activity" 
              className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all activity
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Portfolio Performance */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Portfolio Performance</h2>
              <p className="text-blue-100 mb-4">Your investments are performing well!</p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-blue-100">Monthly Income</p>
                  <p className="text-2xl font-bold">${mockStats.monthlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-100">Portfolio Growth</p>
                  <p className="text-2xl font-bold">+{mockStats.portfolioGrowth}%</p>
                </div>
              </div>
            </div>
            <Link 
              href="/portal/portfolio" 
              className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              View Portfolio
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon, title, value, change, trend, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} p-3 rounded-lg text-white`}>
          {icon}
        </div>
        {trend === 'up' && <ArrowUpRight className="w-5 h-5 text-green-500" />}
        {trend === 'down' && <ArrowDownRight className="w-5 h-5 text-red-500" />}
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className={`text-sm mt-2 ${
        trend === 'up' ? 'text-green-600' : 
        trend === 'down' ? 'text-red-600' : 'text-gray-500'
      }`}>
        {change}
      </p>
    </div>
  )
}

// Quick Action Card Component
function QuickActionCard({ href, icon, title, description, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  }

  return (
    <Link 
      href={href}
      className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
    >
      <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg text-white mb-4 group-hover:scale-110 transition-transform inline-block`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
