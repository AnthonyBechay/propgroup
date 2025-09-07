'use client'

import { useState } from 'react'
import { PropertyPerformanceCard } from './PropertyPerformanceCard'
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  MapPin,
  Star
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Property {
  id: string
  customName: string
  purchasePrice: number
  purchaseDate: string
  initialMortgage?: number | null
  currentRent?: number | null
  notes?: string | null
  property?: {
    id: string
    title: string
    country: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    investmentData?: {
      expectedROI?: number | null
      rentalYield?: number | null
      capitalGrowth?: number | null
    } | null
    developer?: {
      name: string
    } | null
  } | null
}

interface PortfolioOverviewProps {
  properties: Property[]
}

export function PortfolioOverview({ properties }: PortfolioOverviewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateOwnershipDuration = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - purchase.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''}`
    } else {
      return `${months} month${months > 1 ? 's' : ''}`
    }
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No properties in your portfolio
        </h3>
        <p className="text-gray-600 mb-6">
          Start building your real estate portfolio by adding your first property.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Property Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {property.customName}
                  </h3>
                  {property.property && (
                    <p className="text-sm text-gray-600 mb-2">
                      {property.property.title}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Purchased {formatDate(property.purchaseDate)}
                  </div>
                </div>
                <Badge variant="secondary">
                  {calculateOwnershipDuration(property.purchaseDate)}
                </Badge>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Investment Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Purchase Price</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(property.purchasePrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Current Rent</div>
                    <div className="text-lg font-semibold text-green-600">
                      {property.currentRent 
                        ? formatCurrency(property.currentRent)
                        : 'Not set'
                      }
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                {property.property && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {property.property.country}
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.property.bedrooms} bed • {property.property.bathrooms} bath • {property.property.area} sq ft
                    </div>
                    {property.property.developer && (
                      <div className="text-sm text-gray-600">
                        by {property.property.developer.name}
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Monthly Cashflow</div>
                      <div className="font-semibold text-gray-900">
                        {property.currentRent && property.initialMortgage
                          ? formatCurrency(property.currentRent - property.initialMortgage)
                          : 'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Annual ROI</div>
                      <div className="font-semibold text-gray-900">
                        {property.currentRent && property.purchasePrice > 0
                          ? `${((property.currentRent * 12 / property.purchasePrice) * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Simulate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Simulator Modal */}
      {selectedProperty && (
        <PropertyPerformanceCard
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  )
}
