#!/usr/bin/env node

/**
 * Start script for PropGroup development environment
 * This script starts the Next.js development server
 * Attempts to build packages but continues even if build fails
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

console.log('🚀 Starting PropGroup Development Environment...\n');

// Determine if we're on Windows
const isWindows = os.platform() === 'win32';

// Function to check if packages are built
function checkPackagesBuilt() {
  const packagesToCheck = [
    'packages/config/dist',
    'packages/supabase/dist',
    'packages/ui/dist'
  ];
  
  for (const pkg of packagesToCheck) {
    const distPath = path.join(__dirname, '..', pkg);
    if (!fs.existsSync(distPath)) {
      return false;
    }
  }
  return true;
}

// Function to build packages (non-blocking)
function attemptBuildPackages() {
  return new Promise((resolve) => {
    console.log('📦 Attempting to build packages...\n');
    
    const nodeCmd = isWindows ? 'node' : 'node';
    exec(`${nodeCmd} scripts/build.js`, { 
      cwd: path.resolve(__dirname, '..'),
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    }, (error, stdout, stderr) => {
      if (error) {
        console.warn('⚠️  Package build had some issues, but continuing anyway...\n');
        if (stdout) console.log(stdout);
      } else {
        console.log('✅ Packages built successfully\n');
      }
      resolve();
    });
  });
}

// Function to start Next.js
function startNextJS() {
  console.log('🌐 Starting Next.js development server...\n');
  
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  const next = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..', 'apps', 'web'),
    stdio: 'inherit',
    shell: true,  // Critical for Windows
    env: { ...process.env, NODE_ENV: 'development' }
  });

  next.on('error', (err) => {
    console.error('❌ Failed to start Next.js:', err.message);
    console.log('\nTry running: npm run dev:quick');
    process.exit(1);
  });

  next.on('close', (code) => {
    console.log(`\n📍 Next.js process exited with code ${code}`);
    process.exit(code || 0);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    next.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  process.on('SIGTERM', () => {
    next.kill('SIGTERM');
    process.exit(0);
  });
}

// Main execution
async function main() {
  try {
    // Check if packages are already built
    const packagesBuilt = checkPackagesBuilt();
    
    if (!packagesBuilt) {
      console.log('📦 Packages not built, attempting to build...\n');
      await attemptBuildPackages();
    } else {
      console.log('✅ Packages already built\n');
    }
    
    // Always start Next.js regardless of build status
    startNextJS();
    
  } catch (error) {
    console.error('❌ Error during startup:', error);
    console.log('\nTrying to start anyway...\n');
    startNextJS();
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Critical error:', error);
  console.log('\nTry running: cd apps/web && npm run dev');
  process.exit(1);
});
