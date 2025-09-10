// Seed script to populate database with sample data
const { PrismaClient } = require('./dist/generated');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Create sample developers
    console.log('Creating developers...');
    const developers = await Promise.all([
      prisma.developer.create({
        data: {
          name: 'Mediterranean Homes',
          description: 'Leading developer in Cyprus with 20+ years experience',
          website: 'https://example.com',
          country: 'CYPRUS'
        }
      }),
      prisma.developer.create({
        data: {
          name: 'Athens Properties',
          description: 'Premium developments in Greece',
          website: 'https://example.com',
          country: 'GREECE'
        }
      }),
      prisma.developer.create({
        data: {
          name: 'Tbilisi Developments',
          description: 'Modern properties in Georgia',
          website: 'https://example.com',
          country: 'GEORGIA'
        }
      })
    ]);
    console.log(`✅ Created ${developers.length} developers`);

    // Create sample location guides
    console.log('Creating location guides...');
    const guides = await Promise.all([
      prisma.locationGuide.create({
        data: {
          title: 'Limassol Investment Guide',
          content: 'Limassol is the business capital of Cyprus...',
          country: 'CYPRUS'
        }
      }),
      prisma.locationGuide.create({
        data: {
          title: 'Athens Property Market',
          content: 'Athens offers excellent investment opportunities...',
          country: 'GREECE'
        }
      })
    ]);
    console.log(`✅ Created ${guides.length} location guides`);

    // Create sample properties
    console.log('Creating properties...');
    const properties = await Promise.all([
      prisma.property.create({
        data: {
          title: 'Luxury Seafront Villa',
          description: 'Stunning 4-bedroom villa with panoramic sea views',
          price: 850000,
          currency: 'EUR',
          bedrooms: 4,
          bathrooms: 3,
          area: 250,
          country: 'CYPRUS',
          status: 'NEW_BUILD',
          isGoldenVisaEligible: true,
          images: ['/sample-villa-1.jpg', '/sample-villa-2.jpg'],
          developerId: developers[0].id,
          locationGuideId: guides[0].id,
          investmentData: {
            create: {
              expectedROI: 12.5,
              rentalYield: 5.8,
              capitalGrowth: 6.7,
              isGoldenVisaEligible: true,
              minInvestment: 850000,
              completionDate: new Date('2025-12-01')
            }
          }
        }
      }),
      prisma.property.create({
        data: {
          title: 'Modern City Apartment',
          description: 'Central location, perfect for rental income',
          price: 280000,
          currency: 'EUR',
          bedrooms: 2,
          bathrooms: 2,
          area: 95,
          country: 'GREECE',
          status: 'RESALE',
          isGoldenVisaEligible: true,
          images: ['/sample-apartment-1.jpg'],
          developerId: developers[1].id,
          locationGuideId: guides[1].id,
          investmentData: {
            create: {
              expectedROI: 10.2,
              rentalYield: 6.5,
              capitalGrowth: 3.7,
              isGoldenVisaEligible: true,
              minInvestment: 280000
            }
          }
        }
      }),
      prisma.property.create({
        data: {
          title: 'Investment Studio',
          description: 'High rental yield property in city center',
          price: 120000,
          currency: 'USD',
          bedrooms: 1,
          bathrooms: 1,
          area: 45,
          country: 'GEORGIA',
          status: 'OFF_PLAN',
          isGoldenVisaEligible: false,
          images: [],
          developerId: developers[2].id,
          investmentData: {
            create: {
              expectedROI: 15.0,
              rentalYield: 8.5,
              capitalGrowth: 6.5,
              isGoldenVisaEligible: false,
              minInvestment: 120000,
              completionDate: new Date('2024-06-01')
            }
          }
        }
      }),
      prisma.property.create({
        data: {
          title: 'Penthouse with Terrace',
          description: 'Exclusive penthouse with large terrace and city views',
          price: 650000,
          currency: 'EUR',
          bedrooms: 3,
          bathrooms: 2,
          area: 180,
          country: 'CYPRUS',
          status: 'NEW_BUILD',
          isGoldenVisaEligible: true,
          images: ['/sample-penthouse-1.jpg'],
          developerId: developers[0].id,
          investmentData: {
            create: {
              expectedROI: 11.0,
              rentalYield: 5.2,
              capitalGrowth: 5.8,
              isGoldenVisaEligible: true,
              minInvestment: 650000
            }
          }
        }
      }),
      prisma.property.create({
        data: {
          title: 'Beachfront Apartment',
          description: 'Direct beach access, perfect holiday rental',
          price: 420000,
          currency: 'EUR',
          bedrooms: 2,
          bathrooms: 2,
          area: 110,
          country: 'GREECE',
          status: 'RESALE',
          isGoldenVisaEligible: true,
          images: [],
          developerId: developers[1].id,
          investmentData: {
            create: {
              expectedROI: 13.5,
              rentalYield: 7.2,
              capitalGrowth: 6.3,
              isGoldenVisaEligible: true,
              minInvestment: 420000
            }
          }
        }
      }),
      prisma.property.create({
        data: {
          title: 'Mountain View Villa',
          description: 'Spacious villa with mountain views and private pool',
          price: 380000,
          currency: 'USD',
          bedrooms: 3,
          bathrooms: 3,
          area: 200,
          country: 'LEBANON',
          status: 'RESALE',
          isGoldenVisaEligible: false,
          images: [],
          investmentData: {
            create: {
              expectedROI: 8.5,
              rentalYield: 4.5,
              capitalGrowth: 4.0,
              isGoldenVisaEligible: false,
              minInvestment: 380000
            }
          }
        }
      })
    ]);
    console.log(`✅ Created ${properties.length} properties with investment data`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Sample data has been added to your database.');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
