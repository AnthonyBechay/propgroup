'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(propertyId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to favorite properties' }
    }

    // Check if favorite already exists
    const existingFavorite = await prisma.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    })

    if (existingFavorite) {
      // Remove favorite
      await prisma.favoriteProperty.delete({
        where: {
          id: existingFavorite.id,
        },
      })

      revalidatePath('/portal/favorites')
      return { success: true, isFavorited: false }
    } else {
      // Add favorite
      await prisma.favoriteProperty.create({
        data: {
          userId: user.id,
          propertyId,
        },
      })

      revalidatePath('/portal/favorites')
      return { success: true, isFavorited: true }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: 'Failed to update favorite status' }
  }
}

export async function getFavoriteStatus(propertyId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { isFavorited: false }
    }

    const favorite = await prisma.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: user.id,
          propertyId,
        },
      },
    })

    return { isFavorited: !!favorite }
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return { isFavorited: false }
  }
}

export async function getUserFavorites() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to view favorites' }
    }

    const favorites = await prisma.favoriteProperty.findMany({
      where: {
        userId: user.id,
      },
      include: {
        property: {
          include: {
            investmentData: true,
            developer: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { 
      success: true, 
      favorites: favorites.map((f: any) => f.property) 
    }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return { success: false, error: 'Failed to fetch favorites' }
  }
}
