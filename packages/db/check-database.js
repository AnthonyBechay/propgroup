// Script to check which columns exist in the properties table
const { PrismaClient } = require('./dist/generated');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking properties table structure...\n');

    // Get all columns from the properties table
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'properties'
      ORDER BY ordinal_position;
    `;

    if (result.length === 0) {
      console.log('❌ Properties table does not exist!');
      console.log('Run: npx prisma db push');
      return;
    }

    console.log('Current columns in properties table:');
    console.log('=====================================');
    
    const existingColumns = new Set();
    result.forEach(col => {
      existingColumns.add(col.column_name);
      console.log(`  • ${col.column_name} (${col.data_type})`);
    });

    console.log('\n');

    // Expected columns based on schema
    const expectedColumns = [
      'id',
      'title',
      'description',
      'price',
      'currency',
      'bedrooms',
      'bathrooms',
      'area',
      'country',
      'status',
      'isGoldenVisaEligible',
      'images',
      'createdAt',
      'updatedAt',
      'developerId',
      'locationGuideId'
    ];

    const missingColumns = expectedColumns.filter(col => !existingColumns.has(col));

    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:');
      console.log('===================');
      missingColumns.forEach(col => {
        console.log(`  • ${col}`);
      });
      console.log('\nRun one of these commands to fix:');
      console.log('  1. node migrate.js (adds missing columns only)');
      console.log('  2. npx prisma db push (recreates entire schema)');
    } else {
      console.log('✅ All expected columns exist!');
    }

    // Check for related tables
    console.log('\n\nChecking related tables:');
    console.log('========================');
    
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    const tableNames = tables.map(t => t.table_name);
    const expectedTables = [
      'properties',
      'users',
      'developers',
      'location_guides',
      'property_investment_data',
      'favorite_properties',
      'property_inquiries',
      'user_owned_properties'
    ];

    expectedTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} (missing)`);
      }
    });

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('\nMake sure your database is running and DATABASE_URL is correct.');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase().catch(console.error);
