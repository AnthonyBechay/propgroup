'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function PortalLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        console.log('[PortalLayout] No user, redirecting to login')
        router.push('/auth/login?next=/portal')
        return
      }

      // Check if banned or inactive
      if (!user.isActive || user.bannedAt) {
        console.log('[PortalLayout] User inactive or banned, redirecting')
        router.push('/auth/banned')
        return
      }

      console.log('[PortalLayout] User authenticated:', user.email, user.role)
    }
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user || !user.isActive || user.bannedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // User is authenticated - render portal content
  return <>{children}</>
}
