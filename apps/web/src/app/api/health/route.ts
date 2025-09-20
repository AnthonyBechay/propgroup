import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Basic health check without database dependency
    const basicHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    }

    // Try database connection if available
    try {
      await prisma.$queryRaw`SELECT 1`
      
      // Get basic stats
      const [propertyCount, userCount] = await Promise.all([
        prisma.property.count(),
        prisma.user.count(),
      ])
      
      return NextResponse.json({
        ...basicHealth,
        database: 'connected',
        stats: {
          properties: propertyCount,
          users: userCount,
        },
      })
    } catch (dbError) {
      console.warn('Database not available, returning basic health check:', dbError)
      
      return NextResponse.json({
        ...basicHealth,
        database: 'disconnected',
        warning: 'Database connection failed, but app is running',
      })
    }
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
