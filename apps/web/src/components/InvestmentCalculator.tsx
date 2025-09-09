'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Calculator, TrendingUp, DollarSign, Home, PiggyBank, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CalculatorInputs {
  propertyPrice: number
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
  expectedRentalIncome: number
  propertyAppreciation: number
  maintenanceCosts: number
  propertyTaxPercent: number
  insuranceAnnual: number
  vacancyRate: number
}

interface CalculatorResults {
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  monthlyRentalIncome: number
  monthlyCashFlow: number
  annualCashFlow: number
  totalROI: number
  cashOnCashReturn: number
  capRate: number
  breakEvenMonth: number
  tenYearEquity: number
  tenYearAppreciation: number
}

export function InvestmentCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    propertyPrice: 250000,
    downPaymentPercent: 20,
    interestRate: 4.5,
    loanTermYears: 30,
    expectedRentalIncome: 2000,
    propertyAppreciation: 3,
    maintenanceCosts: 200,
    propertyTaxPercent: 1.2,
    insuranceAnnual: 1200,
    vacancyRate: 5,
  })

  const [results, setResults] = useState<CalculatorResults | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const calculateResults = () => {
    const downPayment = inputs.propertyPrice * (inputs.downPaymentPercent / 100)
    const loanAmount = inputs.propertyPrice - downPayment
    const monthlyInterestRate = inputs.interestRate / 100 / 12
    const numberOfPayments = inputs.loanTermYears * 12

    // Calculate monthly mortgage payment
    const monthlyPayment = monthlyInterestRate > 0
      ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : loanAmount / numberOfPayments

    const totalPaid = monthlyPayment * numberOfPayments
    const totalInterest = totalPaid - loanAmount

    // Calculate rental income accounting for vacancy
    const effectiveRentalIncome = inputs.expectedRentalIncome * (1 - inputs.vacancyRate / 100)
    
    // Calculate monthly expenses
    const monthlyPropertyTax = (inputs.propertyPrice * inputs.propertyTaxPercent / 100) / 12
    const monthlyInsurance = inputs.insuranceAnnual / 12
    const totalMonthlyExpenses = monthlyPayment + monthlyPropertyTax + monthlyInsurance + inputs.maintenanceCosts

    // Calculate cash flow
    const monthlyCashFlow = effectiveRentalIncome - totalMonthlyExpenses
    const annualCashFlow = monthlyCashFlow * 12

    // Calculate returns
    const annualRentalIncome = effectiveRentalIncome * 12
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100
    const capRate = ((annualRentalIncome - (inputs.maintenanceCosts * 12) - (inputs.propertyTaxPercent / 100 * inputs.propertyPrice) - inputs.insuranceAnnual) / inputs.propertyPrice) * 100

    // Calculate break-even month
    const breakEvenMonth = monthlyCashFlow > 0 ? Math.ceil(downPayment / monthlyCashFlow) : -1

    // Calculate 10-year projections
    const tenYearAppreciation = inputs.propertyPrice * Math.pow(1 + inputs.propertyAppreciation / 100, 10) - inputs.propertyPrice
    
    // Calculate equity after 10 years
    const monthsIn10Years = 120
    let remainingBalance = loanAmount
    for (let i = 0; i < monthsIn10Years && i < numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance -= principalPayment
    }
    const tenYearEquity = inputs.propertyPrice + tenYearAppreciation - remainingBalance

    // Calculate total ROI
    const totalInvestmentReturn = annualCashFlow * 10 + tenYearEquity - downPayment
    const totalROI = (totalInvestmentReturn / downPayment) * 100

    setResults({
      downPayment,
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalPaid,
      monthlyRentalIncome: effectiveRentalIncome,
      monthlyCashFlow,
      annualCashFlow,
      totalROI,
      cashOnCashReturn,
      capRate,
      breakEvenMonth,
      tenYearEquity,
      tenYearAppreciation,
    })
  }

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const updateInput = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Investment Calculator
          </CardTitle>
          <CardDescription>
            Analyze the potential returns of your real estate investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Property Price</Label>
            <Input
              id="price"
              type="number"
              value={inputs.propertyPrice}
              onChange={(e) => updateInput('propertyPrice', Number(e.target.value))}
              min={0}
            />
            <Slider
              value={[inputs.propertyPrice]}
              onValueChange={([v]) => updateInput('propertyPrice', v)}
              min={50000}
              max={2000000}
              step={10000}
              className="mt-2"
            />
          </div>

          {/* Down Payment */}
          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment (%)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPaymentPercent}
                onChange={(e) => updateInput('downPaymentPercent', Number(e.target.value))}
                min={0}
                max={100}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">
                {results && formatCurrency(results.downPayment)}
              </span>
            </div>
            <Slider
              value={[inputs.downPaymentPercent]}
              onValueChange={([v]) => updateInput('downPaymentPercent', v)}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interest">Interest Rate (%)</Label>
            <Input
              id="interest"
              type="number"
              value={inputs.interestRate}
              onChange={(e) => updateInput('interestRate', Number(e.target.value))}
              min={0}
              max={20}
              step={0.1}
            />
            <Slider
              value={[inputs.interestRate]}
              onValueChange={([v]) => updateInput('interestRate', v)}
              min={0}
              max={20}
              step={0.1}
              className="mt-2"
            />
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (Years)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={inputs.loanTermYears}
              onChange={(e) => updateInput('loanTermYears', Number(e.target.value))}
              min={1}
              max={40}
            />
            <Slider
              value={[inputs.loanTermYears]}
              onValueChange={([v]) => updateInput('loanTermYears', v)}
              min={5}
              max={40}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Expected Rental Income */}
          <div className="space-y-2">
            <Label htmlFor="rental">Expected Monthly Rental Income</Label>
            <Input
              id="rental"
              type="number"
              value={inputs.expectedRentalIncome}
              onChange={(e) => updateInput('expectedRentalIncome', Number(e.target.value))}
              min={0}
            />
          </div>

          {/* Advanced Options Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="appreciation">Annual Appreciation (%)</Label>
                <Input
                  id="appreciation"
                  type="number"
                  value={inputs.propertyAppreciation}
                  onChange={(e) => updateInput('propertyAppreciation', Number(e.target.value))}
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance">Monthly Maintenance Costs</Label>
                <Input
                  id="maintenance"
                  type="number"
                  value={inputs.maintenanceCosts}
                  onChange={(e) => updateInput('maintenanceCosts', Number(e.target.value))}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyTax">Property Tax (%/year)</Label>
                <Input
                  id="propertyTax"
                  type="number"
                  value={inputs.propertyTaxPercent}
                  onChange={(e) => updateInput('propertyTaxPercent', Number(e.target.value))}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance">Annual Insurance</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={inputs.insuranceAnnual}
                  onChange={(e) => updateInput('insuranceAnnual', Number(e.target.value))}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vacancy">Vacancy Rate (%)</Label>
                <Input
                  id="vacancy"
                  type="number"
                  value={inputs.vacancyRate}
                  onChange={(e) => updateInput('vacancyRate', Number(e.target.value))}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Investment Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Cash Flow</p>
                <p className={`text-2xl font-bold ${results.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.monthlyCashFlow)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cash on Cash Return</p>
                <p className="text-2xl font-bold text-blue-600">{results.cashOnCashReturn.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cap Rate</p>
                <p className="text-2xl font-bold text-purple-600">{results.capRate.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Down Payment</span>
                <span className="font-medium">{formatCurrency(results.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest Paid</span>
                <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount Paid</span>
                <span className="font-medium">{formatCurrency(results.totalPaid)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-muted-foreground">Annual Cash Flow</span>
                <span className={`font-bold ${results.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.annualCashFlow)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 10-Year Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                10-Year Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property Appreciation</span>
                <span className="font-medium text-green-600">+{formatCurrency(results.tenYearAppreciation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Equity Built</span>
                <span className="font-medium">{formatCurrency(results.tenYearEquity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Break-even Period</span>
                <span className="font-medium">
                  {results.breakEvenMonth > 0 
                    ? `${Math.floor(results.breakEvenMonth / 12)} years ${results.breakEvenMonth % 12} months`
                    : 'Cash flow negative'}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-muted-foreground font-semibold">Total ROI (10 years)</span>
                <span className="font-bold text-2xl text-green-600">{results.totalROI.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Investment Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                With an initial investment of <strong>{formatCurrency(results.downPayment)}</strong>, 
                this property could generate a monthly cash flow of <strong className={results.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(results.monthlyCashFlow)}
                </strong> and achieve a total return on investment of <strong className="text-blue-600">{results.totalROI.toFixed(1)}%</strong> over 10 years.
                {results.breakEvenMonth > 0 && (
                  <> Your initial investment would be recovered in approximately <strong>{Math.floor(results.breakEvenMonth / 12)} years</strong>.</>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
