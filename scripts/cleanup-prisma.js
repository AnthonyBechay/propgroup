#!/usr/bin/env node

// Cleanup script to remove unused Prisma package
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up unused packages...\n');

// Remove db package directory
const dbPackagePath = path.join(__dirname, '..', 'packages', 'db');
if (fs.existsSync(dbPackagePath)) {
  console.log('Removing packages/db (Prisma - replaced by Supabase)...');
  fs.rmSync(dbPackagePath, { recursive: true, force: true });
  console.log('✅ Removed packages/db\n');
}

console.log('✨ Cleanup complete!\n');
console.log('Note: The project now uses Supabase for all database operations.');
console.log('Database management is handled through:');
console.log('  - supabase/migrations/ for schema changes');
console.log('  - packages/supabase/ for client and utilities');
