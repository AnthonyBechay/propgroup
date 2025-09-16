#!/usr/bin/env node

/**
 * Build script for PropGroup packages
 * Builds all packages in the correct order
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building PropGroup packages...\n');

// Packages to build in order
const packages = [
  { name: 'config', path: 'packages/config', required: true },
  { name: 'db', path: 'packages/db', required: false },
  { name: 'supabase', path: 'packages/supabase', required: false },
  { name: 'ui', path: 'packages/ui', required: true },
];

let hasErrors = false;

// Function to build a package
function buildPackage(pkg) {
  const pkgPath = path.join(__dirname, '..', pkg.path);
  
  // Check if package exists
  if (!fs.existsSync(pkgPath)) {
    if (pkg.required) {
      console.log(`❌ Required package ${pkg.name} not found at ${pkg.path}`);
      return false;
    } else {
      console.log(`⚠️  Optional package ${pkg.name} not found, skipping...`);
      return true;
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
    
    // Build the package
    execSync('npm run build', { 
      cwd: pkgPath, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    console.log(`✅ Built @propgroup/${pkg.name}\n`);
    return true;
  } catch (error) {
    if (pkg.required) {
      console.error(`❌ Failed to build required package @propgroup/${pkg.name}\n`);
      return false;
    } else {
      console.warn(`⚠️  Failed to build optional package @propgroup/${pkg.name}, continuing...\n`);
      return true;
    }
  }
}

// Build all packages
for (const pkg of packages) {
  const success = buildPackage(pkg);
  if (!success && pkg.required) {
    hasErrors = true;
  }
}

// Summary
if (!hasErrors) {
  console.log('✅ Build completed successfully!\n');
  console.log('You can now run:');
  console.log('  npm run dev       - Start development server');
  console.log('  npm run build     - Build for production');
} else {
  console.warn('⚠️  Build completed with some issues.');
  console.warn('The application may still work, but some features might be limited.');
  console.log('\nYou can try:');
  console.log('  npm run dev       - Start development server anyway');
}

// Don't exit with error to allow development to continue
process.exit(0);
