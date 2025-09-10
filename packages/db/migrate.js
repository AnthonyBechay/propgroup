// Comprehensive migration script to add all missing columns
const { PrismaClient } = require('./dist/generated');

async function migrate() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Starting database migration...\n');

    // Add currency column if it doesn't exist
    console.log('Checking currency column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='currency'
        ) THEN
          ALTER TABLE properties ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
          RAISE NOTICE 'Added currency column';
        END IF;
      END $$;
    `;
    console.log('✅ Currency column checked');

    // Add area column if it doesn't exist
    console.log('Checking area column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='area'
        ) THEN
          ALTER TABLE properties ADD COLUMN area DOUBLE PRECISION DEFAULT 0;
          RAISE NOTICE 'Added area column';
        END IF;
      END $$;
    `;
    console.log('✅ Area column checked');

    // Add bedrooms column if it doesn't exist
    console.log('Checking bedrooms column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='bedrooms'
        ) THEN
          ALTER TABLE properties ADD COLUMN bedrooms INTEGER DEFAULT 0;
          RAISE NOTICE 'Added bedrooms column';
        END IF;
      END $$;
    `;
    console.log('✅ Bedrooms column checked');

    // Add bathrooms column if it doesn't exist
    console.log('Checking bathrooms column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='bathrooms'
        ) THEN
          ALTER TABLE properties ADD COLUMN bathrooms INTEGER DEFAULT 0;
          RAISE NOTICE 'Added bathrooms column';
        END IF;
      END $$;
    `;
    console.log('✅ Bathrooms column checked');

    // Add status column if it doesn't exist (using enum type)
    console.log('Checking status column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        -- First create the enum type if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PropertyStatus') THEN
          CREATE TYPE "PropertyStatus" AS ENUM ('OFF_PLAN', 'NEW_BUILD', 'RESALE');
        END IF;
        
        -- Then add the column if it doesn't exist
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='status'
        ) THEN
          ALTER TABLE properties ADD COLUMN status "PropertyStatus" DEFAULT 'RESALE';
          RAISE NOTICE 'Added status column';
        END IF;
      END $$;
    `;
    console.log('✅ Status column checked');

    // Add isGoldenVisaEligible column if it doesn't exist
    console.log('Checking isGoldenVisaEligible column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='isGoldenVisaEligible'
        ) THEN
          ALTER TABLE properties ADD COLUMN "isGoldenVisaEligible" BOOLEAN DEFAULT false;
          RAISE NOTICE 'Added isGoldenVisaEligible column';
        END IF;
      END $$;
    `;
    console.log('✅ isGoldenVisaEligible column checked');

    // Add images column if it doesn't exist (array type)
    console.log('Checking images column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='images'
        ) THEN
          ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
          RAISE NOTICE 'Added images column';
        END IF;
      END $$;
    `;
    console.log('✅ Images column checked');

    // Add developerId column if it doesn't exist
    console.log('Checking developerId column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='developerId'
        ) THEN
          ALTER TABLE properties ADD COLUMN "developerId" TEXT;
          RAISE NOTICE 'Added developerId column';
        END IF;
      END $$;
    `;
    console.log('✅ DeveloperId column checked');

    // Add locationGuideId column if it doesn't exist
    console.log('Checking locationGuideId column...');
    await prisma.$executeRaw`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='properties' AND column_name='locationGuideId'
        ) THEN
          ALTER TABLE properties ADD COLUMN "locationGuideId" TEXT;
          RAISE NOTICE 'Added locationGuideId column';
        END IF;
      END $$;
    `;
    console.log('✅ LocationGuideId column checked');

    console.log('\n✅ Migration completed successfully!');
    console.log('All missing columns have been added to the properties table.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nPlease check your database connection and try again.');
    console.error('You may need to run: npx prisma db push --skip-generate');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrate().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
