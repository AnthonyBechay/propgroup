'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Globe, 
  DollarSign, 
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Target,
  Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function InvestmentMatchmaker() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    goal: '',
    budget: '',
    country: '',
    timeline: '',
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Navigate to properties with filters
      const params = new URLSearchParams()
      if (formData.goal) params.append('goal', formData.goal)
      if (formData.budget) params.append('budget', formData.budget)
      if (formData.country) params.append('country', formData.country)
      router.push(`/properties?${params.toString()}`)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            AI-POWERED MATCHMAKER
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Perfect Investment
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Answer a few questions and we'll match you with ideal properties
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  What's your investment goal?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => updateFormData('goal', 'HIGH_ROI')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.goal === 'HIGH_ROI'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Maximum Returns
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Focus on properties with highest ROI potential (15%+)
                    </p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('goal', 'GOLDEN_VISA')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.goal === 'GOLDEN_VISA'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <BadgeCheck className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Residency Benefits
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Properties eligible for Golden Visa programs
                    </p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('goal', 'PASSIVE_INCOME')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.goal === 'PASSIVE_INCOME'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <DollarSign className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Rental Income
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Steady monthly income from rental properties
                    </p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('goal', 'DIVERSIFICATION')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.goal === 'DIVERSIFICATION'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Globe className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Portfolio Diversification
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Spread investments across multiple markets
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  What's your investment budget?
                </Label>
                <div className="space-y-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.budget}
                      onChange={(e) => updateFormData('budget', e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['250000', '500000', '1000000', '2000000'].map((amount) => (
                      <Button
                        key={amount}
                        variant={formData.budget === amount ? 'default' : 'outline'}
                        onClick={() => updateFormData('budget', amount)}
                        className="h-12"
                      >
                        ${parseInt(amount).toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Preferred location?
                </Label>
                <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uae">🇦🇪 United Arab Emirates</SelectItem>
                    <SelectItem value="usa">🇺🇸 United States</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="spain">🇪🇸 Spain</SelectItem>
                    <SelectItem value="portugal">🇵🇹 Portugal</SelectItem>
                    <SelectItem value="greece">🇬🇷 Greece</SelectItem>
                    <SelectItem value="canada">🇨🇦 Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  When do you plan to invest?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => updateFormData('timeline', 'IMMEDIATE')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeline === 'IMMEDIATE'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Ready to invest now
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      I have funds ready and want to invest immediately
                    </p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('timeline', '3_MONTHS')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeline === '3_MONTHS'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Within 3 months
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Planning to invest in the next quarter
                    </p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('timeline', '6_MONTHS')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeline === '6_MONTHS'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Within 6 months
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Exploring options for the next 6 months
                    </p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('timeline', 'RESEARCH')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeline === 'RESEARCH'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Just researching
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Learning about investment opportunities
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className={step === 1 ? 'invisible' : ''}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.goal) ||
              (step === 2 && (!formData.budget || !formData.country)) ||
              (step === 3 && !formData.timeline)
            }
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[150px]"
          >
            {step === 3 ? (
              <>
                View Matches
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
