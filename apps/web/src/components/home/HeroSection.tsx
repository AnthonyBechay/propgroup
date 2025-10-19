'use client'

import { useState } from 'react'
import { Search, TrendingUp, Globe, Shield, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { AIPropertySearch } from '@/components/ai/AIPropertySearch'

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [useAISearch, setUseAISearch] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (propertyType) params.append('type', propertyType)
    if (priceRange) {
      const [min, max] = priceRange.split('-')
      if (min) params.append('minPrice', min)
      if (max) params.append('maxPrice', max)
    }
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 hero-pattern opacity-5" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-POWERED INVESTMENT PLATFORM
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
            Invest in Global{' '}
            <span className="text-gradient">Real Estate</span>
            <br />
            with Confidence
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Discover premium properties worldwide with data-driven insights, 
            expert guidance, and guaranteed returns.
          </p>

          {/* Search form */}
          <div className="glass-card p-6 rounded-2xl shadow-2xl animate-fade-in" style={{ animationDelay: '300ms' }}>
            {/* Toggle between AI and traditional search */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                <button
                  onClick={() => setUseAISearch(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    useAISearch
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  AI Search
                </button>
                <button
                  onClick={() => setUseAISearch(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    !useAISearch
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Traditional
                </button>
              </div>
            </div>

            {useAISearch ? (
              <AIPropertySearch variant="inline" placeholder="Try: 'I want a 3-bedroom apartment in Cyprus under $400k with good ROI'" />
            ) : (
              <form onSubmit={handleSearch}>
                <div className="grid md:grid-cols-4 gap-4">
                  <Input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  />

                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500000">Under $500K</SelectItem>
                      <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                      <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                      <SelectItem value="2000000-">Above $2M</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button type="submit" size="lg" className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-semibold">12.5% Avg ROI</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">25+ Countries</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">100% Secure</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
              <span className="flex items-center gap-2">
                Start Investing
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button size="lg" variant="outline" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <span className="flex items-center gap-2">
                Watch Demo
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full p-1">
          <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  )
}
