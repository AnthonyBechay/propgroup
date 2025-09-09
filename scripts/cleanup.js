#!/usr/bin/env node

/**
 * Cleanup script to remove temporary files and optimize the project
 */

const fs = require('fs');
const path = require('path');

// Files to remove after fixes are complete
const filesToRemove = [
  'render.yaml.backup',
  'pnpm-workspace.yaml.backup',
  'temp-contact-route.backup',
  'temp-favorites-route.backup',
  'README_UPDATED.md',
  'scripts/final-cleanup.js', // Self-cleanup
];

// Cleanup function
function cleanup() {
  console.log('🧹 Starting cleanup...\n');

  // Remove temporary files
  filesToRemove.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${file}`);
    }
  });

  console.log('\n✨ Cleanup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Run "npm install" to install dependencies');
  console.log('2. Run "npm run db:generate" to generate Prisma client');
  console.log('3. Run "npm run db:push" to create database tables');
  console.log('4. Run "npm run db:seed" to seed initial data');
  console.log('5. Run "npm run dev" to start the development server');
}

// Run cleanup
cleanup();
