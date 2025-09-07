'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'

export function AuthSection() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Welcome, {user.email}
        </span>
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <AuthModal>
      <Button variant="outline">
        Sign In
      </Button>
    </AuthModal>
  )
}
