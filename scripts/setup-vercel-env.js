#!/usr/bin/env node

/**
 * Setup environment variables for Vercel build
 * This ensures DATABASE_URL is available for Prisma generation
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for Vercel build...\n');

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!');
  console.error('   Please set DATABASE_URL in your Vercel environment variables.');
  console.error('   This is required for Prisma to generate the client.');
  process.exit(1);
}

// Create .env file in packages/db for Prisma
const dbPackagePath = path.join(process.cwd(), 'packages', 'db');
const envPath = path.join(dbPackagePath, '.env');

const envContent = `DATABASE_URL="${process.env.DATABASE_URL}"
DIRECT_URL="${process.env.DIRECT_URL || process.env.DATABASE_URL}"
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ Created packages/db/.env with DATABASE_URL');

// Verify the environment
console.log('📋 Environment Check:');
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   DIRECT_URL: ${process.env.DIRECT_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   VERCEL: ${process.env.VERCEL ? 'Yes' : 'No'}`);
console.log('');
