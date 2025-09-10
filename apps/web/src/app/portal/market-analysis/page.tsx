'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  DollarSign,
  Building2,
  Users,
  Calendar,
  Filter,
  Download,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Home
} from 'lucide-react'
import Link from 'next/link'

// Mock market data
const marketData = {
  cyprus: {
    name: 'Cyprus',
    avgPrice: 450000,
    priceChange: 8.5,
    avgROI: 12.5,
    rentalYield: 5.8,
    goldenVisa: 300000,
    popularAreas: ['Limassol', 'Paphos', 'Larnaca', 'Nicosia'],
    marketTrend: 'Growing',
    bestFor: ['Golden Visa', 'Rental Income', 'Capital Growth'],
    insights: [
      'Strong demand from international buyers',
      'Tech hub development in Limassol',
      'Stable rental market with high yields',
      'EU citizenship pathway available'
    ]
  },
  greece: {
    name: 'Greece',
    avgPrice: 280000,
    priceChange: 6.2,
    avgROI: 10.8,
    rentalYield: 4.5,
    goldenVisa: 250000,
    popularAreas: ['Athens', 'Thessaloniki', 'Crete', 'Mykonos'],
    marketTrend: 'Recovering',
    bestFor: ['Golden Visa', 'Tourism Rentals', 'Value Investment'],
    insights: [
      'Tourism recovery driving demand',
      'Attractive golden visa threshold',
      'Growing short-term rental market',
      'Infrastructure improvements ongoing'
    ]
  },
  georgia: {
    name: 'Georgia',
    avgPrice: 120000,
    priceChange: 4.1,
    avgROI: 9.2,
    rentalYield: 7.2,
    goldenVisa: 0,
    popularAreas: ['Tbilisi', 'Batumi', 'Gudauri', 'Bakuriani'],
    marketTrend: 'Emerging',
    bestFor: ['High Yield', 'Low Entry Cost', 'Growing Market'],
    insights: [
      'Emerging tech and tourism sectors',
      'Low property prices with high yields',
      'Growing expat community',
      'Liberal investment policies'
    ]
  },
  lebanon: {
    name: 'Lebanon',
    avgPrice: 350000,
    priceChange: -2.3,
    avgROI: 6.5,
    rentalYield: 3.8,
    goldenVisa: 0,
    popularAreas: ['Beirut', 'Jounieh', 'Byblos', 'Batroun'],
    marketTrend: 'Stabilizing',
    bestFor: ['Long-term Hold', 'Diaspora Investment', 'Prime Locations'],
    insights: [
      'Market stabilization ongoing',
      'Prime locations holding value',
      'Diaspora investment increasing',
      'Infrastructure projects planned'
    ]
  }
}

const comparisonMetrics = [
  { metric: 'Average Property Price', key: 'avgPrice', format: 'currency' },
  { metric: 'Price Change (YoY)', key: 'priceChange', format: 'percentage' },
  { metric: 'Average ROI', key: 'avgROI', format: 'percentage' },
  { metric: 'Rental Yield', key: 'rentalYield', format: 'percentage' },
  { metric: 'Golden Visa Threshold', key: 'goldenVisa', format: 'currency' },
]

export default function MarketAnalysisPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>('cyprus')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('avgROI')
  const [timeRange, setTimeRange] = useState('1y')

  const formatValue = (value: number, format: string) => {
    switch(format) {
      case 'currency':
        return value === 0 ? 'N/A' : `$${value.toLocaleString()}`
      case 'percentage':
        return `${value > 0 ? '+' : ''}${value}%`
      default:
        return value.toString()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Market Analysis
              </h1>
              <p className="text-gray-600">
                Real-time insights and trends across our investment markets
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 flex-wrap">
            {['1m', '3m', '6m', '1y', '3y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === '1m' ? '1 Month' :
                 range === '3m' ? '3 Months' :
                 range === '6m' ? '6 Months' :
                 range === '1y' ? '1 Year' : '3 Years'}
              </button>
            ))}
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(marketData).map(([key, data]) => (
            <div
              key={key}
              onClick={() => setSelectedCountry(key)}
              className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedCountry === key ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{data.name}</h3>
                </div>
                {data.priceChange > 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Avg. Price</span>
                  <span className="text-sm font-medium">${(data.avgPrice / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ROI</span>
                  <span className="text-sm font-medium">{data.avgROI}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Trend</span>
                  <span className={`text-sm font-medium ${
                    data.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.priceChange > 0 ? '+' : ''}{data.priceChange}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Analysis Section */}
        {selectedCountry && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Country Deep Dive */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {marketData[selectedCountry].name} Market Deep Dive
              </h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <MetricCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Avg. Property Price"
                  value={`$${marketData[selectedCountry].avgPrice.toLocaleString()}`}
                  trend={marketData[selectedCountry].priceChange}
                />
                <MetricCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Expected ROI"
                  value={`${marketData[selectedCountry].avgROI}%`}
                  trend={2.3}
                />
                <MetricCard
                  icon={<Home className="w-5 h-5" />}
                  label="Rental Yield"
                  value={`${marketData[selectedCountry].rentalYield}%`}
                  trend={0.5}
                />
                <MetricCard
                  icon={<Globe className="w-5 h-5" />}
                  label="Golden Visa"
                  value={marketData[selectedCountry].goldenVisa === 0 ? 'N/A' : `$${(marketData[selectedCountry].goldenVisa / 1000)}K`}
                  trend={0}
                />
                <MetricCard
                  icon={<Building2 className="w-5 h-5" />}
                  label="Market Status"
                  value={marketData[selectedCountry].marketTrend}
                  trend={0}
                />
                <MetricCard
                  icon={<Users className="w-5 h-5" />}
                  label="Investor Interest"
                  value="High"
                  trend={15}
                />
              </div>

              {/* Popular Areas */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Popular Investment Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {marketData[selectedCountry].popularAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Best For</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {marketData[selectedCountry].bestFor.map((item) => (
                    <div key={item} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Properties Button */}
              <Link
                href={`/properties?country=${selectedCountry}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View {marketData[selectedCountry].name} Properties
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Market Insights
              </h3>
              <div className="space-y-3">
                {marketData[selectedCountry].insights.map((insight, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1">
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Market Comparison</h2>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {compareMode ? 'Hide Comparison' : 'Show Comparison'}
            </button>
          </div>

          {compareMode && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                    {Object.entries(marketData).map(([key, data]) => (
                      <th key={key} className="text-center py-3 px-4 font-semibold text-gray-900">
                        {data.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric) => (
                    <tr key={metric.key} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700 font-medium">{metric.metric}</td>
                      {Object.entries(marketData).map(([key, data]) => (
                        <td key={key} className="text-center py-3 px-4">
                          <span className={`font-medium ${
                            metric.key === 'priceChange' && data[metric.key] > 0 ? 'text-green-600' :
                            metric.key === 'priceChange' && data[metric.key] < 0 ? 'text-red-600' :
                            'text-gray-900'
                          }`}>
                            {formatValue(data[metric.key], metric.format)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ icon, label, value, trend }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-gray-500">{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">{value}</span>
        {trend !== 0 && (
          <span className={`text-xs font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  )
}
