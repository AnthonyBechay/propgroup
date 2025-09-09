import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for query parameters
const querySchema = z.object({
  country: z.enum(['GEORGIA', 'CYPRUS', 'GREECE', 'LEBANON']).optional(),
  status: z.enum(['OFF_PLAN', 'NEW_BUILD', 'RESALE']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  minArea: z.coerce.number().min(0).optional(),
  maxArea: z.coerce.number().min(0).optional(),
  isGoldenVisaEligible: z.coerce.boolean().optional(),
  sortBy: z.enum(['price', 'createdAt', 'expectedROI', 'area']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validate query parameters
    const validatedParams = querySchema.parse(queryParams)
    
    const {
      country,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      isGoldenVisaEligible,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      search,
    } = validatedParams

    // Build where clause
    const where: any = {}
    
    if (country) where.country = country
    if (status) where.status = status
    if (isGoldenVisaEligible !== undefined) where.isGoldenVisaEligible = isGoldenVisaEligible
    
    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    
    // Bedrooms and bathrooms
    if (bedrooms !== undefined) where.bedrooms = { gte: bedrooms }
    if (bathrooms !== undefined) where.bathrooms = { gte: bathrooms }
    
    // Area range
    if (minArea !== undefined || maxArea !== undefined) {
      where.area = {}
      if (minArea !== undefined) where.area.gte = minArea
      if (maxArea !== undefined) where.area.lte = maxArea
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { 
          developer: { 
            name: { contains: search, mode: 'insensitive' } 
          } 
        },
        { 
          locationGuide: { 
            title: { contains: search, mode: 'insensitive' } 
          } 
        },
      ]
    }

    // Build orderBy clause
    let orderBy: any = {}
    if (sortBy === 'expectedROI') {
      orderBy = {
        investmentData: {
          expectedROI: sortOrder
        }
      }
    } else {
      orderBy[sortBy] = sortOrder
    }

    // Execute queries in parallel
    const [properties, total] = await Promise.all([
      // Get paginated properties
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          investmentData: {
            select: {
              id: true,
              expectedROI: true,
              rentalYield: true,
              capitalGrowth: true,
              paymentPlan: true,
              completionDate: true,
            }
          },
          developer: {
            select: {
              id: true,
              name: true,
              website: true,
            }
          },
          locationGuide: {
            select: {
              id: true,
              title: true,
              country: true,
            }
          },
          _count: {
            select: {
              favoriteProperties: true,
              propertyInquiries: true,
            }
          }
        },
      }),
      
      // Get total count
      prisma.property.count({ where }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    // Format response
    const response = {
      success: true,
      data: {
        properties,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      },
      timestamp: new Date().toISOString(),
    }

    // Set cache headers for better performance
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    // Handle database errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch properties',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
