#!/usr/bin/env node

// Setup script - initializes the project with all necessary configurations
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 PropGroup Setup Wizard\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 Setting up environment variables...\n');
    
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env.local from .env.example\n');
      
      console.log('Please update the following in .env.local:');
      console.log('  - NEXT_PUBLIC_SUPABASE_URL');
      console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('  - SUPABASE_SERVICE_ROLE_KEY\n');
      
      const configure = await question('Would you like to configure these now? (y/n): ');
      
      if (configure.toLowerCase() === 'y') {
        const supabaseUrl = await question('Enter your Supabase URL: ');
        const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
        const supabaseServiceKey = await question('Enter your Supabase Service Role Key: ');
        
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace('your_supabase_project_url', supabaseUrl);
        envContent = envContent.replace('your_supabase_anon_key', supabaseAnonKey);
        envContent = envContent.replace('your_supabase_service_role_key', supabaseServiceKey);
        
        fs.writeFileSync(envPath, envContent);
        console.log('\n✅ Environment variables configured!\n');
      }
    }
  }

  // Install dependencies
  console.log('📦 Installing dependencies...\n');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed!\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }

  // Build packages
  console.log('🔨 Building packages...\n');
  try {
    execSync('npm run build:packages', { stdio: 'inherit' });
    console.log('✅ Packages built!\n');
  } catch (error) {
    console.error('❌ Failed to build packages:', error.message);
    process.exit(1);
  }

  // Check if Supabase CLI is installed
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    console.log('✅ Supabase CLI detected\n');
  } catch {
    console.log('⚠️  Supabase CLI not found. Installing...\n');
    try {
      execSync('npm install -g supabase', { stdio: 'inherit' });
      console.log('✅ Supabase CLI installed!\n');
    } catch (error) {
      console.error('❌ Failed to install Supabase CLI:', error.message);
      console.log('Please install manually: npm install -g supabase\n');
    }
  }

  // Initialize Supabase
  const initSupabase = await question('Would you like to initialize Supabase? (y/n): ');
  if (initSupabase.toLowerCase() === 'y') {
    try {
      // Check if already initialized
      if (!fs.existsSync(path.join(process.cwd(), 'supabase', '.temp'))) {
        execSync('supabase init', { stdio: 'inherit' });
      }
      
      // Link to remote project
      const linkProject = await question('Do you have a Supabase project to link? (y/n): ');
      if (linkProject.toLowerCase() === 'y') {
        const projectRef = await question('Enter your Supabase project reference: ');
        execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
        
        // Push database schema
        const pushSchema = await question('Push database schema to Supabase? (y/n): ');
        if (pushSchema.toLowerCase() === 'y') {
          execSync('supabase db push', { stdio: 'inherit' });
          console.log('✅ Database schema pushed!\n');
          
          // Seed database
          const seedDb = await question('Seed the database with sample data? (y/n): ');
          if (seedDb.toLowerCase() === 'y') {
            execSync('supabase db seed', { stdio: 'inherit' });
            console.log('✅ Database seeded!\n');
          }
        }
        
        // Deploy edge functions
        const deployFunctions = await question('Deploy edge functions? (y/n): ');
        if (deployFunctions.toLowerCase() === 'y') {
          execSync('supabase functions deploy', { stdio: 'inherit' });
          console.log('✅ Edge functions deployed!\n');
        }
      }
    } catch (error) {
      console.error('⚠️  Supabase initialization failed:', error.message);
    }
  }

  console.log('\n🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Review and update .env.local with your configuration');
  console.log('  2. Run "npm run dev" to start the development server');
  console.log('  3. Visit http://localhost:3000 to see your application\n');
  
  rl.close();
}

setup().catch(console.error);
