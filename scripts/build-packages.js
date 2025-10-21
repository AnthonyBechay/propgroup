#!/usr/bin/env node

/**
 * Build all workspace packages in the correct order
 * Used by postinstall and build scripts
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

console.log('🏗️  Building packages...\n');

/**
 * Build a package
 */
function buildPackage(name, pkgPath) {
  console.log(`Building @propgroup/${name}...`);

  const fullPath = path.join(rootDir, pkgPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Warning: ${pkgPath} does not exist, skipping...`);
    return false;
  }

  const distPath = path.join(fullPath, 'dist');

  // Clean dist directory
  console.log(`  Cleaning ${name}/dist...`);
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }

  try {
    // Check if it's a TypeScript package
    const tsConfigPath = path.join(fullPath, 'tsconfig.json');
    const hasTSConfig = fs.existsSync(tsConfigPath);

    if (name === 'db') {
      // DB package needs Prisma generation
      console.log('  Generating Prisma client...');
      execSync('prisma generate', {
        cwd: fullPath,
        stdio: 'inherit'
      });

      if (hasTSConfig) {
        console.log('  Compiling TypeScript...');
        execSync('npx tsc', {
          cwd: fullPath,
          stdio: 'inherit'
        });
      }
    } else if (hasTSConfig) {
      // Regular TypeScript package
      console.log('  Compiling TypeScript...');
      execSync('npx tsc', {
        cwd: fullPath,
        stdio: 'inherit'
      });
    } else {
      // No build needed, just create dist directory
      fs.mkdirSync(distPath, { recursive: true });

      // Copy src to dist for non-TS packages
      const srcPath = path.join(fullPath, 'src');
      if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, distPath, { recursive: true });
      }
    }

    console.log(`✅ Built @propgroup/${name}\n`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build @propgroup/${name}`);
    console.error(error.message);
    return false;
  }
}

// Packages to build in order (dependencies first)
const packages = [
  { name: 'config', path: 'packages/config' },
  { name: 'db', path: 'packages/db' },
  { name: 'ui', path: 'packages/ui' },
];

let failedPackages = [];

for (const pkg of packages) {
  const success = buildPackage(pkg.name, pkg.path);
  if (!success) {
    failedPackages.push(pkg.name);
  }
}

if (failedPackages.length > 0) {
  console.warn(`\n⚠️  Some packages failed to build: ${failedPackages.join(', ')}`);
  console.warn('    The application may still work with fallback builds.\n');
} else {
  console.log('✅ All packages built successfully!\n');
}
