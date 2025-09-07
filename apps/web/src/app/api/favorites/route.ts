import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const favoriteSchema = z.object({
  propertyId: z.string().cuid('Invalid property ID'),
  action: z.enum(['add', 'remove'], {
    errorMap: () => ({ message: 'Action must be either "add" or "remove"' })
  })
})

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to manage favorites'
        },
        { status: 401 }
      )
    }

    // Parse and validate the request body
    const body = await request.json()
    const validation = favoriteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { propertyId, action } = validation.data

    // Verify the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        {
          error: 'Property not found',
          message: 'The specified property does not exist'
        },
        { status: 404 }
      )
    }

    if (action === 'add') {
      // Check if already favorited
      const existingFavorite = await prisma.favoriteProperty.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId: propertyId
          }
        }
      })

      if (existingFavorite) {
        return NextResponse.json(
          {
            success: true,
            message: 'Property already in favorites',
            action: 'already_favorited'
          },
          { status: 200 }
        )
      }

      // Add to favorites
      await prisma.favoriteProperty.create({
        data: {
          userId: user.id,
          propertyId: propertyId
        }
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Property added to favorites',
          action: 'added'
        },
        { status: 200 }
      )
    } else {
      // Remove from favorites
      const favorite = await prisma.favoriteProperty.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId: propertyId
          }
        }
      })

      if (!favorite) {
        return NextResponse.json(
          {
            success: true,
            message: 'Property not in favorites',
            action: 'not_favorited'
          },
          { status: 200 }
        )
      }

      await prisma.favoriteProperty.delete({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId: propertyId
          }
        }
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Property removed from favorites',
          action: 'removed'
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while managing favorites'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    },
    { status: 405 }
  )
}
