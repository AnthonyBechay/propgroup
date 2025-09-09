import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(
  num: number,
  decimals: number = 0
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function calculateROI(
  initialInvestment: number,
  finalValue: number,
  cashFlow: number = 0
): number {
  return ((finalValue - initialInvestment + cashFlow) / initialInvestment) * 100
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = years * 12
  
  if (monthlyRate === 0) {
    return principal / numPayments
  }
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  )
}

export function calculateCapRate(
  netOperatingIncome: number,
  propertyValue: number
): number {
  return (netOperatingIncome / propertyValue) * 100
}

export function calculateCashOnCashReturn(
  annualCashFlow: number,
  totalCashInvested: number
): number {
  return (annualCashFlow / totalCashInvested) * 100
}

export function getPropertyStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'OFF_PLAN': 'bg-purple-100 text-purple-800',
    'NEW_BUILD': 'bg-green-100 text-green-800',
    'RESALE': 'bg-blue-100 text-blue-800',
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    'georgia': '🇬🇪',
    'cyprus': '🇨🇾',
    'greece': '🇬🇷',
    'lebanon': '🇱🇧',
  }
  return flags[country.toLowerCase()] || '🏴'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  // Basic phone validation - adjust regex as needed for specific countries
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

export function generateMetaDescription(
  title: string,
  description: string,
  maxLength: number = 160
): string {
  const combined = `${title} - ${description}`
  if (combined.length <= maxLength) return combined
  return truncate(description, maxLength - title.length - 3)
}

export function parseQueryParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  return searchParams.toString()
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0) || ''
  const last = lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  compound: number = 12
): number {
  return principal * Math.pow(1 + rate / (100 * compound), compound * time)
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}
