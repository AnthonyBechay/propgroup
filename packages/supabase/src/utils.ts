// Utility functions for Supabase operations
import { supabase } from './index'
import type { PropertyFormData, Property } from './types/tables'

// Format currency
export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d)
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - d.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  const diffInDays = diffInHours / 24

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (diffInDays < 30) {
    const days = Math.floor(diffInDays)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else {
    return formatDate(d)
  }
}

// Calculate ROI
export function calculateROI(
  purchasePrice: number,
  monthlyRent: number,
  annualExpenses: number = 0
): number {
  if (purchasePrice <= 0) return 0
  const annualIncome = monthlyRent * 12
  const netIncome = annualIncome - annualExpenses
  return (netIncome / purchasePrice) * 100
}

// Calculate mortgage payment
export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = years * 12
  
  if (monthlyRate === 0) {
    return principal / numPayments
  }
  
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  
  return payment
}

// Generate property slug
export function generatePropertySlug(property: Property): string {
  const title = property.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return `${title}-${property.id.slice(0, 8)}`
}

// Parse address
export function parseAddress(address: any): string {
  if (!address) return ''
  
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zip) parts.push(address.zip)
  
  return parts.join(', ')
}

// Upload property images
export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<Array<{ url: string; caption?: string }>> {
  const uploadedImages = []
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)
      
      uploadedImages.push({
        url: publicUrl,
        caption: file.name
      })
    }
  }
  
  return uploadedImages
}

// Delete property images
export async function deletePropertyImages(urls: string[]): Promise<void> {
  const paths = urls.map(url => {
    const parts = url.split('/property-images/')
    return parts[1] || ''
  }).filter(Boolean)
  
  if (paths.length > 0) {
    await supabase.storage
      .from('property-images')
      .remove(paths)
  }
}

// Validate property data
export function validatePropertyData(data: PropertyFormData): string[] {
  const errors: string[] = []
  
  if (!data.title || data.title.length < 3) {
    errors.push('Title must be at least 3 characters long')
  }
  
  if (!data.property_type) {
    errors.push('Property type is required')
  }
  
  if (!data.address || !data.address.street || !data.address.city) {
    errors.push('Street address and city are required')
  }
  
  if (data.price && data.price < 0) {
    errors.push('Price cannot be negative')
  }
  
  if (data.size_sqft && data.size_sqft < 0) {
    errors.push('Size cannot be negative')
  }
  
  if (data.bedrooms && data.bedrooms < 0) {
    errors.push('Bedrooms cannot be negative')
  }
  
  if (data.bathrooms && data.bathrooms < 0) {
    errors.push('Bathrooms cannot be negative')
  }
  
  return errors
}

// Check if user can edit property
export async function canEditProperty(
  propertyId: string,
  userId: string
): Promise<boolean> {
  const { data: property } = await supabase
    .from('properties')
    .select('agent_id, owner_id')
    .eq('id', propertyId)
    .single()
  
  if (!property) return false
  
  // Check if user is the agent or owner
  if (property.agent_id === userId || property.owner_id === userId) {
    return true
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return profile?.role === 'admin'
}

// Generate random color for avatar
export function generateAvatarColor(name: string): string {
  const colors = [
    '#F87171', '#FB923C', '#FBBF24', '#FDE047',
    '#A3E635', '#4ADE80', '#34D399', '#2DD4BF',
    '#22D3EE', '#38BDF8', '#60A5FA', '#818CF8',
    '#A78BFA', '#C084FC', '#E879F9', '#F472B6'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return ''
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Debounce function
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

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      document.body.removeChild(textarea)
      return false
    }
  }
}

// Share property
export async function shareProperty(property: Property): Promise<void> {
  const url = `${window.location.origin}/properties/${generatePropertySlug(property)}`
  const text = `Check out this property: ${property.title}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: property.title,
        text,
        url
      })
      
      // Track share event
      await supabase.functions.invoke('analytics-track', {
        body: {
          eventType: 'share',
          propertyId: property.id
        }
      })
    } catch (error) {
      // User cancelled or error occurred
      console.error('Share failed:', error)
    }
  } else {
    // Fallback to copy to clipboard
    const success = await copyToClipboard(url)
    if (success) {
      // Track share event
      await supabase.functions.invoke('analytics-track', {
        body: {
          eventType: 'share',
          propertyId: property.id
        }
      })
    }
  }
}
