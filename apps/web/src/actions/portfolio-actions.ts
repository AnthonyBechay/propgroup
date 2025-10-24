'use server'

import { apiClient } from '@/lib/api/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ApiResponse, OwnedProperty } from '@/lib/types/api'

const ownedPropertySchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  customName: z.string().min(1, 'Property name is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  initialMortgage: z.number().optional().nullable(),
  currentRent: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  propertyId: z.string().optional().nullable(),
})

export async function addOwnedProperty(data: z.infer<typeof ownedPropertySchema>) {
  try {
    // Validate the input
    const validatedData = ownedPropertySchema.parse(data)

    // Create the owned property using the API client
    const response = await apiClient.addToPortfolio({
      customName: validatedData.customName,
      purchasePrice: validatedData.purchasePrice,
      purchaseDate: validatedData.purchaseDate,
      initialMortgage: validatedData.initialMortgage ?? undefined,
      currentRent: validatedData.currentRent ?? undefined,
      notes: validatedData.notes ?? undefined,
      propertyId: validatedData.propertyId ?? undefined,
    }) as ApiResponse<OwnedProperty>

    if (response.success) {
      // Revalidate the portfolio page
      revalidatePath('/portal/portfolio')
      return { success: true, ownedProperty: response.data }
    } else {
      throw new Error(response.message || 'Failed to add property to portfolio')
    }
  } catch (error) {
    console.error('Error adding owned property:', error)
    throw new Error('Failed to add property to portfolio')
  }
}

export async function updateOwnedProperty(id: string, data: Partial<z.infer<typeof ownedPropertySchema>>) {
  try {
    const validatedData = ownedPropertySchema.partial().parse(data)

    // Update the owned property using the API client
    const response = await apiClient.updatePortfolioItem(id, {
      customName: validatedData.customName,
      purchasePrice: validatedData.purchasePrice,
      purchaseDate: validatedData.purchaseDate,
      initialMortgage: validatedData.initialMortgage ?? undefined,
      currentRent: validatedData.currentRent ?? undefined,
      notes: validatedData.notes ?? undefined,
      propertyId: validatedData.propertyId ?? undefined,
    }) as ApiResponse<OwnedProperty>

    if (response.success) {
      revalidatePath('/portal/portfolio')
      return { success: true, ownedProperty: response.data }
    } else {
      throw new Error(response.message || 'Failed to update property in portfolio')
    }
  } catch (error) {
    console.error('Error updating owned property:', error)
    throw new Error('Failed to update property in portfolio')
  }
}

export async function deleteOwnedProperty(id: string) {
  try {
    // Delete the owned property using the API client
    const response = await apiClient.removeFromPortfolio(id) as ApiResponse

    if (response.success) {
      revalidatePath('/portal/portfolio')
      return { success: true }
    } else {
      throw new Error(response.message || 'Failed to delete property from portfolio')
    }
  } catch (error) {
    console.error('Error deleting owned property:', error)
    throw new Error('Failed to delete property from portfolio')
  }
}
