#!/usr/bin/env node

/**
 * Start script for PropGroup Backend API only
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🔧 Starting PropGroup Backend API...\n');

// Determine if we're on Windows
const isWindows = os.platform() === 'win32';

// Function to start backend API server
function startBackend() {
  const pnpmCmd = isWindows ? 'pnpm.cmd' : 'pnpm';
  const backend = spawn(pnpmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..', 'apps', 'backend'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  backend.on('error', (err) => {
    console.error('❌ Failed to start Backend API:', err.message);
    console.log('\nMake sure you have installed backend dependencies:');
    console.log('  pnpm install');
    process.exit(1);
  });

  backend.on('close', (code) => {
    console.log(`\n📍 Backend process exited with code ${code}`);
    process.exit(code || 0);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    backend.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  process.on('SIGTERM', () => {
    backend.kill('SIGTERM');
    process.exit(0);
  });
}

// Start the backend
startBackend();
