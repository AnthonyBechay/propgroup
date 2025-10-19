'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Home,
  Building2,
  Users,
  Shield,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Bot
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  
  useEffect(() => {
    const getUserRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get role from user metadata instead of database
        const role = user.user_metadata?.role || 'USER'
        setUserRole(role)
      }
    }
    
    getUserRole()
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Properties', href: '/admin/properties', icon: Building2 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'AI Settings', href: '/admin/ai-settings', icon: Bot },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">
                Admin Panel
              </span>
              {userRole === 'SUPER_ADMIN' && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Super Admin
                </span>
              )}
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href === '/admin/users' && pathname.startsWith('/admin/users'))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                          isActive
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-700 hover:text-red-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? 'text-red-700' : 'text-gray-400 group-hover:text-red-700'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <button
                onClick={signOut}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-700"
              >
                <LogOut
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-700"
                  aria-hidden="true"
                />
                Sign out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
