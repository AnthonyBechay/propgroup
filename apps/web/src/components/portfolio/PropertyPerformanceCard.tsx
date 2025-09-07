'use client'

import { useState, useEffect } from 'react'
import { calculateCashOnCash, calculateAppreciation, calculateTotalReturn } from '@propgroup/config'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  X,
  Calculator,
  BarChart3
} from 'lucide-react'

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

interface PropertyPerformanceCardProps {
  property: Property
  onClose: () => void
}

export function PropertyPerformanceCard({ property, onClose }: PropertyPerformanceCardProps) {
  const [currentValue, setCurrentValue] = useState(property.purchasePrice)
  const [annualAppreciation, setAnnualAppreciation] = useState(3)
  const [currentRent, setCurrentRent] = useState(property.currentRent || 0)
  const [mortgagePayment, setMortgagePayment] = useState(property.initialMortgage || 0)
  const [downPayment, setDownPayment] = useState(property.purchasePrice * 0.2) // Assume 20% down

  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    calculatePerformance()
  }, [currentValue, annualAppreciation, currentRent, mortgagePayment, downPayment])

  const calculatePerformance = () => {
    const purchaseDate = new Date(property.purchaseDate)
    const now = new Date()
    const yearsOwned = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)

    // Calculate appreciation
    const appreciation = calculateAppreciation(property.purchasePrice, annualAppreciation, yearsOwned)
    const totalAppreciation = appreciation - property.purchasePrice

    // Calculate rental income
    const totalRentalIncome = currentRent * 12 * yearsOwned

    // Calculate cash flow
    const monthlyCashFlow = currentRent - mortgagePayment
    const annualCashFlow = monthlyCashFlow * 12
    const totalCashFlow = annualCashFlow * yearsOwned

    // Calculate total return
    const totalReturn = totalAppreciation + totalCashFlow
    const totalROI = (totalReturn / property.purchasePrice) * 100
    const annualizedROI = (Math.pow(totalReturn / property.purchasePrice + 1, 1 / yearsOwned) - 1) * 100

    // Calculate equity
    const loanAmount = property.purchasePrice - downPayment
    const equityBuilt = Math.min(loanAmount * 0.1 * yearsOwned, loanAmount) // Simplified equity calculation
    const totalEquity = downPayment + equityBuilt + totalAppreciation

    setPerformanceData({
      yearsOwned,
      currentValue: appreciation,
      totalAppreciation,
      totalRentalIncome,
      totalCashFlow,
      monthlyCashFlow,
      totalReturn,
      totalROI,
      annualizedROI,
      totalEquity,
      equityBuilt
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Performance Simulation: {property.customName}
          </DialogTitle>
          <DialogDescription>
            Simulate the performance of your property investment with different scenarios.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulation Parameters</CardTitle>
                <CardDescription>
                  Adjust these values to see how they affect your investment performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentValue">Current Property Value</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="annualAppreciation">Annual Appreciation Rate (%)</Label>
                  <Input
                    id="annualAppreciation"
                    type="number"
                    step="0.1"
                    value={annualAppreciation}
                    onChange={(e) => setAnnualAppreciation(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="currentRent">Current Monthly Rent</Label>
                  <Input
                    id="currentRent"
                    type="number"
                    value={currentRent}
                    onChange={(e) => setCurrentRent(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="mortgagePayment">Monthly Mortgage Payment</Label>
                  <Input
                    id="mortgagePayment"
                    type="number"
                    value={mortgagePayment}
                    onChange={(e) => setMortgagePayment(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="downPayment">Initial Down Payment</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Date:</span>
                  <span className="font-medium">{formatDate(property.purchaseDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Price:</span>
                  <span className="font-medium">{formatCurrency(property.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years Owned:</span>
                  <span className="font-medium">{performanceData?.yearsOwned.toFixed(1)} years</span>
                </div>
                {property.property && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{property.property.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">
                        {property.property.bedrooms} bed • {property.property.bathrooms} bath
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Results */}
          <div className="space-y-6">
            {performanceData && (
              <>
                {/* Key Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(performanceData.totalReturn)}
                        </div>
                        <div className="text-sm text-green-700">Total Return</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {performanceData.totalROI.toFixed(1)}%
                        </div>
                        <div className="text-sm text-blue-700">Total ROI</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {performanceData.annualizedROI.toFixed(1)}%
                        </div>
                        <div className="text-sm text-purple-700">Annualized ROI</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(performanceData.totalEquity)}
                        </div>
                        <div className="text-sm text-orange-700">Total Equity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Property Value:</span>
                      <span className="font-medium">{formatCurrency(performanceData.currentValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Appreciation:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(performanceData.totalAppreciation)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Rental Income:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(performanceData.totalRentalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cash Flow:</span>
                      <span className="font-medium text-purple-600">
                        {formatCurrency(performanceData.totalCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Cash Flow:</span>
                      <span className={`font-medium ${
                        performanceData.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(performanceData.monthlyCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equity Built:</span>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(performanceData.equityBuilt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
