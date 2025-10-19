#!/usr/bin/env node

// Generate TypeScript types from Supabase database
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(
  process.cwd(),
  'packages',
  'supabase',
  'src',
  'types',
  'database.ts'
);

console.log('🔄 Generating TypeScript types from Supabase database...\n');

// Check if SUPABASE_PROJECT_ID is set
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error('❌ SUPABASE_PROJECT_ID environment variable is not set');
  console.log('\nPlease set it in your .env.local file or export it:');
  console.log('  export SUPABASE_PROJECT_ID=your-project-id\n');
  process.exit(1);
}

try {
  // Generate types
  const command = `supabase gen types typescript --project-id ${projectId}`;
  const types = execSync(command, { encoding: 'utf8' });
  
  // Add header comment
  const header = `// Database types generated from Supabase schema
// Generated on: ${new Date().toISOString()}
// Project ID: ${projectId}

`;
  
  // Write to file
  fs.writeFileSync(outputPath, header + types);
  
  console.log(`✅ Types generated successfully!`);
  console.log(`📁 Output: ${outputPath}\n`);
  
  // Format the file
  try {
    execSync(`npx prettier --write ${outputPath}`, { stdio: 'inherit' });
    console.log('✨ Types formatted with Prettier\n');
  } catch {
    console.log('⚠️  Could not format with Prettier\n');
  }
  
} catch (error) {
  console.error('❌ Failed to generate types:', error.message);
  console.log('\nMake sure you have:');
  console.log('  1. Supabase CLI installed: pnpm add -g supabase');
  console.log('  2. Valid SUPABASE_PROJECT_ID in your environment');
  console.log('  3. Proper authentication with Supabase\n');
  process.exit(1);
}
