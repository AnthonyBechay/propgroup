import { AIPropertySearch } from '@/components/ai/AIPropertySearch'
import { Bot, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'

export const metadata = {
  title: 'AI Property Search',
  description: 'Find your perfect investment property using our AI-powered search assistant',
}

export default function AISearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              <Bot className="w-4 h-4" />
              AI-POWERED SEARCH
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Property with AI
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Just tell us what you're looking for in plain English, and our AI will find the perfect matches
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Sparkles className="w-8 h-8 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Natural Language</h3>
                <p className="text-sm text-white/80">
                  Search using everyday language, no complex filters needed
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Zap className="w-8 h-8 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-white/80">
                  Get matched with properties in seconds based on your criteria
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <TrendingUp className="w-8 h-8 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-white/80">
                  AI understands your investment goals and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Interface */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AIPropertySearch variant="page" />

            {/* Example searches */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Try These Example Searches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        "I need a 2-3 bedroom property in Cyprus under $350,000"
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Specific location and budget requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        "Show me properties with the highest ROI in Greece"
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Investment-focused search
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        "Golden Visa eligible properties between $250k and $500k"
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Residency program requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        "I want a new build apartment with good rental yield"
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Property status and income potential
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Describe Your Needs
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Type what you're looking for in natural language - bedrooms, location, budget, goals, etc.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    AI Analyzes Request
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our AI understands your requirements and converts them into precise search filters
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Get Perfect Matches
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Browse through properties that exactly match your criteria with detailed insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
