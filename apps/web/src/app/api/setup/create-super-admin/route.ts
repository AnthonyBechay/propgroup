import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

// This route should only be available in development or with a special secret
const SETUP_SECRET = process.env.SETUP_SECRET || 'dev-setup-only'

export async function POST(request: NextRequest) {
  try {
    // For setup page, allow without authentication
    // In production, you might want to add additional security checks
    const authHeader = request.headers.get('authorization')
    const isDev = process.env.NODE_ENV === 'development'
    const hasCorrectSecret = authHeader === `Bearer ${SETUP_SECRET}`
    const isSetupPage = request.headers.get('referer')?.includes('/setup')
    
    // Allow if: development, has correct secret, or coming from setup page
    if (!isDev && !hasCorrectSecret && !isSetupPage) {
      return NextResponse.json({ 
        error: 'Unauthorized: This endpoint requires proper authentication' 
      }, { status: 401 })
    }

    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Supabase configuration missing' 
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user already exists in Supabase
    const { data: existingUser, error: userError } = await supabase.auth.admin.getUserByEmail(email)
    
    if (userError && userError.message !== 'User not found') {
      return NextResponse.json({ 
        error: `Supabase error: ${userError.message}` 
      }, { status: 500 })
    }
    
    let supabaseUserId
    
    if (existingUser?.user) {
      supabaseUserId = existingUser.user.id
    } else {
      // Create user in Supabase with admin metadata
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          role: 'SUPER_ADMIN',
          is_active: true,
          created_by: 'setup_api'
        }
      })
      
      if (createError) {
        return NextResponse.json({ 
          error: `Failed to create user in Supabase: ${createError.message}` 
        }, { status: 500 })
      }
      
      supabaseUserId = newUser.user.id
    }
    
    // Check if user exists in our database
    const existingDbUser = await prisma.user.findUnique({
      where: { id: supabaseUserId }
    })
    
    if (existingDbUser) {
      if (existingDbUser.role === 'SUPER_ADMIN') {
        return NextResponse.json({ 
          success: true, 
          message: 'User is already a super admin',
          userId: supabaseUserId 
        })
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
      }
    } else {
      // Create user in our database
      await prisma.user.create({
        data: {
          id: supabaseUserId,
          email,
          role: 'SUPER_ADMIN',
          isActive: true,
          emailVerifiedAt: new Date()
        }
      })
    }
    
    // Update Supabase user metadata to ensure consistency
    const { error: updateError } = await supabase.auth.admin.updateUserById(supabaseUserId, {
      user_metadata: {
        role: 'SUPER_ADMIN',
        is_active: true,
        updated_by: 'setup_api'
      }
    })
    
    if (updateError) {
      console.warn('Warning: Could not update Supabase metadata:', updateError.message)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Super admin created successfully',
      userId: supabaseUserId,
      nextSteps: [
        'Go to your app and click "Forgot Password"',
        'Enter your email to set a password',
        'Log in and access the admin panel at /admin'
      ]
    })

  } catch (error) {
    console.error('Error creating super admin:', error)
    return NextResponse.json({ 
      error: 'Failed to create super admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
