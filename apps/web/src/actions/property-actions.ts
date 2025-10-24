'use server'

import { apiClient } from '@/lib/api/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ApiResponse, Property } from '@/lib/types/api'

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(3, 'Currency is required'),
  propertyType: z.enum(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'STUDIO', 'DUPLEX', 'LAND', 'COMMERCIAL', 'OFFICE']),
  bedrooms: z.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  area: z.number().min(0, 'Area must be positive'),
  country: z.enum(['GEORGIA', 'CYPRUS', 'GREECE', 'LEBANON']),
  status: z.enum(['OFF_PLAN', 'NEW_BUILD', 'RESALE']),
  isGoldenVisaEligible: z.boolean(),
  developerId: z.string().optional(),
  locationGuideId: z.string().optional(),
  // Investment data
  expectedROI: z.number().optional(),
  rentalYield: z.number().optional(),
  capitalGrowth: z.number().optional(),
  minInvestment: z.number().optional(),
  maxInvestment: z.number().optional(),
  paymentPlan: z.string().optional(),
  completionDate: z.string().optional(),
  // Additional fields
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  amenities: z.string().optional(),
  nearbyFacilities: z.string().optional(),
})

export async function createProperty(data: z.infer<typeof propertySchema>) {
  try {
    // Validate the input
    const validatedData = propertySchema.parse(data)

    // Create the property using the API client
    const response = await apiClient.createProperty(validatedData) as ApiResponse<Property>

    if (response.success) {
      // Revalidate the properties page
      revalidatePath('/admin/properties')
      revalidatePath('/properties')

      return { success: true, property: response.data }
    } else {
      throw new Error(response.message || 'Failed to create property')
    }
  } catch (error) {
    console.error('Error creating property:', error)
    throw new Error('Failed to create property')
  }
}

export async function updateProperty(id: string, data: Partial<z.infer<typeof propertySchema>>) {
  try {
    const validatedData = propertySchema.partial().parse(data)

    // Update the property using the API client
    const response = await apiClient.updateProperty(id, validatedData) as ApiResponse<Property>

    if (response.success) {
      revalidatePath('/admin/properties')
      revalidatePath('/properties')
      revalidatePath(`/property/${id}`)

      return { success: true, property: response.data }
    } else {
      throw new Error(response.message || 'Failed to update property')
    }
  } catch (error) {
    console.error('Error updating property:', error)
    throw new Error('Failed to update property')
  }
}

export async function deleteProperty(id: string) {
  try {
    // Delete the property using the API client
    const response = await apiClient.deleteProperty(id) as ApiResponse

    if (response.success) {
      revalidatePath('/admin/properties')
      revalidatePath('/properties')

      return { success: true }
    } else {
      throw new Error(response.message || 'Failed to delete property')
    }
  } catch (error) {
    console.error('Error deleting property:', error)
    throw new Error('Failed to delete property')
  }
}
