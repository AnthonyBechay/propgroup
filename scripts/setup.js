#!/usr/bin/env node

/**
 * Setup script for PropGroup
 * Installs dependencies and prepares the development environment
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Setting up PropGroup development environment...\n');

// Function to run command
function runCommand(command, options = {}) {
  try {
    execSync(command, { 
      stdio: 'inherit',
      ...options 
    });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    return false;
  }
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

// Main setup steps
async function setup() {
  console.log('Step 1: Installing dependencies...\n');
  if (!runCommand('npm install --legacy-peer-deps')) {
    console.error('Failed to install dependencies');
    process.exit(1);
  }
  
  console.log('\nStep 2: Building packages...\n');
  if (!runCommand('node scripts/build.js')) {
    console.error('Failed to build packages');
    console.log('You can try building manually with: npm run build:packages');
  }
  
  console.log('\nStep 3: Checking environment...\n');
  
  // Check for .env.local
  if (!fileExists('apps/web/.env.local')) {
    console.log('⚠️  No .env.local file found in apps/web/');
    console.log('   Creating from example...');
    
    const envExample = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Add your keys here
# RESEND_API_KEY=your-resend-key
# OPENAI_API_KEY=your-openai-key
`;
    
    fs.writeFileSync(
      path.join(__dirname, '..', 'apps', 'web', '.env.local'),
      envExample
    );
    console.log('✅ Created .env.local file');
  } else {
    console.log('✅ .env.local file exists');
  }
  
  // Check for Docker
  try {
    execSync('docker --version', { stdio: 'ignore' });
    console.log('✅ Docker is installed');
  } catch {
    console.log('⚠️  Docker not found - Supabase features will not be available');
    console.log('   Install Docker Desktop from: https://www.docker.com/products/docker-desktop/');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run "npm run dev" to start the development server');
  console.log('2. Open http://localhost:3000 in your browser');
  console.log('\nOptional:');
  console.log('- Run "npx supabase start" to start Supabase (requires Docker)');
  console.log('- Run "npm run dev:full" to start with Supabase');
  console.log('='.repeat(50) + '\n');
}

// Run setup
setup().catch(console.error);
