import { describe, it, expect } from 'vitest'
import { 
  calculateCashOnCash, 
  calculateSimpleROI, 
  calculateBreakEvenOccupancy,
  calculateAppreciation,
  calculateTotalReturn 
} from './utils'

describe('Investment Calculation Utils', () => {
  describe('calculateCashOnCash', () => {
    it('should calculate cash-on-cash return for leveraged investment', () => {
      const inputs = {
        propertyPrice: 300000,
        downPaymentPercent: 20,
        interestRate: 4.5,
        loanTermYears: 30,
        monthlyRent: 2000
      }

      const result = calculateCashOnCash(inputs)

      expect(result.downPayment).toBe(60000)
      expect(result.loanAmount).toBe(240000)
      expect(result.monthlyPayment).toBeCloseTo(1215.98, 2)
      expect(result.annualRent).toBe(24000)
      expect(result.annualMortgage).toBeCloseTo(14591.76, 2)
      expect(result.netAnnualCashflow).toBeCloseTo(9408.24, 2)
      expect(result.netMonthlyCashflow).toBeCloseTo(784.02, 2)
      expect(result.cashOnCashReturn).toBeCloseTo(15.68, 2)
      expect(result.grossRentalYield).toBe(8)
      expect(result.netRentalYield).toBeCloseTo(3.14, 2)
    })

    it('should handle all-cash purchase (no loan)', () => {
      const inputs = {
        propertyPrice: 300000,
        downPaymentPercent: 100,
        interestRate: 4.5,
        loanTermYears: 30,
        monthlyRent: 2000
      }

      const result = calculateCashOnCash(inputs)

      expect(result.downPayment).toBe(300000)
      expect(result.loanAmount).toBe(0)
      expect(result.monthlyPayment).toBe(0)
      expect(result.annualRent).toBe(24000)
      expect(result.annualMortgage).toBe(0)
      expect(result.netAnnualCashflow).toBe(24000)
      expect(result.netMonthlyCashflow).toBe(2000)
      expect(result.cashOnCashReturn).toBe(8)
      expect(result.grossRentalYield).toBe(8)
      expect(result.netRentalYield).toBe(8)
    })

    it('should handle zero interest rate', () => {
      const inputs = {
        propertyPrice: 300000,
        downPaymentPercent: 20,
        interestRate: 0,
        loanTermYears: 30,
        monthlyRent: 2000
      }

      const result = calculateCashOnCash(inputs)

      expect(result.downPayment).toBe(60000)
      expect(result.loanAmount).toBe(240000)
      expect(result.monthlyPayment).toBe(666.67) // 240000 / (30 * 12)
      expect(result.cashOnCashReturn).toBeCloseTo(20, 2)
    })

    it('should handle negative cashflow', () => {
      const inputs = {
        propertyPrice: 300000,
        downPaymentPercent: 20,
        interestRate: 6,
        loanTermYears: 30,
        monthlyRent: 1000 // Low rent
      }

      const result = calculateCashOnCash(inputs)

      expect(result.netAnnualCashflow).toBeLessThan(0)
      expect(result.cashOnCashReturn).toBeLessThan(0)
    })
  })

  describe('calculateSimpleROI', () => {
    it('should calculate simple ROI correctly', () => {
      const roi = calculateSimpleROI(300000, 24000)
      expect(roi).toBe(8)
    })

    it('should handle zero rent', () => {
      const roi = calculateSimpleROI(300000, 0)
      expect(roi).toBe(0)
    })

    it('should handle zero property price', () => {
      const roi = calculateSimpleROI(0, 24000)
      expect(roi).toBe(Infinity)
    })
  })

  describe('calculateBreakEvenOccupancy', () => {
    it('should calculate break-even occupancy correctly', () => {
      const occupancy = calculateBreakEvenOccupancy(1500, 2000)
      expect(occupancy).toBe(75)
    })

    it('should handle zero rent', () => {
      const occupancy = calculateBreakEvenOccupancy(1500, 0)
      expect(occupancy).toBe(Infinity)
    })

    it('should handle zero payment', () => {
      const occupancy = calculateBreakEvenOccupancy(0, 2000)
      expect(occupancy).toBe(0)
    })
  })

  describe('calculateAppreciation', () => {
    it('should calculate appreciation correctly', () => {
      const appreciation = calculateAppreciation(300000, 3, 10)
      expect(appreciation).toBeCloseTo(402440.13, 2)
    })

    it('should handle zero appreciation', () => {
      const appreciation = calculateAppreciation(300000, 0, 10)
      expect(appreciation).toBe(300000)
    })

    it('should handle zero years', () => {
      const appreciation = calculateAppreciation(300000, 3, 0)
      expect(appreciation).toBe(300000)
    })
  })

  describe('calculateTotalReturn', () => {
    it('should calculate total return correctly', () => {
      const result = calculateTotalReturn(300000, 24000, 3, 10)
      
      expect(result.totalAppreciation).toBeCloseTo(102440.13, 2)
      expect(result.totalRentalIncome).toBe(240000)
      expect(result.totalReturn).toBeCloseTo(342440.13, 2)
      expect(result.annualizedReturn).toBeCloseTo(13.33, 2)
    })

    it('should handle zero appreciation', () => {
      const result = calculateTotalReturn(300000, 24000, 0, 10)
      
      expect(result.totalAppreciation).toBe(0)
      expect(result.totalRentalIncome).toBe(240000)
      expect(result.totalReturn).toBe(240000)
      expect(result.annualizedReturn).toBeCloseTo(7.18, 2)
    })
  })
})
