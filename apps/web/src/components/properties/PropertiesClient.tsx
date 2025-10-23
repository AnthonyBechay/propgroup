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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Landing Page */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b] text-white overflow-hidden">
        {/* Simplified Background - Matching Landing Page */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">CURATED PROPERTIES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6">
              <span className="block text-white mb-2">
                Premium Investment
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Properties
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Hand-picked opportunities with verified returns and expert analysis
            </p>

            {/* Quick stats - Matching Landing Page Style */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">12.5%</div>
                <div className="text-sm text-slate-400">Avg ROI</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">25+</div>
                <div className="text-sm text-slate-400">Countries</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{filteredProperties.length}</div>
                <div className="text-sm text-slate-400">Properties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Search Banner - Updated to match landing page style */}
        {!showAISearch && (
          <div className="mb-8 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">AI-Powered Search</h3>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full">
                      NEW
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Find properties faster by describing what you want in plain English
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowAISearch(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all flex-shrink-0"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try Now
              </Button>
            </div>
          </div>
        )}

        {/* AI Search Interface - Updated styling */}
        {showAISearch && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  AI Property Search
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAISearch(false)}
                  className="text-gray-500 hover:text-gray-900 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <AIPropertySearch variant="inline" />
            </div>
          </div>
        )}

        {/* Toolbar - Updated styling to match theme */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* AI Search button */}
            {!showAISearch && (
              <Button
                onClick={() => setShowAISearch(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-md"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Search
              </Button>
            )}

            {/* Filter button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`relative border-2 shadow-sm ${
                showFilters
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* View mode toggle */}
            <div className="flex items-center bg-white rounded-lg shadow-sm border-2 border-slate-200">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-r-none ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={`rounded-l-none ${
                  viewMode === 'map'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
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
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {/* Results summary - Updated styling */}
        {(searchParams.q || searchParams.goal || searchParams.budget) && (
          <div className="mb-6 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">
                  Search Results
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="font-bold text-blue-600">{filteredProperties.length}</span> properties found
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
            <div className="text-center py-20 bg-slate-50 border-2 border-slate-200 rounded-3xl shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Search className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">
                  No properties found
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Try adjusting your filters or search criteria to find more properties
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl shadow-lg px-8"
                  size="lg"
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

        {/* Load more button - Updated styling */}
        {filteredProperties.length > 0 && filteredProperties.length % 9 === 0 && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px] border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold rounded-xl shadow-md transition-all"
            >
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
