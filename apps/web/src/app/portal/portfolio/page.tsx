import { getCurrentUser } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PortfolioClient } from './PortfolioClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PortfolioPage() {
  // Check if user is authenticated
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect('/login')
  }

  // Fetch user's portfolio data from database
  // Note: This assumes you have a user property relationship in your schema
  // For now, we'll fetch all properties as a placeholder
  const properties = await prisma.property.findMany({
    include: {
      developer: true,
      investmentData: true
    }
  })

  // Transform properties to portfolio format
  const portfolio = properties.map(property => ({
    id: property.id,
    customName: property.title,
    propertyId: property.id,
    purchasePrice: property.price || 0,
    currentValue: property.price || 0, // This would need historical data to calculate
    purchaseDate: property.createdAt.toISOString().split('T')[0],
    location: `${property.country}`,
    currentRent: (property.investmentData?.rentalYield || 0) * (property.price || 0) / 100 / 12,
    monthlyExpenses: 0, // This would need to be tracked separately
    roi: property.investmentData?.expectedROI || 0,
    appreciation: 0, // This would need historical data to calculate
    type: 'Property', // This would need to be added to the schema
    status: property.status === 'NEW_BUILD' ? 'Under Construction' : 'Available'
  }))

  return <PortfolioClient initialPortfolio={portfolio} />
}
