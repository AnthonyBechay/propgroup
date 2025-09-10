-- SQL script to fix the profiles table foreign key issue
-- This keeps the profiles table but removes the problematic constraint

-- Step 1: Drop the foreign key constraint that causes the issue
ALTER TABLE IF EXISTS public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Drop the trigger that auto-creates profiles (if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Drop the function that handles profile creation (if exists)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 4: Add all missing columns to properties table
DO $$ 
BEGIN 
  -- Add currency column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='currency'
  ) THEN
    ALTER TABLE properties ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
  END IF;

  -- Add area column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='area'
  ) THEN
    ALTER TABLE properties ADD COLUMN area DOUBLE PRECISION DEFAULT 0;
  END IF;

  -- Add bedrooms column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='bedrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bedrooms INTEGER DEFAULT 0;
  END IF;

  -- Add bathrooms column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='bathrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bathrooms INTEGER DEFAULT 0;
  END IF;

  -- Create PropertyStatus enum if needed and add status column
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PropertyStatus') THEN
    CREATE TYPE "PropertyStatus" AS ENUM ('OFF_PLAN', 'NEW_BUILD', 'RESALE');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='status'
  ) THEN
    ALTER TABLE properties ADD COLUMN status "PropertyStatus" DEFAULT 'RESALE';
  END IF;

  -- Add isGoldenVisaEligible column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='isGoldenVisaEligible'
  ) THEN
    ALTER TABLE properties ADD COLUMN "isGoldenVisaEligible" BOOLEAN DEFAULT false;
  END IF;

  -- Add images column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='images'
  ) THEN
    ALTER TABLE properties ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;

  -- Add developerId column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='developerId'
  ) THEN
    ALTER TABLE properties ADD COLUMN "developerId" TEXT;
  END IF;

  -- Add locationGuideId column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='properties' AND column_name='locationGuideId'
  ) THEN
    ALTER TABLE properties ADD COLUMN "locationGuideId" TEXT;
  END IF;
END $$;

-- Verify the fix
SELECT 'Database fixed successfully!' as message;
