'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
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
  const { signIn, user, loading } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  
  // Check if already logged in
  useEffect(() => {
    if (user && !loading) {
      // Redirect based on role
      if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push(next)
      }
    }
  }, [user, loading, router, next])
  
  const handleLogin = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await signIn(data.email, data.password)
      
      if (error) {
        setError(error)
        return
      }
      
      // The redirect will be handled by the useEffect above
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    )
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