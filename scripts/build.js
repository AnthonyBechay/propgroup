const { spawn } = require('child_process');
const path = require('path');

console.log('🔨 Building Smart Investment Portal...');

async function runCommand(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')} in ${cwd}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: cwd
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function build() {
  try {
    // 1. Clean previous builds
    console.log('🧹 Cleaning previous builds...');
    await runCommand('node', ['scripts/clean.js']);

    // 2. Install dependencies
    console.log('📦 Installing dependencies...');
    await runCommand('npm', ['install']);

    // 3. Generate Prisma client
    console.log('🗄️ Generating Prisma client...');
    await runCommand('npm', ['run', 'db:generate']);

    // 4. Push database schema
    console.log('📊 Pushing database schema...');
    await runCommand('npm', ['run', 'db:push']);

    // 5. Build packages
    console.log('📦 Building packages...');
    await runCommand('npm', ['run', 'build:packages']);

    // 6. Build web app
    console.log('🌐 Building web application...');
    await runCommand('npm', ['run', 'build:web']);

    console.log('✅ Build completed successfully!');
    console.log('🚀 You can now run: npm start');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
