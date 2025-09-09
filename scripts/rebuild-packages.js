// Build script to ensure all packages are properly compiled
const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building packages to fix schema export issue...\n');

const packages = ['config', 'supabase', 'ui'];
let success = true;

// Build each package
for (const pkg of packages) {
  const pkgPath = path.join(__dirname, '..', 'packages', pkg);
  console.log(`Building @propgroup/${pkg}...`);
  
  try {
    // Clean dist folder first
    execSync('rm -rf dist 2>nul || rmdir /s /q dist 2>nul', { 
      cwd: pkgPath, 
      shell: true,
      stdio: 'ignore'
    });
    
    // Build the package
    execSync('npm run build', { 
      cwd: pkgPath, 
      stdio: 'inherit' 
    });
    
    console.log(`✅ Built @propgroup/${pkg}\n`);
  } catch (error) {
    console.error(`❌ Failed to build @propgroup/${pkg}: ${error.message}\n`);
    success = false;
  }
}

if (success) {
  console.log('✅ All packages built successfully!\n');
  console.log('Now restarting the development server...\n');
  
  // Clear Next.js cache
  const webPath = path.join(__dirname, '..', 'apps', 'web');
  try {
    execSync('rm -rf .next 2>nul || rmdir /s /q .next 2>nul', { 
      cwd: webPath, 
      shell: true,
      stdio: 'ignore'
    });
    console.log('✅ Cleared Next.js cache\n');
  } catch (error) {
    console.log('⚠️  Could not clear Next.js cache\n');
  }
  
  console.log('Please run "npm run dev" to start the development server');
} else {
  console.error('⚠️  Some packages failed to build. Please check the errors above.');
}
