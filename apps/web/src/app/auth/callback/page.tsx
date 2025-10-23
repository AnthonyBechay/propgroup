'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL
        const error = searchParams.get('error')
        if (error) {
          setStatus('error')
          setMessage(error || 'Authentication failed')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        // Check if backend set auth cookie
        // The backend should have already set the authentication cookie
        // We just need to refresh the user state
        await refreshUser()

        setStatus('success')
        setMessage('Successfully authenticated!')

        // Get redirect path from session storage or use default
        const redirect = typeof window !== 'undefined'
          ? sessionStorage.getItem('auth_redirect') || '/portal/dashboard'
          : '/portal/dashboard'

        // Clear the stored redirect
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth_redirect')
        }

        // Redirect after a short delay
        setTimeout(() => {
          router.push(redirect)
        }, 1500)

      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('Failed to complete authentication')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, router, refreshUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 bg-white shadow-2xl rounded-2xl px-12 py-16 border-2 border-slate-100 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Completing Sign In
              </h2>
              <p className="text-slate-600">
                Please wait while we authenticate your account...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Authentication Successful!
              </h2>
              <p className="text-slate-600">
                {message}
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Redirecting you now...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-slate-600 mb-4">
                {message}
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
