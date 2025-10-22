import { getCurrentUser } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
  TrendingUp, 
  Home, 
  Calculator, 
  Heart, 
  FileText, 
  Users,
  DollarSign,
  MapPin,
  BarChart3,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'
import { DashboardClient } from './DashboardClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  // Check if user is authenticated
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect('/auth/login?next=/portal/dashboard')
  }

  // Fetch real data from database
  const [
    totalProperties,
    totalFavorites,
    totalInquiries,
    recentProperties,
    marketTrends
  ] = await Promise.all([
    prisma.property.count(),
    prisma.favoriteProperty.count(),
    prisma.propertyInquiry.count(),
    prisma.property.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        developer: true,
        investmentData: true
      }
    }),
    // Calculate market trends from actual data
    prisma.property.groupBy({
      by: ['country'],
      _avg: {
        price: true
      },
      _count: {
        id: true
      }
    })
  ])

  // Calculate portfolio stats (if user has properties)
  const userProperties = await prisma.property.findMany({
    where: {
      // Add user-specific property filtering here if needed
    },
    include: {
      investmentData: true
    }
  })

  const portfolioStats = {
    totalInvestment: userProperties.reduce((sum: number, prop: any) => sum + (prop.price || 0), 0),
    totalProperties: userProperties.length,
    averageROI: userProperties.length > 0 
      ? userProperties.reduce((sum: number, prop: any) => sum + (prop.investmentData?.expectedROI || 0), 0) / userProperties.length 
      : 0,
    monthlyIncome: userProperties.reduce((sum: number, prop: any) => sum + (prop.investmentData?.rentalYield || 0) * (prop.price || 0) / 100 / 12, 0),
    portfolioGrowth: 0, // This would need historical data to calculate
    savedProperties: totalFavorites
  }

  // Format market trends
  const formattedMarketTrends = marketTrends.map((trend: any) => ({
    country: trend.country,
    trend: 'stable' as const, // This would need historical data to calculate actual trends
    value: 0, // This would need historical data to calculate actual changes
    avgPrice: trend._avg.price || 0,
    propertyCount: trend._count.id
  }))

  // Mock recent activity (this would need to be implemented with actual user activity tracking)
  const recentActivity = [
    { id: 1, type: 'inquiry', property: 'Recent Property Inquiry', date: '2 hours ago' },
    { id: 2, type: 'favorite', property: 'Saved Property', date: '1 day ago' },
    { id: 3, type: 'view', property: 'Viewed Property', date: '3 days ago' },
  ]

  return (
    <DashboardClient 
      user={currentUser}
      portfolioStats={portfolioStats}
      recentActivity={recentActivity}
      marketTrends={formattedMarketTrends}
      recentProperties={recentProperties}
    />
  )
}
