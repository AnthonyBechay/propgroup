// Script to fix the Supabase profiles table issue
const { PrismaClient } = require('./dist/generated');

async function fixProfilesTable() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Fixing database schema issues...\n');

    // Check if profiles table exists
    const profilesExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      );
    `;

    if (profilesExists[0].exists) {
      console.log('Found profiles table. This is a Supabase default table.');
      console.log('Since we use our own users table, we can safely remove it.\n');
      
      console.log('Options:');
      console.log('1. Drop the profiles table (recommended if not using Supabase Auth profiles)');
      console.log('2. Keep it but ignore in Prisma\n');

      // Drop the profiles table and its trigger
      console.log('Dropping profiles table and related objects...');
      
      // First drop the trigger if it exists
      await prisma.$executeRaw`
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      `;
      console.log('✅ Dropped trigger');

      // Drop the function if it exists
      await prisma.$executeRaw`
        DROP FUNCTION IF EXISTS public.handle_new_user();
      `;
      console.log('✅ Dropped function');

      // Finally drop the profiles table
      await prisma.$executeRaw`
        DROP TABLE IF EXISTS public.profiles CASCADE;
      `;
      console.log('✅ Dropped profiles table');
      
      console.log('\n✅ Successfully removed Supabase profiles table!');
      console.log('Your database schema is now clean.');
    } else {
      console.log('✅ No profiles table found. Database is clean!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nAlternative solution: Keep the profiles table but ignore it.');
    console.log('The application will work fine with it present.');
  } finally {
    await prisma.$disconnect();
  }
}

fixProfilesTable().catch(console.error);
