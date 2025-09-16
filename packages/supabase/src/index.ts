// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-application-name': 'propgroup'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Export auth helpers
export const signUp = async (
  email: string, 
  password: string, 
  metadata?: Record<string, any>
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : ''
  })
  return { data, error }
}

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

// Session management
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Profile management - Simplified to avoid TypeScript issues
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// Storage helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string
    contentType?: string
    upsert?: boolean
  }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options)
  return { data, error }
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (bucket: string, paths: string[]) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(paths)
  return { data, error }
}

// Realtime subscriptions
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
  filter?: Record<string, string>
) => {
  const channel = supabase.channel(`public-${table}`)
  
  const subscription = channel.on(
    // @ts-ignore - Type compatibility issue with Supabase client
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table,
      filter
    },
    callback
  ).subscribe()

  return channel
}

// Edge function invocation
export const invokeFunction = async (
  functionName: string,
  payload?: Record<string, any>,
  options?: {
    headers?: Record<string, string>
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
  }
) => {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
    ...options
  })
  return { data, error }
}

// Export types
export type { Database } from './types/database'
export * from './types/tables'
export * from './hooks'
export * from './utils'
