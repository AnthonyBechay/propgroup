'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Loader2 } from 'lucide-react'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        console.log('[AdminLayout] No user, redirecting to login')
        router.push('/auth/login?next=/admin')
        return
      }

      // Check if banned or inactive
      if (!user.isActive || user.bannedAt) {
        console.log('[AdminLayout] User inactive or banned, redirecting')
        router.push('/auth/banned')
        return
      }

      // Check if user has admin privileges
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        console.log('[AdminLayout] User not admin, redirecting to unauthorized')
        router.push('/unauthorized')
        return
      }

      console.log('[AdminLayout] User authenticated:', user.email, user.role)
    }
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user || !user.isActive || user.bannedAt || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // User is authenticated and authorized
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
