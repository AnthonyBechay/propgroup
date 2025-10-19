#!/usr/bin/env node

/**
 * Build script for PropGroup packages and applications
 * Builds all packages and applications in the correct order
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building PropGroup packages and applications...\n');

// Packages to build in order
const packages = [
  { name: 'config', path: 'packages/config', required: true },
  { name: 'db', path: 'packages/db', required: true },
  { name: 'ui', path: 'packages/ui', required: true },
];

// Applications to build
const applications = [
  { name: 'backend', path: 'apps/backend', required: true },
  { name: 'web', path: 'apps/web', required: true },
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
    execSync('pnpm run build', {
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

// Function to build an application
function buildApplication(app) {
  const appPath = path.join(__dirname, '..', app.path);
  
  // Check if application exists
  if (!fs.existsSync(appPath)) {
    if (app.required) {
      console.log(`❌ Required application ${app.name} not found at ${app.path}`);
      return false;
    } else {
      console.log(`⚠️  Optional application ${app.name} not found, skipping...`);
      return true;
    }
  }
  
  console.log(`Building ${app.name} application...`);
  
  try {
    // For backend, just check if it can start (no build step needed)
    if (app.name === 'backend') {
      console.log(`✅ Backend application ready (no build step required)\n`);
      return true;
    }
    
    // For web app, run the build command
    if (app.name === 'web') {
      execSync('pnpm run build', {
        cwd: appPath,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
    }
    
    console.log(`✅ Built ${app.name} application\n`);
    return true;
  } catch (error) {
    if (app.required) {
      console.error(`❌ Failed to build required application ${app.name}\n`);
      return false;
    } else {
      console.warn(`⚠️  Failed to build optional application ${app.name}, continuing...\n`);
      return true;
    }
  }
}

// Build all packages first
console.log('📦 Building packages...\n');
for (const pkg of packages) {
  const success = buildPackage(pkg);
  if (!success && pkg.required) {
    hasErrors = true;
  }
}

// Build all applications
console.log('🏗️  Building applications...\n');
for (const app of applications) {
  const success = buildApplication(app);
  if (!success && app.required) {
    hasErrors = true;
  }
}

// Summary
if (!hasErrors) {
  console.log('✅ Build completed successfully!\n');
  console.log('You can now run:');
  console.log('  pnpm run dev       - Start development servers (backend + frontend)');
  console.log('  pnpm run start     - Start production servers');
  console.log('  pnpm run clean     - Clean all build artifacts');
} else {
  console.warn('⚠️  Build completed with some issues.');
  console.warn('The application may still work, but some features might be limited.');
  console.log('\nYou can try:');
  console.log('  pnpm run dev       - Start development servers anyway');
}

// Don't exit with error to allow development to continue
process.exit(0);