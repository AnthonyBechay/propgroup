// Convenient type exports
import type { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T]

// Specific table types
export type Profile = Tables<'profiles'>
export type Property = Tables<'properties'>
export type PropertyAnalytics = Tables<'property_analytics'>
export type Favorite = Tables<'favorites'>
export type Inquiry = Tables<'inquiries'>
export type Transaction = Tables<'transactions'>
export type Document = Tables<'documents'>
export type Appointment = Tables<'appointments'>
export type Notification = Tables<'notifications'>
export type SearchHistory = Tables<'search_history'>

// Insert types
export type InsertProfile = InsertTables<'profiles'>
export type InsertProperty = InsertTables<'properties'>
export type InsertPropertyAnalytics = InsertTables<'property_analytics'>
export type InsertFavorite = InsertTables<'favorites'>
export type InsertInquiry = InsertTables<'inquiries'>
export type InsertTransaction = InsertTables<'transactions'>
export type InsertDocument = InsertTables<'documents'>
export type InsertAppointment = InsertTables<'appointments'>
export type InsertNotification = InsertTables<'notifications'>
export type InsertSearchHistory = InsertTables<'search_history'>

// Update types
export type UpdateProfile = UpdateTables<'profiles'>
export type UpdateProperty = UpdateTables<'properties'>
export type UpdatePropertyAnalytics = UpdateTables<'property_analytics'>
export type UpdateFavorite = UpdateTables<'favorites'>
export type UpdateInquiry = UpdateTables<'inquiries'>
export type UpdateTransaction = UpdateTables<'transactions'>
export type UpdateDocument = UpdateTables<'documents'>
export type UpdateAppointment = UpdateTables<'appointments'>
export type UpdateNotification = UpdateTables<'notifications'>
export type UpdateSearchHistory = UpdateTables<'search_history'>

// Enum types
export type UserRole = Enums<'user_role'>
export type PropertyStatus = Enums<'property_status'>
export type PropertyType = Enums<'property_type'>
export type TransactionType = Enums<'transaction_type'>
export type PaymentStatus = Enums<'payment_status'>
export type DocumentType = Enums<'document_type'>

// Extended types with relations
export interface PropertyWithAnalytics extends Property {
  property_analytics?: PropertyAnalytics[]
  favorites?: Favorite[]
  is_favorited?: boolean
}

export interface PropertyWithDetails extends PropertyWithAnalytics {
  owner?: Profile
  agent?: Profile
  inquiries?: Inquiry[]
  appointments?: Appointment[]
  documents?: Document[]
}

export interface TransactionWithDetails extends Transaction {
  property?: Property
  buyer?: Profile
  seller?: Profile
  agent?: Profile
  documents?: Document[]
}

export interface InquiryWithDetails extends Inquiry {
  property?: Property
  user?: Profile
  agent?: Profile
}

export interface AppointmentWithDetails extends Appointment {
  property?: Property
  user?: Profile
  agent?: Profile
}

// Filter types
export interface PropertyFilters {
  propertyType?: PropertyType
  status?: PropertyStatus
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minSize?: number
  maxSize?: number
  amenities?: string[]
  city?: string
  state?: string
  lat?: number
  lng?: number
  radius?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams extends PropertyFilters, PaginationParams {}

// Response types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Form types
export interface PropertyFormData {
  title: string
  description: string
  property_type: PropertyType
  status: PropertyStatus
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  price?: number
  rental_price?: number
  size_sqft?: number
  bedrooms?: number
  bathrooms?: number
  year_built?: number
  lot_size?: number
  features?: Record<string, any>
  amenities?: string[]
  images?: Array<{ url: string; caption?: string }>
  virtual_tour_url?: string
}

export interface ProfileFormData {
  full_name?: string
  phone?: string
  company_name?: string
  license_number?: string
  bio?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  preferences?: Record<string, any>
}

export interface InquiryFormData {
  property_id: string
  message: string
  phone?: string
  email?: string
  preferred_contact_method?: 'phone' | 'email' | 'both'
}

export interface AppointmentFormData {
  property_id: string
  appointment_date: string
  duration_minutes?: number
  type?: 'viewing' | 'inspection' | 'meeting'
  notes?: string
}
