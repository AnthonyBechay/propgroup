#!/usr/bin/env node

// Health check script - verifies all backend services are running
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function checkUrl(url, name) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`${colors.green}✅ ${name}: OK${colors.reset}`);
        resolve(true);
      } else {
        console.log(`${colors.red}❌ ${name}: HTTP ${res.statusCode}${colors.reset}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`${colors.red}❌ ${name}: ${err.message}${colors.reset}`);
      resolve(false);
    });
  });
}

async function checkCommand(command, name) {
  try {
    execSync(command, { stdio: 'ignore' });
    console.log(`${colors.green}✅ ${name}: Installed${colors.reset}`);
    return true;
  } catch {
    console.log(`${colors.red}❌ ${name}: Not installed${colors.reset}`);
    return false;
  }
}

async function checkSupabase() {
  try {
    const output = execSync('supabase status', { encoding: 'utf8' });
    const isRunning = output.includes('API URL');
    
    if (isRunning) {
      console.log(`${colors.green}✅ Supabase: Running locally${colors.reset}`);
      
      // Parse URLs from status output
      const apiMatch = output.match(/API URL:\s+(http[^\s]+)/);
      const studioMatch = output.match(/Studio URL:\s+(http[^\s]+)/);
      const inbucketMatch = output.match(/Inbucket URL:\s+(http[^\s]+)/);
      
      if (apiMatch) {
        await checkUrl(apiMatch[1], 'Supabase API');
      }
      if (studioMatch) {
        await checkUrl(studioMatch[1], 'Supabase Studio');
      }
      if (inbucketMatch) {
        await checkUrl(inbucketMatch[1], 'Inbucket (Email)');
      }
    } else {
      console.log(`${colors.yellow}⚠️  Supabase: Not running locally${colors.reset}`);
      console.log(`   Run 'npm run supabase:start' to start local Supabase`);
    }
    
    return isRunning;
  } catch (error) {
    console.log(`${colors.red}❌ Supabase: Error checking status${colors.reset}`);
    return false;
  }
}

async function checkEnvironment() {
  console.log(`${colors.blue}🔍 Checking environment variables...${colors.reset}\n`);
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const optional = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'SENDGRID_API_KEY',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  let allRequired = true;
  
  required.forEach(key => {
    if (process.env[key]) {
      console.log(`${colors.green}✅ ${key}: Set${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${key}: Missing (Required)${colors.reset}`);
      allRequired = false;
    }
  });
  
  optional.forEach(key => {
    if (process.env[key]) {
      console.log(`${colors.green}✅ ${key}: Set${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  ${key}: Missing (Optional)${colors.reset}`);
    }
  });
  
  return allRequired;
}

async function healthCheck() {
  console.log(`${colors.blue}🏥 PropGroup Backend Health Check${colors.reset}\n`);
  
  // Check CLI tools
  console.log(`${colors.blue}🔧 Checking CLI tools...${colors.reset}\n`);
  await checkCommand('node --version', 'Node.js');
  await checkCommand('npm --version', 'npm');
  await checkCommand('supabase --version', 'Supabase CLI');
  await checkCommand('vercel --version', 'Vercel CLI');
  
  console.log();
  
  // Check environment variables
  const envOk = await checkEnvironment();
  
  console.log();
  
  // Check Supabase
  console.log(`${colors.blue}🗄️  Checking Supabase...${colors.reset}\n`);
  const supabaseOk = await checkSupabase();
  
  console.log();
  
  // Check remote Supabase if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log(`${colors.blue}☁️  Checking remote Supabase...${colors.reset}\n`);
    await checkUrl(process.env.NEXT_PUBLIC_SUPABASE_URL, 'Remote Supabase');
  }
  
  console.log();
  
  // Summary
  console.log(`${colors.blue}📊 Summary${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(40)}${colors.reset}`);
  
  if (envOk && supabaseOk) {
    console.log(`${colors.green}✅ All backend services are healthy!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Some services need attention${colors.reset}`);
    console.log(`\nNext steps:`);
    
    if (!envOk) {
      console.log('  1. Set up missing environment variables in .env.local');
    }
    if (!supabaseOk) {
      console.log('  2. Start Supabase locally: npm run supabase:start');
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

healthCheck().catch(console.error);
