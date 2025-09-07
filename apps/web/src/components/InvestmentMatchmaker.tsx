'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { investmentCalculatorSchema } from '@propgroup/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, TrendingUp, DollarSign, Target } from 'lucide-react'

type MatchmakerFormData = {
  goal: string
  budget: number
  country: string
}

const matchmakerSchema = investmentCalculatorSchema.pick({ propertyPrice: true }).extend({
  goal: investmentCalculatorSchema.shape.propertyPrice, // Using as placeholder
  country: investmentCalculatorSchema.shape.propertyPrice,
})

export function InvestmentMatchmaker() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<MatchmakerFormData>({
    resolver: zodResolver(matchmakerSchema),
    defaultValues: {
      goal: '',
      budget: 0,
      country: '',
    },
  })

  const onSubmit = (data: MatchmakerFormData) => {
    const params = new URLSearchParams({
      goal: data.goal,
      budget: data.budget.toString(),
      country: data.country,
    })
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Investment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered matchmaker analyzes your goals and budget to recommend 
            the best international real estate opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Investment Goal */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <Label className="text-lg font-semibold text-gray-900">
                  Investment Goal
                </Label>
              </div>
              <select
                {...register('goal')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your goal</option>
                <option value="HIGH_ROI">High ROI</option>
                <option value="CAPITAL_GROWTH">Capital Growth</option>
                <option value="GOLDEN_VISA">Golden Visa</option>
              </select>
              {errors.goal && (
                <p className="text-sm text-red-600">{errors.goal.message}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <Label className="text-lg font-semibold text-gray-900">
                  Budget (USD)
                </Label>
              </div>
              <Input
                type="number"
                placeholder="Enter your budget"
                {...register('budget', { valueAsNumber: true })}
                className="p-3 text-lg"
              />
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <Label className="text-lg font-semibold text-gray-900">
                  Preferred Country
                </Label>
              </div>
              <select
                {...register('country')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any country</option>
                <option value="georgia">Georgia</option>
                <option value="cyprus">Cyprus</option>
                <option value="greece">Greece</option>
                <option value="lebanon">Lebanon</option>
              </select>
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Find My Investment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Properties Analyzed</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-green-600 mb-2">12%</div>
            <div className="text-gray-600">Average ROI</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
}
