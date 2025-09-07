'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { contactFormSchema } from '@propgroup/config'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Button,
} from '@/components/ui/button'
import {
  Input,
} from '@/components/ui/input'
import {
  Label,
} from '@/components/ui/label'

interface AuthModalProps {
  children: React.ReactNode
}

type LoginFormData = {
  email: string
  password: string
}

type SignupFormData = {
  email: string
  password: string
  confirmPassword: string
}

const loginSchema = contactFormSchema.pick({ email: true }).extend({
  password: contactFormSchema.shape.email, // Using email validation as placeholder
})

const signupSchema = loginSchema.extend({
  confirmPassword: contactFormSchema.shape.email,
})

export function AuthModal({ children }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Login successful!')
        setIsOpen(false)
        loginForm.reset()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email for verification link!')
        setIsOpen(false)
        signupForm.reset()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSuccess('Logged out successfully!')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? 'Enter your email and password to sign in to your account.'
              : 'Enter your details to create a new account.'
            }
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                {...loginForm.register('email')}
                placeholder="Enter your email"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                {...loginForm.register('password')}
                placeholder="Enter your password"
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(false)}
                className="w-full"
              >
                Don't have an account? Sign Up
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                {...signupForm.register('email')}
                placeholder="Enter your email"
              />
              {signupForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                {...signupForm.register('password')}
                placeholder="Enter your password"
              />
              {signupForm.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                {...signupForm.register('confirmPassword')}
                placeholder="Confirm your password"
              />
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(true)}
                className="w-full"
              >
                Already have an account? Sign In
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
