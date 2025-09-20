import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/rbac'
import { prisma } from '@/lib/prisma'
import { Country, PropertyStatus, InvestmentGoal, Role } from '@propgroup/db'

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser()
    
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🌱 Starting database seed...')

    // Clear existing data (optional - you might want to keep existing data)
    // await prisma.propertyInvestmentData.deleteMany()
    // await prisma.property.deleteMany()
    // await prisma.developer.deleteMany()
    // await prisma.locationGuide.deleteMany()

    // Create developers
    console.log('Creating developers...')
    const developers = await Promise.all([
      prisma.developer.create({
        data: {
          name: 'Archi Development',
          description: 'Leading developer in Georgia with over 15 years of experience',
          website: 'https://archidevelopment.ge',
          country: Country.GEORGIA,
        }
      }),
      prisma.developer.create({
        data: {
          name: 'Cyprus Elite Properties',
          description: 'Premium real estate development in Cyprus',
          website: 'https://cypruselite.com',
          country: Country.CYPRUS,
        }
      }),
      prisma.developer.create({
        data: {
          name: 'Athens Modern Living',
          description: 'Contemporary urban development in Athens',
          website: 'https://athensmodern.gr',
          country: Country.GREECE,
        }
      }),
    ])

    console.log(`✅ Created ${developers.length} developers`)

    // Create location guides
    console.log('Creating location guides...')
    const locationGuides = await Promise.all([
      prisma.locationGuide.create({
        data: {
          title: 'Tbilisi Investment Guide',
          content: 'Tbilisi, the capital of Georgia, offers excellent investment opportunities with its growing tech sector, affordable property prices, and high rental yields. The city is becoming a hub for international businesses and expats.',
          country: Country.GEORGIA,
        }
      }),
      prisma.locationGuide.create({
        data: {
          title: 'Limassol Investment Guide',
          content: 'Limassol is the business capital of Cyprus and a major financial center. With its strategic location, EU membership, and attractive tax regime, it offers excellent opportunities for property investment and Golden Visa applications.',
          country: Country.CYPRUS,
        }
      }),
      prisma.locationGuide.create({
        data: {
          title: 'Athens Property Market',
          content: 'Athens offers excellent investment opportunities with its rich history, growing tourism sector, and recovering economy. The city provides good rental yields and potential for capital appreciation.',
          country: Country.GREECE,
        }
      }),
    ])

    console.log(`✅ Created ${locationGuides.length} location guides`)

    // Create properties with investment data
    console.log('Creating properties...')
    const properties = [
      {
        title: 'Luxury Apartment in Vake District',
        description: 'Modern 2-bedroom apartment in Tbilisi\'s most prestigious neighborhood with panoramic city views',
        price: 185000,
        currency: 'USD',
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        country: Country.GEORGIA,
        status: PropertyStatus.NEW_BUILD,
        isGoldenVisaEligible: false,
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        ],
        developerId: developers[0].id,
        locationGuideId: locationGuides[0].id,
        investmentData: {
          expectedROI: 12.5,
          rentalYield: 7.8,
          capitalGrowth: 4.7,
          minInvestment: 50000,
          maxInvestment: 185000,
          paymentPlan: '30% down payment, 70% on completion',
          completionDate: new Date('2025-12-31'),
        }
      },
      {
        title: 'Seafront Villa in Limassol',
        description: 'Stunning 4-bedroom villa with private pool and direct beach access, perfect for Golden Visa',
        price: 850000,
        currency: 'EUR',
        bedrooms: 4,
        bathrooms: 3,
        area: 280,
        country: Country.CYPRUS,
        status: PropertyStatus.NEW_BUILD,
        isGoldenVisaEligible: true,
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
        ],
        developerId: developers[1].id,
        locationGuideId: locationGuides[1].id,
        investmentData: {
          expectedROI: 10.2,
          rentalYield: 5.5,
          capitalGrowth: 4.7,
          minInvestment: 250000,
          maxInvestment: 850000,
          paymentPlan: '40% down payment, flexible payment terms',
          completionDate: new Date('2026-06-30'),
        }
      },
      {
        title: 'Athens Central Apartment',
        description: 'Contemporary 3-bedroom apartment in the heart of Athens with modern amenities and excellent connectivity',
        price: 320000,
        currency: 'EUR',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        country: Country.GREECE,
        status: PropertyStatus.RESALE,
        isGoldenVisaEligible: true,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        ],
        developerId: developers[2].id,
        locationGuideId: locationGuides[2].id,
        investmentData: {
          expectedROI: 8.5,
          rentalYield: 4.2,
          capitalGrowth: 4.3,
          minInvestment: 320000,
          maxInvestment: 320000,
          paymentPlan: 'Immediate purchase',
          completionDate: null,
        }
      },
    ]

    for (const propertyData of properties) {
      const { investmentData, ...property } = propertyData
      const createdProperty = await prisma.property.create({
        data: property,
      })

      await prisma.propertyInvestmentData.create({
        data: {
          ...investmentData,
          propertyId: createdProperty.id,
        }
      })
    }

    console.log(`✅ Created ${properties.length} properties with investment data`)

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!',
      data: {
        developers: developers.length,
        locationGuides: locationGuides.length,
        properties: properties.length
      }
    })

  } catch (error) {
    console.error('❌ Seed failed:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
