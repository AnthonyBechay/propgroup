import { PrismaClient } from '../dist/generated'
import { Country, PropertyStatus, InvestmentGoal, Role } from '../dist/generated'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create developers
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
  const locationGuides = await Promise.all([
    prisma.locationGuide.create({
      data: {
        title: 'Tbilisi Investment Guide',
        content: 'Tbilisi, the capital of Georgia, offers excellent investment opportunities with growing tourism, tech sector, and favorable business environment.',
        country: Country.GEORGIA,
        imageUrl: 'https://images.unsplash.com/photo-1565008576549-57569a49371d',
      }
    }),
    prisma.locationGuide.create({
      data: {
        title: 'Limassol Property Market',
        content: 'Limassol is Cyprus\'s business hub with a thriving property market, excellent infrastructure, and strong rental demand.',
        country: Country.CYPRUS,
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91',
      }
    }),
    prisma.locationGuide.create({
      data: {
        title: 'Athens Real Estate Overview',
        content: 'Athens combines historical charm with modern investment potential, offering Golden Visa opportunities and strong capital growth.',
        country: Country.GREECE,
        imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235',
      }
    }),
  ])

  console.log(`✅ Created ${locationGuides.length} location guides`)

  // Create properties with investment data
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
      description: 'Renovated 3-bedroom apartment in the heart of Athens, walking distance to Acropolis',
      price: 420000,
      currency: 'EUR',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      country: Country.GREECE,
      status: PropertyStatus.RESALE,
      isGoldenVisaEligible: true,
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80',
      ],
      developerId: developers[2].id,
      locationGuideId: locationGuides[2].id,
      investmentData: {
        expectedROI: 9.8,
        rentalYield: 6.2,
        capitalGrowth: 3.6,
        minInvestment: 100000,
        maxInvestment: 420000,
        paymentPlan: 'Full payment or mortgage available',
        completionDate: null,
      }
    },
    {
      title: 'Off-Plan Studio in Batumi',
      description: 'Compact studio apartment in upcoming beachfront development, ideal for rental income',
      price: 65000,
      currency: 'USD',
      bedrooms: 0,
      bathrooms: 1,
      area: 35,
      country: Country.GEORGIA,
      status: PropertyStatus.OFF_PLAN,
      isGoldenVisaEligible: false,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e',
      ],
      developerId: developers[0].id,
      locationGuideId: locationGuides[0].id,
      investmentData: {
        expectedROI: 15.5,
        rentalYield: 9.2,
        capitalGrowth: 6.3,
        minInvestment: 20000,
        maxInvestment: 65000,
        paymentPlan: '20% down, installments until completion',
        completionDate: new Date('2027-03-31'),
      }
    },
    {
      title: 'Paphos Garden Residence',
      description: 'Spacious 2-bedroom apartment with large terrace and garden views, near amenities',
      price: 325000,
      currency: 'EUR',
      bedrooms: 2,
      bathrooms: 2,
      area: 98,
      country: Country.CYPRUS,
      status: PropertyStatus.NEW_BUILD,
      isGoldenVisaEligible: true,
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858',
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365',
      ],
      developerId: developers[1].id,
      locationGuideId: locationGuides[1].id,
      investmentData: {
        expectedROI: 11.3,
        rentalYield: 6.8,
        capitalGrowth: 4.5,
        minInvestment: 100000,
        maxInvestment: 325000,
        paymentPlan: '35% down payment, balance on completion',
        completionDate: new Date('2025-09-30'),
      }
    },
    {
      title: 'Mykonos Investment Villa',
      description: 'Traditional Cycladic villa with modern amenities and stunning sea views',
      price: 1200000,
      currency: 'EUR',
      bedrooms: 5,
      bathrooms: 4,
      area: 320,
      country: Country.GREECE,
      status: PropertyStatus.RESALE,
      isGoldenVisaEligible: true,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      ],
      developerId: developers[2].id,
      locationGuideId: locationGuides[2].id,
      investmentData: {
        expectedROI: 8.5,
        rentalYield: 4.8,
        capitalGrowth: 3.7,
        minInvestment: 400000,
        maxInvestment: 1200000,
        paymentPlan: 'Negotiable terms',
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

  // Create a test admin user (you'll need to update the role manually or through Supabase)
  console.log('\n📝 Note: To create an admin user:')
  console.log('1. Sign up through the app with email: admin@propgroup.com')
  console.log('2. Go to Supabase Dashboard > Table Editor > users')
  console.log('3. Change the role from USER to ADMIN')

  console.log('\n🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
