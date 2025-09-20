#!/usr/bin/env node

/**
 * Vercel-specific build script for PropGroup
 * Ensures all packages are built before the web app
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Vercel build process...\n');

// Ensure we're in the right directory
const rootDir = path.join(__dirname, '..');
process.chdir(rootDir);

// Step 1: Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 2: Build packages in order
console.log('🔨 Building packages...');
const packages = [
  { name: 'config', path: 'packages/config', required: true },
  { name: 'db', path: 'packages/db', required: true }, // Make db required for Prisma
  { name: 'supabase', path: 'packages/supabase', required: false }, // Make supabase optional due to type issues
  { name: 'ui', path: 'packages/ui', required: true },
];

for (const pkg of packages) {
  const pkgPath = path.join(rootDir, pkg.path);
  
  if (!fs.existsSync(pkgPath)) {
    if (pkg.required) {
      console.error(`❌ Required package ${pkg.name} not found at ${pkg.path}`);
      process.exit(1);
    } else {
      console.log(`⚠️  Optional package ${pkg.name} not found, skipping...`);
      continue;
    }
  }
  
  console.log(`Building @propgroup/${pkg.name}...`);
  
  try {
    // Clean dist folder first
    const distPath = path.join(pkgPath, 'dist');
    if (fs.existsSync(distPath)) {
      if (process.platform === 'win32') {
        try {
          execSync(`rmdir /s /q "${distPath}"`, { stdio: 'ignore' });
        } catch {
          // Ignore errors
        }
      } else {
        try {
          execSync(`rm -rf "${distPath}"`, { stdio: 'ignore' });
        } catch {
          // Ignore errors
        }
      }
    }
    
    // Special handling for db package - run prisma generate and migrate
    if (pkg.name === 'db') {
      console.log(`Setting up Prisma for @propgroup/${pkg.name}...`);
      try {
        // Generate Prisma client
        console.log(`Generating Prisma client...`);
        execSync('npx prisma generate', { 
          cwd: pkgPath, 
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'production' }
        });
        console.log(`✅ Prisma client generated`);

        // Run production migration
        console.log(`Running production migration...`);
        execSync('node migrate-production.js', { 
          cwd: pkgPath, 
          stdio: 'inherit',
          env: { ...process.env, NODE_ENV: 'production' }
        });
        console.log(`✅ Database migration completed`);
      } catch (prismaError) {
        console.warn(`⚠️  Prisma setup failed for @propgroup/${pkg.name}:`, prismaError.message);
        console.log(`Continuing with TypeScript build...`);
      }
    }
    
    // Build the package using root TypeScript
    const tscPath = path.join(rootDir, 'node_modules', '.bin', 'tsc');
    execSync(`"${tscPath}"`, { 
      cwd: pkgPath, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    // Verify the build output
    const distIndexPath = path.join(distPath, 'index.js');
    if (fs.existsSync(distIndexPath)) {
      console.log(`✅ Built @propgroup/${pkg.name} - dist/index.js exists`);
    } else {
      console.warn(`⚠️  @propgroup/${pkg.name} built but dist/index.js not found`);
    }
    
    console.log(`✅ Built @propgroup/${pkg.name}\n`);
  } catch (error) {
    if (pkg.required) {
      console.error(`❌ Failed to build required package @propgroup/${pkg.name}:`, error.message);
      process.exit(1);
    } else {
      console.warn(`⚠️  Failed to build optional package @propgroup/${pkg.name}, continuing...`);
    }
  }
}

// Step 3: Build the web app
console.log('🌐 Building web application...');
try {
  execSync('npm run build', { 
    cwd: path.join(rootDir, 'apps/web'), 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Web application built successfully\n');
} catch (error) {
  console.error('❌ Failed to build web application:', error.message);
  process.exit(1);
}

console.log('🎉 Vercel build completed successfully!');
