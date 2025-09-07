'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AdminHeader() {
  const { user } = useAuth()

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3" />
          <Input
            className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
            <span className="sr-only">View notifications</span>
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="hidden lg:block lg:max-w-xs lg:truncate lg:leading-6">
              <p className="text-sm font-semibold text-gray-900">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-sm font-medium text-red-600">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
