#!/usr/bin/env node

/**
 * Quick start script for PropGroup - bypasses build errors
 * Starts the Next.js development server directly
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🚀 Quick Starting PropGroup (bypassing build)...\n');

const isWindows = os.platform() === 'win32';

function startNextJS() {
  console.log('🌐 Starting Next.js development server directly...\n');
  console.log('Note: Some features may be limited without built packages.\n');
  
  const pnpmCmd = isWindows ? 'pnpm.cmd' : 'pnpm';
  const next = spawn(pnpmCmd, ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..', 'apps', 'web'),
    stdio: 'inherit',
    shell: true,  // This is crucial for Windows
    env: { ...process.env, NODE_ENV: 'development' }
  });

  next.on('error', (err) => {
    console.error('❌ Failed to start Next.js:', err.message);
    console.error('Try running: cd apps/web && pnpm run dev');
    process.exit(1);
  });

  next.on('close', (code) => {
    console.log(`\n📍 Next.js process exited with code ${code}`);
    process.exit(code || 0);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
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

// Start immediately
startNextJS();
