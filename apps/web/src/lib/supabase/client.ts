import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase environment variables are missing:', {
      url: !!supabaseUrl,
      anonKey: !!supabaseAnonKey
    })
    throw new Error('Supabase environment variables are not configured')
  }

  console.log('✅ Supabase client created with URL:', supabaseUrl.substring(0, 30) + '...')

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
