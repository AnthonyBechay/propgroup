'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyFilters } from '@/components/properties/PropertyFilters'
import { PropertySort } from '@/components/properties/PropertySort'
import { PropertyGridSkeleton } from '@/components/properties/PropertyGridSkeleton'
import { MapView } from '@/components/properties/MapView'
import { AIPropertySearch } from '@/components/ai/AIPropertySearch'
import {
  Grid3x3,
  Map,
  Filter,
  X,
  Sparkles,
  TrendingUp,
  Globe,
  Search,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  area: number
  country: string
  status: string
  images: string[]
  isGoldenVisaEligible?: boolean
  investmentData?: {
    expectedROI?: number | null
    rentalYield?: number | null
    capitalGrowth?: number | null
  }
  favoriteProperties?: any[]
}

export function PropertiesClient({ 
  initialProperties,
  searchParams 
}: { 
  initialProperties: Property[]
  searchParams: any
}) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [properties, setProperties] = useState(initialProperties)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showAISearch, setShowAISearch] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState(initialProperties)

  // Filter and sort properties based on search params
  useEffect(() => {
    let filtered = [...initialProperties]
    
    // Apply filters
    if (searchParams.country) {
      filtered = filtered.filter(p => 
        p.country.toLowerCase() === searchParams.country.toLowerCase()
      )
    }
    
    if (searchParams.status) {
      filtered = filtered.filter(p => 
        p.status.toLowerCase() === searchParams.status.toLowerCase()
      )
    }
    
    if (searchParams.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(searchParams.minPrice))
    }
    
    if (searchParams.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(searchParams.maxPrice))
    }
    
    if (searchParams.goal === 'GOLDEN_VISA') {
      filtered = filtered.filter(p => p.isGoldenVisaEligible)
    }
    
    // Apply sorting
    if (searchParams.sort) {
      switch (searchParams.sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'roi-desc':
          filtered.sort((a, b) => 
            (b.investmentData?.expectedROI || 0) - (a.investmentData?.expectedROI || 0)
          )
          break
        case 'area-desc':
          filtered.sort((a, b) => b.area - a.area)
          break
      }
    }
    
    setFilteredProperties(filtered)
  }, [initialProperties, searchParams])

  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.set(key, filters[key])
      } else {
        params.delete(key)
      }
    })
    
    router.push(`/properties?${params.toString()}`)
  }

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('sort', sort)
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/properties')
  }

  const activeFiltersCount = Object.keys(searchParams).filter(
    key => key !== 'sort' && searchParams[key]
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              CURATED PROPERTIES
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Premium Investment Properties
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Hand-picked opportunities with verified returns and expert analysis
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-semibold">12.5% Avg ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-300" />
                <span className="font-semibold">25+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{filteredProperties.length} Properties</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* AI Search Banner */}
        {!showAISearch && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Try AI-Powered Search</h3>
                  <p className="text-sm text-white/90">
                    Find properties faster by describing what you want in plain English
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowAISearch(true)}
                className="bg-white text-blue-600 hover:bg-white/90"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try Now
              </Button>
            </div>
          </div>
        )}

        {/* AI Search Interface */}
        {showAISearch && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                AI Property Search
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAISearch(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <AIPropertySearch variant="inline" />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* AI Search button */}
            {!showAISearch && (
              <Button
                onClick={() => setShowAISearch(true)}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Search
              </Button>
            )}

            {/* Filter button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'default' : 'outline'}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* View mode toggle */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="rounded-l-none"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>

            {/* Active filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Sort dropdown */}
          <PropertySort 
            value={searchParams.sort || 'newest'} 
            onChange={handleSortChange}
          />
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2">
            <PropertyFilters
              filters={searchParams}
              onChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Results summary */}
        {(searchParams.q || searchParams.goal || searchParams.budget) && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Search Results
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredProperties.length} properties found
                {searchParams.goal && ` for ${searchParams.goal.replace('_', ' ').toLowerCase()} goal`}
                {searchParams.budget && ` under $${parseInt(searchParams.budget).toLocaleString()}`}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <PropertyGridSkeleton />
        ) : viewMode === 'grid' ? (
          filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property: Property, index: number) => (
                <div
                  key={property.id}
                  className="fade-in"
                  style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                >
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    description={property.description}
                    price={property.price}
                    currency={property.currency}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    country={property.country.toLowerCase()}
                    status={property.status}
                    images={property.images}
                    isGoldenVisaEligible={property.isGoldenVisaEligible}
                    investmentData={{
                      expectedROI: property.investmentData?.expectedROI,
                      rentalYield: property.investmentData?.rentalYield,
                      capitalGrowth: property.investmentData?.capitalGrowth,
                    }}
                    isFavorited={property.favoriteProperties?.length > 0}
                    featured={index < 3}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-3xl">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Try adjusting your filters or search criteria to find more properties
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View All Properties
                </Button>
              </div>
            </div>
          )
        ) : (
          <MapView properties={filteredProperties} />
        )}

        {/* Load more button */}
        {filteredProperties.length > 0 && filteredProperties.length % 9 === 0 && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px]"
            >
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
