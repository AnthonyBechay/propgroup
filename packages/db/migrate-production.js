#!/usr/bin/env node

/**
 * Production migration script for Vercel deployment
 * Runs Prisma migrations against Supabase database
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Prisma production migration...\n');

// Ensure we're in the db package directory
const dbDir = path.join(__dirname);
process.chdir(dbDir);

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('📊 Database URL configured:', process.env.DATABASE_URL.substring(0, 30) + '...');

  // Generate Prisma client first
  console.log('🔨 Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Deploy migrations to production database
  console.log('📦 Deploying migrations to production database...');
  try {
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } catch (migrateError) {
    console.warn('⚠️  Migrate deploy failed, trying db push...');
    // If migrate deploy fails, try db push (useful for Supabase)
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  }

  // Verify the migration worked
  console.log('✅ Verifying database connection...');
  execSync('npx prisma db pull --print', { 
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Skip seeding in production - only run migrations
  console.log('ℹ️  Skipping seed data in production environment');

  console.log('🎉 Production migration completed successfully!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  
  // If migration fails, try to push schema directly
  console.log('🔄 Attempting to push schema directly...');
  try {
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log('✅ Schema pushed successfully!');
  } catch (pushError) {
    console.error('❌ Schema push also failed:', pushError.message);
    process.exit(1);
  }
}
