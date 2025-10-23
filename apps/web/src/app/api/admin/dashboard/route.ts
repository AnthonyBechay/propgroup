import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth/verify'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin role
    if (authResult.user.role !== 'ADMIN' && authResult.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Fetch dashboard statistics
    const [
      totalProperties,
      totalUsers,
      totalFavorites,
      totalInquiries,
      recentProperties,
      recentUsers
    ] = await Promise.all([
      prisma.property.count(),
      prisma.user.count(),
      prisma.favoriteProperty.count(),
      prisma.propertyInquiry.count(),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          developer: true,
          investmentData: true
        }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return NextResponse.json({
      stats: {
        totalProperties,
        totalUsers,
        totalFavorites,
        totalInquiries,
      },
      recentProperties,
      recentUsers,
    })
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
