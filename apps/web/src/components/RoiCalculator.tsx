'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { investmentCalculatorSchema, calculateCashOnCash } from '@propgroup/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, DollarSign, Calculator } from 'lucide-react'

interface RoiCalculatorProps {
  propertyPrice: number
  estimatedRent: number
}

type CalculatorFormData = {
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
}

export function RoiCalculator({ propertyPrice, estimatedRent }: RoiCalculatorProps) {
  const { register, control, formState: { errors } } = useForm<CalculatorFormData>({
    resolver: zodResolver(investmentCalculatorSchema),
    defaultValues: {
      downPaymentPercent: 20,
      interestRate: 4.5,
      loanTermYears: 30,
    },
  })

  // Watch form values for real-time calculations
  const watchedValues = useWatch({
    control,
    name: ['downPaymentPercent', 'interestRate', 'loanTermYears']
  })

  const [downPaymentPercent, interestRate, loanTermYears] = watchedValues

  // Calculate investment metrics using centralized utils
  const calculationResult = calculateCashOnCash({
    propertyPrice,
    downPaymentPercent: downPaymentPercent || 0,
    interestRate: interestRate || 0,
    loanTermYears: loanTermYears || 0,
    monthlyRent: estimatedRent
  })

  const {
    downPayment,
    loanAmount,
    monthlyPayment,
    annualRent,
    netMonthlyCashflow,
    cashOnCashReturn,
    grossRentalYield,
    netRentalYield
  } = calculationResult

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          ROI Calculator
        </h3>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Down Payment */}
          <div className="space-y-2">
            <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
            <Input
              id="downPaymentPercent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...register('downPaymentPercent', { valueAsNumber: true })}
              className="text-lg"
            />
            {errors.downPaymentPercent && (
              <p className="text-sm text-red-600">{errors.downPaymentPercent.message}</p>
            )}
            <div className="text-sm text-gray-600">
              ${downPayment.toLocaleString()}
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              min="0"
              max="30"
              {...register('interestRate', { valueAsNumber: true })}
              className="text-lg"
            />
            {errors.interestRate && (
              <p className="text-sm text-red-600">{errors.interestRate.message}</p>
            )}
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <Label htmlFor="loanTermYears">Loan Term (Years)</Label>
            <Input
              id="loanTermYears"
              type="number"
              min="1"
              max="50"
              {...register('loanTermYears', { valueAsNumber: true })}
              className="text-lg"
            />
            {errors.loanTermYears && (
              <p className="text-sm text-red-600">{errors.loanTermYears.message}</p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
          {/* Monthly Cashflow */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Monthly Cashflow</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${netMonthlyCashflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-green-700">
              {netMonthlyCashflow >= 0 ? 'Positive' : 'Negative'} cashflow
            </div>
          </div>

          {/* Cash-on-Cash Return */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Cash-on-Cash Return</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {cashOnCashReturn.toFixed(1)}%
            </div>
            <div className="text-sm text-blue-700">
              Annual return on investment
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {grossRentalYield.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Gross Rental Yield</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {netRentalYield.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Net Rental Yield</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              ${loanAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Loan Amount</div>
          </div>
        </div>
      </form>
    </div>
  )
}
