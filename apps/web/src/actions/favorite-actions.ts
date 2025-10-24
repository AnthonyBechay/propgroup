'use server'

import { apiClient } from '@/lib/api/client'
import { getCurrentUser } from '@/lib/auth/rbac'
import { revalidatePath } from 'next/cache'
import { ApiResponse } from '@/lib/types/api'

export async function toggleFavorite(propertyId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to favorite properties' }
    }

    // Check current favorite status
    const statusResponse = await apiClient.checkFavorite(propertyId) as ApiResponse<{ isFavorited: boolean }>
    
    if (statusResponse.data?.isFavorited) {
      // Remove favorite
      const response = await apiClient.removeFavorite(propertyId) as ApiResponse
      
      if (response.success) {
        revalidatePath('/portal/favorites')
        return { success: true, isFavorited: false }
      } else {
        return { success: false, error: response.message || 'Failed to remove favorite' }
      }
    } else {
      // Add favorite
      const response = await apiClient.addFavorite(propertyId) as ApiResponse
      
      if (response.success) {
        revalidatePath('/portal/favorites')
        return { success: true, isFavorited: true }
      } else {
        return { success: false, error: response.message || 'Failed to add favorite' }
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: 'Failed to update favorite status' }
  }
}

export async function getFavoriteStatus(propertyId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { isFavorited: false }
    }

    const response = await apiClient.checkFavorite(propertyId) as ApiResponse<{ isFavorited: boolean }>
    return { isFavorited: response.data?.isFavorited || false }
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return { isFavorited: false }
  }
}

export async function getUserFavorites() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to view favorites' }
    }

    const response = await apiClient.getFavorites() as ApiResponse<{ property: any }[]>
    
    if (response.success) {
      return { 
        success: true, 
        favorites: response.data?.map((f: any) => f.property) || [] 
      }
    } else {
      return { success: false, error: response.message || 'Failed to fetch favorites' }
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return { success: false, error: 'Failed to fetch favorites' }
  }
}