'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SIP</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Smart Investment Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/properties" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Properties
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4">
            {loading ? (
              <div data-testid="loading-skeleton" className="animate-pulse bg-gray-200 h-9 w-20 rounded"></div>
            ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <Link href="/portal">
                    <Button size="sm">
                      Portal
                    </Button>
                  </Link>
                  <Button onClick={signOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthModal>
                  <Button size="sm">
                    Sign In
                  </Button>
                </AuthModal>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link 
                href="/properties" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-9 w-full rounded"></div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {user.email}
                    </div>
                    <Link href="/portal" className="block">
                      <Button size="sm" className="w-full">
                        Portal
                      </Button>
                    </Link>
                    <Button onClick={signOut} variant="outline" size="sm" className="w-full">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <AuthModal>
                    <Button size="sm" className="w-full">
                      Sign In
                    </Button>
                  </AuthModal>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
