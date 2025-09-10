-- SQL script to add missing columns to the properties table
-- Run this directly in your PostgreSQL database if the migration script fails

-- Add currency column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='currency'
  ) THEN
    ALTER TABLE properties ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
    RAISE NOTICE 'Added currency column';
  ELSE
    RAISE NOTICE 'Currency column already exists';
  END IF;
END $$;

-- Add area column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='area'
  ) THEN
    ALTER TABLE properties ADD COLUMN area DOUBLE PRECISION DEFAULT 0;
    RAISE NOTICE 'Added area column';
  ELSE
    RAISE NOTICE 'Area column already exists';
  END IF;
END $$;

-- Add bedrooms column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='bedrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bedrooms INTEGER DEFAULT 0;
    RAISE NOTICE 'Added bedrooms column';
  ELSE
    RAISE NOTICE 'Bedrooms column already exists';
  END IF;
END $$;

-- Add bathrooms column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='bathrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bathrooms INTEGER DEFAULT 0;
    RAISE NOTICE 'Added bathrooms column';
  ELSE
    RAISE NOTICE 'Bathrooms column already exists';
  END IF;
END $$;

-- Create PropertyStatus enum if it doesn't exist and add status column
DO $$ 
BEGIN 
  -- Create enum type if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PropertyStatus') THEN
    CREATE TYPE "PropertyStatus" AS ENUM ('OFF_PLAN', 'NEW_BUILD', 'RESALE');
    RAISE NOTICE 'Created PropertyStatus enum type';
  END IF;
  
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='status'
  ) THEN
    ALTER TABLE properties ADD COLUMN status "PropertyStatus" DEFAULT 'RESALE';
    RAISE NOTICE 'Added status column';
  ELSE
    RAISE NOTICE 'Status column already exists';
  END IF;
END $$;

-- Add isGoldenVisaEligible column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='isGoldenVisaEligible'
  ) THEN
    ALTER TABLE properties ADD COLUMN "isGoldenVisaEligible" BOOLEAN DEFAULT false;
    RAISE NOTICE 'Added isGoldenVisaEligible column';
  ELSE
    RAISE NOTICE 'isGoldenVisaEligible column already exists';
  END IF;
END $$;

-- Add images column (array)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='images'
  ) THEN
    ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
    RAISE NOTICE 'Added images column';
  ELSE
    RAISE NOTICE 'Images column already exists';
  END IF;
END $$;

-- Add developerId column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='developerId'
  ) THEN
    ALTER TABLE properties ADD COLUMN "developerId" TEXT;
    RAISE NOTICE 'Added developerId column';
  ELSE
    RAISE NOTICE 'DeveloperId column already exists';
  END IF;
END $$;

-- Add locationGuideId column
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='locationGuideId'
  ) THEN
    ALTER TABLE properties ADD COLUMN "locationGuideId" TEXT;
    RAISE NOTICE 'Added locationGuideId column';
  ELSE
    RAISE NOTICE 'LocationGuideId column already exists';
  END IF;
END $$;

-- Verify all columns exist
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
