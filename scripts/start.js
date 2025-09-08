const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Smart Investment Portal...');

// Start Supabase
console.log('Starting Supabase...');
const supabase = spawn('npx', ['supabase', 'start'], {
  stdio: 'inherit',
  shell: true
});

supabase.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Supabase started successfully');
    
    // Start the development server
    console.log('Starting Next.js development server...');
    const next = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: path.resolve('apps/web')
    });

    next.on('close', (code) => {
      console.log(`Next.js process exited with code ${code}`);
    });
  } else {
    console.error('❌ Failed to start Supabase');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  supabase.kill('SIGINT');
  process.exit(0);
});
