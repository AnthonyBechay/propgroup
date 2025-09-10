'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { isRefreshTokenError } from '@/lib/auth-helpers'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  error: AuthError | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          // Handle refresh token errors silently
          if (isRefreshTokenError(sessionError)) {
            // Clear invalid session silently
            await supabase.auth.signOut().catch(() => {})
            setUser(null)
            setError(null) // Don't show error for expired sessions
          } else {
            setError(sessionError)
          }
        } else {
          setUser(session?.user ?? null)
          setError(null)
        }
      } catch (err) {
        // Handle unexpected errors silently
        console.error('Auth initialization error:', err)
        setUser(null)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Clear errors on successful auth events
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          setError(null)
        }
        
        // Update user state
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setError(null)
      setUser(null)
    } catch (err) {
      // Even if sign out fails, clear the user state
      setUser(null)
      console.error('Sign out error:', err)
    }
  }

  const value = {
    user,
    loading,
    signOut,
    error,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
