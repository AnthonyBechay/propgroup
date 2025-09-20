#!/usr/bin/env node

/**
 * Start script for PropGroup Frontend only
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🌐 Starting PropGroup Frontend...\n');

// Determine if we're on Windows
const isWindows = os.platform() === 'win32';

// Function to start Next.js frontend
function startFrontend() {
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

  frontend.on('close', (code) => {
    console.log(`\n📍 Frontend process exited with code ${code}`);
    process.exit(code || 0);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    frontend.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  process.on('SIGTERM', () => {
    frontend.kill('SIGTERM');
    process.exit(0);
  });
}

// Start the frontend
startFrontend();
