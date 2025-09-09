// Clean script - removes all node_modules and build artifacts
const fs = require('fs');
const path = require('path');

const dirsToClean = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.turbo',
  '.cache',
  'coverage'
];

function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function cleanProject(projectPath) {
  console.log(`Cleaning project at ${projectPath}`);
  
  dirsToClean.forEach(dir => {
    cleanDirectory(path.join(projectPath, dir));
  });

  // Clean package-lock.json if not in root
  if (projectPath !== process.cwd()) {
    const lockFile = path.join(projectPath, 'package-lock.json');
    if (fs.existsSync(lockFile)) {
      console.log(`Removing ${lockFile}`);
      fs.unlinkSync(lockFile);
    }
  }
}

// Clean root
cleanProject(process.cwd());

// Clean apps
const appsDir = path.join(process.cwd(), 'apps');
if (fs.existsSync(appsDir)) {
  fs.readdirSync(appsDir).forEach(app => {
    const appPath = path.join(appsDir, app);
    if (fs.statSync(appPath).isDirectory()) {
      cleanProject(appPath);
    }
  });
}

// Clean packages
const packagesDir = path.join(process.cwd(), 'packages');
if (fs.existsSync(packagesDir)) {
  fs.readdirSync(packagesDir).forEach(pkg => {
    const pkgPath = path.join(packagesDir, pkg);
    if (fs.statSync(pkgPath).isDirectory()) {
      cleanProject(pkgPath);
    }
  });
}

console.log('Clean completed!');
