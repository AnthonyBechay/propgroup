const fs = require('fs');
const path = require('path');

const directoriesToClean = [
  'node_modules',
  'dist',
  '.next',
  '.turbo',
  'packages/config/dist',
  'packages/db/dist',
  'packages/ui/dist',
  'apps/web/.next',
  'apps/web/dist'
];

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

console.log('🧹 Cleaning project...');

directoriesToClean.forEach(dir => {
  const fullPath = path.resolve(dir);
  removeDirectory(fullPath);
});

console.log('✅ Clean completed!');
