'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AdminHeader() {
  const { user } = useAuth()

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b-2 border-slate-200 bg-white px-4 shadow-md sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center max-w-md">
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 pl-3" />
          <Input
            className="block h-10 w-full border-2 border-slate-200 rounded-xl py-0 pl-10 pr-4 text-gray-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-slate-50"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-slate-100 rounded-xl"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></span>
            <span className="sr-only">View notifications</span>
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-3 lg:gap-x-4">
            <div className="hidden lg:block lg:max-w-xs lg:truncate lg:leading-6">
              <p className="text-sm font-bold text-gray-900">
                {user?.email}
              </p>
              <p className="text-xs text-slate-600 font-medium">Administrator</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
