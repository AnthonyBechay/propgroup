const { spawn } = require('child_process');
const path = require('path');

console.log('🏃 Running Smart Investment Portal...');

// Check if Supabase is running
const checkSupabase = spawn('npx', ['supabase', 'status'], {
  stdio: 'pipe',
  shell: true
});

let supabaseOutput = '';
checkSupabase.stdout.on('data', (data) => {
  supabaseOutput += data.toString();
});

checkSupabase.on('close', (code) => {
  if (supabaseOutput.includes('supabase local development setup is running')) {
    console.log('✅ Supabase is already running');
    startNext();
  } else {
    console.log('Starting Supabase first...');
    startSupabase();
  }
});

function startSupabase() {
  const supabase = spawn('npx', ['supabase', 'start'], {
    stdio: 'inherit',
    shell: true
  });

  supabase.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Supabase started successfully');
      startNext();
    } else {
      console.error('❌ Failed to start Supabase');
    }
  });
}

function startNext() {
  console.log('Starting Next.js development server...');
  const next = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.resolve('apps/web')
  });

  next.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  process.exit(0);
});
