import { PropertyCard } from '@propgroup/ui'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Heart, TrendingUp, DollarSign, Building } from 'lucide-react'

export default async function DashboardPage() {
  // Get the authenticated user
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/')
  }

  // Fetch user's favorite properties
  const favoriteProperties = await prisma.favoriteProperty.findMany({
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

  // Calculate user's investment summary
  const totalInvestments = favoriteProperties.length
  const totalValue = favoriteProperties.reduce((sum, fav) => sum + fav.property.price, 0)
  const averageROI = favoriteProperties.length > 0 
    ? favoriteProperties.reduce((sum, fav) => sum + (fav.property.investmentData?.expectedROI || 0), 0) / favoriteProperties.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Investment Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back! Here's your investment portfolio overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalInvestments}</div>
                <div className="text-sm text-gray-600">Favorite Properties</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {averageROI.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Expected ROI</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {favoriteProperties.filter(fav => fav.property.isGoldenVisaEligible).length}
                </div>
                <div className="text-sm text-gray-600">Golden Visa Eligible</div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Properties Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Favorite Properties
            </h2>
            <span className="text-sm text-gray-500">
              {favoriteProperties.length} properties
            </span>
          </div>

          {favoriteProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((favorite) => (
                <PropertyCard
                  key={favorite.id}
                  id={favorite.property.id}
                  title={favorite.property.title}
                  description={favorite.property.description}
                  price={favorite.property.price}
                  currency={favorite.property.currency}
                  bedrooms={favorite.property.bedrooms}
                  bathrooms={favorite.property.bathrooms}
                  area={favorite.property.area}
                  country={favorite.property.country.toLowerCase()}
                  status={favorite.property.status}
                  images={favorite.property.images}
                  isGoldenVisaEligible={favorite.property.isGoldenVisaEligible}
                  investmentData={{
                    expectedROI: favorite.property.investmentData?.expectedROI,
                    rentalYield: favorite.property.investmentData?.rentalYield,
                    capitalGrowth: favorite.property.investmentData?.capitalGrowth,
                  }}
                  onFavorite={(id: string) => console.log('Remove from favorites:', id)}
                  onInquiry={(id: string) => console.log('Inquiry for property:', id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No favorite properties yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start building your investment portfolio by adding properties to your favorites.
              </p>
              <a
                href="/properties"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </a>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Calculator</h3>
            <p className="text-gray-600 mb-4">
              Calculate potential returns on your investments with our advanced ROI calculator.
            </p>
            <a
              href="/properties"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Try Calculator →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Market Analysis</h3>
            <p className="text-gray-600 mb-4">
              Access detailed market insights and trends for your investment regions.
            </p>
            <a
              href="/portal/analysis"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View Analysis →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Vault</h3>
            <p className="text-gray-600 mb-4">
              Securely store and access all your investment-related documents.
            </p>
            <a
              href="/portal/documents"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Access Vault →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
