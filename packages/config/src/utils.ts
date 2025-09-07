/**
 * Investment calculation utilities
 */

export interface InvestmentCalculationInputs {
  propertyPrice: number
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
  monthlyRent: number
}

export interface InvestmentCalculationResults {
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  annualRent: number
  annualMortgage: number
  netAnnualCashflow: number
  netMonthlyCashflow: number
  cashOnCashReturn: number
  grossRentalYield: number
  netRentalYield: number
}

/**
 * Calculate cash-on-cash return for a real estate investment
 */
export function calculateCashOnCash(inputs: InvestmentCalculationInputs): InvestmentCalculationResults {
  const {
    propertyPrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    monthlyRent
  } = inputs

  // Basic calculations
  const downPayment = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = propertyPrice - downPayment
  const annualRent = monthlyRent * 12

  // Monthly mortgage payment calculation
  const monthlyRate = interestRate / 100 / 12
  const totalPayments = loanTermYears * 12
  
  let monthlyPayment = 0
  if (loanAmount > 0 && monthlyRate > 0) {
    monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
  }

  // Annual calculations
  const annualMortgage = monthlyPayment * 12
  const netAnnualCashflow = annualRent - annualMortgage
  const netMonthlyCashflow = netAnnualCashflow / 12

  // ROI calculations
  const cashOnCashReturn = downPayment > 0 ? (netAnnualCashflow / downPayment) * 100 : 0
  const grossRentalYield = (annualRent / propertyPrice) * 100
  const netRentalYield = (netAnnualCashflow / propertyPrice) * 100

  return {
    downPayment,
    loanAmount,
    monthlyPayment,
    annualRent,
    annualMortgage,
    netAnnualCashflow,
    netMonthlyCashflow,
    cashOnCashReturn,
    grossRentalYield,
    netRentalYield
  }
}

/**
 * Calculate simple ROI without leverage
 */
export function calculateSimpleROI(propertyPrice: number, annualRent: number): number {
  return (annualRent / propertyPrice) * 100
}

/**
 * Calculate break-even occupancy rate
 */
export function calculateBreakEvenOccupancy(
  monthlyPayment: number,
  monthlyRent: number
): number {
  return monthlyRent > 0 ? (monthlyPayment / monthlyRent) * 100 : 0
}

/**
 * Calculate property appreciation value over time
 */
export function calculateAppreciation(
  propertyPrice: number,
  annualAppreciationRate: number,
  years: number
): number {
  return propertyPrice * Math.pow(1 + annualAppreciationRate / 100, years)
}

/**
 * Calculate total return including appreciation
 */
export function calculateTotalReturn(
  propertyPrice: number,
  annualRent: number,
  annualAppreciationRate: number,
  years: number
): {
  totalAppreciation: number
  totalRentalIncome: number
  totalReturn: number
  annualizedReturn: number
} {
  const totalAppreciation = calculateAppreciation(propertyPrice, annualAppreciationRate, years) - propertyPrice
  const totalRentalIncome = annualRent * years
  const totalReturn = totalAppreciation + totalRentalIncome
  const annualizedReturn = (Math.pow(totalReturn / propertyPrice + 1, 1 / years) - 1) * 100

  return {
    totalAppreciation,
    totalRentalIncome,
    totalReturn,
    annualizedReturn
  }
}
