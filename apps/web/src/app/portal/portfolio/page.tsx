import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview'
import { AddPropertyModal } from '@/components/portfolio/AddPropertyModal'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, DollarSign, Building2 } from 'lucide-react'

export default async function PortfolioPage() {
  // Get the authenticated user
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/')
  }

  // Fetch user's owned properties
  const ownedProperties = await prisma.userOwnedProperty.findMany({
    where: { userId: user.id },
    include: {
      property: {
        include: {
          investmentData: true,
          developer: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate portfolio summary
  const totalProperties = ownedProperties.length
  const totalInvestment = ownedProperties.reduce((sum, prop) => sum + prop.purchasePrice, 0)
  const totalRent = ownedProperties.reduce((sum, prop) => sum + (prop.currentRent || 0), 0)
  const averageROI = ownedProperties.length > 0 
    ? ownedProperties.reduce((sum, prop) => {
        const annualRent = (prop.currentRent || 0) * 12
        const roi = prop.purchasePrice > 0 ? (annualRent / prop.purchasePrice) * 100 : 0
        return sum + roi
      }, 0) / ownedProperties.length
    : 0

  const portfolioStats = [
    {
      name: 'Total Properties',
      value: totalProperties,
      icon: Building2,
      change: '+2 this month',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Investment',
      value: `$${totalInvestment.toLocaleString()}`,
      icon: DollarSign,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Monthly Rent',
      value: `$${totalRent.toLocaleString()}`,
      icon: TrendingUp,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Average ROI',
      value: `${averageROI.toFixed(1)}%`,
      icon: TrendingUp,
      change: '+2.1%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Portfolio
              </h1>
              <p className="text-xl text-gray-600">
                Track and manage your real estate investments.
              </p>
            </div>
            <AddPropertyModal>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </AddPropertyModal>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {portfolioStats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Overview */}
        <PortfolioOverview properties={ownedProperties} />
      </div>
    </div>
  )
}
