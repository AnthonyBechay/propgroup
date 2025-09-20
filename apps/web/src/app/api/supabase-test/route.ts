import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test 1: Check if environment variables are set
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
        process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : 'NOT_SET',
    }
    
    // Test 2: Try to get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Test 3: Try to query a simple table
    const { data: testData, error: queryError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    // Test 4: Check if we can access auth
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      tests: {
        environmentVariables: envCheck,
        userAuth: {
          success: !userError,
          error: userError?.message || null,
          user: user ? { id: user.id, email: user.email } : null
        },
        databaseQuery: {
          success: !queryError,
          error: queryError?.message || null,
          data: testData
        },
        session: {
          success: !sessionError,
          error: sessionError?.message || null,
          hasSession: !!session
        }
      }
    })
  } catch (error) {
    console.error('Supabase test failed:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
