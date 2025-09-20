#!/usr/bin/env node

/**
 * Create Super Admin Script
 * 
 * This script creates the initial super admin user following Supabase best practices.
 * Run this once after setting up your database to create your first super admin.
 * 
 * Usage:
 *   node scripts/create-super-admin.js your-email@example.com
 * 
 * Or set environment variables:
 *   SUPER_ADMIN_EMAIL=your-email@example.com node scripts/create-super-admin.js
 */

const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@propgroup/db')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const databaseUrl = process.env.DATABASE_URL

if (!supabaseUrl || !supabaseServiceKey || !databaseUrl) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('   - DATABASE_URL')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const prisma = new PrismaClient()

async function createSuperAdmin(email) {
  try {
    console.log(`🚀 Creating super admin for: ${email}`)
    
    // Check if user already exists in Supabase
    const { data: existingUser, error: userError } = await supabase.auth.admin.getUserByEmail(email)
    
    if (userError && userError.message !== 'User not found') {
      throw new Error(`Supabase error: ${userError.message}`)
    }
    
    let supabaseUserId
    
    if (existingUser?.user) {
      console.log('✅ User already exists in Supabase')
      supabaseUserId = existingUser.user.id
    } else {
      // Create user in Supabase with admin metadata
      console.log('📧 Creating user in Supabase...')
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          role: 'SUPER_ADMIN',
          is_active: true,
          created_by: 'setup_script'
        }
      })
      
      if (createError) {
        throw new Error(`Failed to create user in Supabase: ${createError.message}`)
      }
      
      supabaseUserId = newUser.user.id
      console.log('✅ User created in Supabase')
    }
    
    // Check if user exists in our database
    const existingDbUser = await prisma.user.findUnique({
      where: { id: supabaseUserId }
    })
    
    if (existingDbUser) {
      if (existingDbUser.role === 'SUPER_ADMIN') {
        console.log('✅ User is already a super admin in database')
        return { success: true, message: 'Super admin already exists' }
      } else {
        // Update existing user to super admin
        await prisma.user.update({
          where: { id: supabaseUserId },
          data: {
            role: 'SUPER_ADMIN',
            isActive: true,
            emailVerifiedAt: new Date()
          }
        })
        console.log('✅ Updated user to super admin in database')
      }
    } else {
      // Create user in our database
      console.log('💾 Creating user in database...')
      await prisma.user.create({
        data: {
          id: supabaseUserId,
          email,
          role: 'SUPER_ADMIN',
          isActive: true,
          emailVerifiedAt: new Date()
        }
      })
      console.log('✅ User created in database')
    }
    
    // Update Supabase user metadata to ensure consistency
    const { error: updateError } = await supabase.auth.admin.updateUserById(supabaseUserId, {
      user_metadata: {
        role: 'SUPER_ADMIN',
        is_active: true,
        updated_by: 'setup_script'
      }
    })
    
    if (updateError) {
      console.warn('⚠️  Warning: Could not update Supabase metadata:', updateError.message)
    } else {
      console.log('✅ Updated Supabase user metadata')
    }
    
    console.log('\n🎉 Super admin created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`🆔 User ID: ${supabaseUserId}`)
    console.log('\n📝 Next steps:')
    console.log('1. Go to your app and click "Forgot Password"')
    console.log('2. Enter your email to set a password')
    console.log('3. Log in and access the admin panel at /admin')
    
    return { success: true, userId: supabaseUserId }
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Main execution
async function main() {
  const email = process.argv[2] || process.env.SUPER_ADMIN_EMAIL
  
  if (!email) {
    console.error('❌ Please provide an email address:')
    console.error('   node scripts/create-super-admin.js your-email@example.com')
    console.error('   or set SUPER_ADMIN_EMAIL environment variable')
    process.exit(1)
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error('❌ Please provide a valid email address')
    process.exit(1)
  }
  
  try {
    await createSuperAdmin(email)
    process.exit(0)
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { createSuperAdmin }
