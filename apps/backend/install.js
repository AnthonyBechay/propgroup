#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up PropGroup Backend...\n');

// Check if we're in the backend directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the backend directory');
  process.exit(1);
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('\n🔧 Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  // Create .env file if it doesn't exist
  if (!fs.existsSync('.env')) {
    console.log('\n📝 Creating .env file...');
    const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/propgroup?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"
`;
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file. Please update the DATABASE_URL and JWT_SECRET values.');
  }
  
  console.log('\n✅ Backend setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Update the DATABASE_URL in .env to point to your PostgreSQL database');
  console.log('2. Update the JWT_SECRET in .env to a secure random string');
  console.log('3. Run "npm run db:push" to create the database schema');
  console.log('4. Run "npm run db:seed" to populate with sample data');
  console.log('5. Run "npm run dev" to start the development server');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
