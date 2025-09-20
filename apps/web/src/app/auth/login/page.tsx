'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Loader2, Mail, Lock, Shield } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  const supabase = createClient()
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  
  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (userData) {
          // Redirect based on role
          if (userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN') {
            router.push('/admin')
          } else {
            router.push(next)
          }
        }
      }
    }
    
    checkUser()
  }, [router, next, supabase])
  
  const handleLogin = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      if (authData.user) {
        // Get user role
        const { data: userData } = await supabase
          .from('users')
          .select('role, is_active, banned_at')
          .eq('id', authData.user.id)
          .single()
        
        if (userData) {
          // Check if user is banned
          if (!userData.is_active || userData.banned_at) {
            await supabase.auth.signOut()
            router.push('/auth/banned')
            return
          }
          
          // Update last login
          await supabase
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', authData.user.id)
          
          // Redirect based on role
          if (userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN') {
            router.push('/admin')
          } else if (next.startsWith('/admin') && userData.role === 'USER') {
            router.push('/unauthorized')
          } else {
            router.push(next)
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        }
      })
      
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-xl rounded-lg px-8 py-10">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Building2 className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Welcome Back
            </h1>
            
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account
            </p>
            
            {next.startsWith('/admin') && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin Login Required
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={form.handleSubmit(handleLogin)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="admin@example.com"
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...form.register('password')}
                    placeholder="Enter your password"
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <Link 
              href="/auth/signup" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Don't have an account? Sign up
            </Link>
            <br />
            <Link 
              href="/auth/reset-password" 
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-700">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
