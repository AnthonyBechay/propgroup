#!/usr/bin/env node

/**
 * Start script for PropGroup development environment
 * This script starts both the backend API server and the Next.js frontend
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
    'packages/db/dist',
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

// Function to start backend API server
function startBackend() {
  console.log('🔧 Starting Backend API server...\n');
  
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  const backend = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..', 'apps', 'backend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  backend.on('error', (err) => {
    console.error('❌ Failed to start Backend API:', err.message);
    console.log('\nMake sure you have installed backend dependencies:');
    console.log('  cd apps/backend && npm install');
    process.exit(1);
  });

  return backend;
}

// Function to start Next.js frontend
function startFrontend() {
  console.log('🌐 Starting Next.js frontend...\n');
  
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  const frontend = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..', 'apps', 'web'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  frontend.on('error', (err) => {
    console.error('❌ Failed to start Next.js:', err.message);
    console.log('\nMake sure you have installed frontend dependencies:');
    console.log('  cd apps/web && npm install');
    process.exit(1);
  });

  return frontend;
}

// Function to handle graceful shutdown
function setupGracefulShutdown(backend, frontend) {
  const shutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    if (backend) backend.kill('SIGTERM');
    if (frontend) frontend.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
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
    
    // Start backend first
    const backend = startBackend();
    
    // Wait a moment for backend to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend
    const frontend = startFrontend();
    
    // Setup graceful shutdown
    setupGracefulShutdown(backend, frontend);
    
    // Handle process exits
    backend.on('close', (code) => {
      console.log(`\n📍 Backend process exited with code ${code}`);
      if (code !== 0) {
        frontend.kill('SIGTERM');
        process.exit(code);
      }
    });

    frontend.on('close', (code) => {
      console.log(`\n📍 Frontend process exited with code ${code}`);
      if (code !== 0) {
        backend.kill('SIGTERM');
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Critical error:', error);
  process.exit(1);
});