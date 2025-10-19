'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Sparkles,
  Send,
  X,
  Loader2,
  TrendingUp,
  Home,
  DollarSign,
  MapPin,
  Bot,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  filters?: PropertyFilters
}

interface PropertyFilters {
  country?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  goal?: string
  status?: string
  isGoldenVisaEligible?: boolean
}

interface AIPropertySearchProps {
  variant?: 'inline' | 'modal' | 'page'
  onSearch?: (filters: PropertyFilters) => void
  placeholder?: string
}

export function AIPropertySearch({
  variant = 'inline',
  onSearch,
  placeholder = "Tell me what you're looking for... (e.g., 'I want a 3-bedroom apartment in Cyprus under $500k')"
}: AIPropertySearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showChat, setShowChat] = useState(variant === 'page')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const parseNaturalLanguageQuery = (query: string): PropertyFilters => {
    const filters: PropertyFilters = {}
    const lowerQuery = query.toLowerCase()

    // Extract countries
    const countries = ['georgia', 'cyprus', 'greece', 'lebanon']
    for (const country of countries) {
      if (lowerQuery.includes(country)) {
        filters.country = country.toUpperCase()
        break
      }
    }

    // Extract price range
    const priceMatch = lowerQuery.match(/(?:under|below|less than|max|maximum)\s*\$?([0-9,]+)k?/i)
    if (priceMatch) {
      let price = parseInt(priceMatch[1].replace(/,/g, ''))
      if (lowerQuery.includes('k') || lowerQuery.includes('thousand')) {
        price *= 1000
      }
      filters.maxPrice = price
    }

    const minPriceMatch = lowerQuery.match(/(?:above|over|more than|min|minimum)\s*\$?([0-9,]+)k?/i)
    if (minPriceMatch) {
      let price = parseInt(minPriceMatch[1].replace(/,/g, ''))
      if (lowerQuery.includes('k') || lowerQuery.includes('thousand')) {
        price *= 1000
      }
      filters.minPrice = price
    }

    // Extract range prices like "between $100k and $200k"
    const rangeMatch = lowerQuery.match(/between\s*\$?([0-9,]+)k?\s*(?:and|to|-)\s*\$?([0-9,]+)k?/i)
    if (rangeMatch) {
      let min = parseInt(rangeMatch[1].replace(/,/g, ''))
      let max = parseInt(rangeMatch[2].replace(/,/g, ''))
      if (lowerQuery.includes('k') || lowerQuery.includes('thousand')) {
        min *= 1000
        max *= 1000
      }
      filters.minPrice = min
      filters.maxPrice = max
    }

    // Extract bedrooms
    const bedroomMatch = lowerQuery.match(/(\d+)[- ]?(?:bed|bedroom|br)/i)
    if (bedroomMatch) {
      filters.bedrooms = parseInt(bedroomMatch[1])
    }

    // Extract bathrooms
    const bathroomMatch = lowerQuery.match(/(\d+)[- ]?(?:bath|bathroom)/i)
    if (bathroomMatch) {
      filters.bathrooms = parseInt(bathroomMatch[1])
    }

    // Extract goals
    if (lowerQuery.includes('golden visa') || lowerQuery.includes('residency') || lowerQuery.includes('citizenship')) {
      filters.goal = 'GOLDEN_VISA'
      filters.isGoldenVisaEligible = true
    }
    if (lowerQuery.includes('roi') || lowerQuery.includes('return') || lowerQuery.includes('investment return')) {
      filters.goal = 'HIGH_ROI'
    }
    if (lowerQuery.includes('rental') || lowerQuery.includes('passive income') || lowerQuery.includes('rent')) {
      filters.goal = 'PASSIVE_INCOME'
    }

    // Extract status
    if (lowerQuery.includes('off plan') || lowerQuery.includes('off-plan')) {
      filters.status = 'OFF_PLAN'
    } else if (lowerQuery.includes('new build') || lowerQuery.includes('new-build')) {
      filters.status = 'NEW_BUILD'
    } else if (lowerQuery.includes('resale')) {
      filters.status = 'RESALE'
    }

    return filters
  }

  const generateAssistantResponse = (filters: PropertyFilters, originalQuery: string): string => {
    const parts: string[] = []

    parts.push("I'll help you find properties matching your criteria:")

    if (filters.bedrooms) {
      parts.push(`${filters.bedrooms} bedroom${filters.bedrooms > 1 ? 's' : ''}`)
    }

    if (filters.country) {
      parts.push(`in ${filters.country.charAt(0) + filters.country.slice(1).toLowerCase()}`)
    }

    if (filters.minPrice && filters.maxPrice) {
      parts.push(`between $${filters.minPrice.toLocaleString()} and $${filters.maxPrice.toLocaleString()}`)
    } else if (filters.maxPrice) {
      parts.push(`under $${filters.maxPrice.toLocaleString()}`)
    } else if (filters.minPrice) {
      parts.push(`above $${filters.minPrice.toLocaleString()}`)
    }

    if (filters.goal === 'GOLDEN_VISA') {
      parts.push('eligible for Golden Visa programs')
    }

    if (filters.status) {
      const statusText = filters.status.replace('_', ' ').toLowerCase()
      parts.push(`(${statusText})`)
    }

    let response = parts.length > 1
      ? parts.join(' ') + '.'
      : "I'll search for properties based on your request."

    response += "\n\nSearching our database now..."

    return response
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setQuery('')

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 500))

    const filters = parseNaturalLanguageQuery(query)
    const assistantResponse = generateAssistantResponse(filters, query)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date(),
      filters
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)

    // Navigate to properties with filters after a short delay
    setTimeout(() => {
      const params = new URLSearchParams()
      if (filters.country) params.append('country', filters.country)
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString())
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString())
      if (filters.goal) params.append('goal', filters.goal)
      if (filters.status) params.append('status', filters.status)
      if (filters.isGoldenVisaEligible) params.append('goldenVisa', 'true')

      params.append('q', query)

      if (onSearch) {
        onSearch(filters)
      } else {
        router.push(`/properties?${params.toString()}`)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const quickSuggestions = [
    { icon: Home, text: "3-bedroom apartment in Cyprus under $300k", color: "blue" },
    { icon: TrendingUp, text: "Properties with highest ROI in Greece", color: "green" },
    { icon: DollarSign, text: "Golden Visa eligible properties", color: "yellow" },
    { icon: MapPin, text: "New build properties in Georgia", color: "purple" }
  ]

  if (variant === 'inline') {
    return (
      <div className="w-full">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-16 pr-12 h-14 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl shadow-lg"
          />
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion.text)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
            >
              <suggestion.icon className={`w-4 h-4 text-${suggestion.color}-500`} />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Chat interface for modal or page variant
  return (
    <div className={`flex flex-col ${variant === 'page' ? 'h-[calc(100vh-200px)]' : 'h-[600px]'} bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">PropGroup AI Assistant</h3>
            <p className="text-xs text-white/80">Powered by advanced property matching</p>
          </div>
        </div>
        {variant === 'modal' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How can I help you today?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Describe your ideal property and I'll find the perfect matches
            </p>

            {/* Quick suggestions in chat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion.text)}
                  className="flex items-center gap-3 p-4 text-left bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                >
                  <div className={`w-10 h-10 bg-${suggestion.color}-100 dark:bg-${suggestion.color}-900/30 rounded-lg flex items-center justify-center`}>
                    <suggestion.icon className={`w-5 h-5 text-${suggestion.color}-600 dark:text-${suggestion.color}-400`} />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {suggestion.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.filters && Object.keys(message.filters).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 text-xs opacity-80">
                    <span className="font-semibold">Filters applied:</span>{' '}
                    {Object.entries(message.filters).filter(([_, v]) => v).length} criteria
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-gray-600 dark:text-gray-400">Analyzing your request...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Describe your ideal property..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 bg-white dark:bg-gray-900"
          />
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Try: "2-bedroom in Cyprus under $400k" or "Golden Visa properties in Greece"
        </p>
      </div>
    </div>
  )
}
