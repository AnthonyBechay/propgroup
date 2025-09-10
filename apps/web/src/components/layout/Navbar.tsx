'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  Info, 
  Phone, 
  BarChart3,
  Calculator,
  DollarSign,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Heart
} from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsPortalDropdownOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  const portalLinks = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { href: '/portal/market-analysis', label: 'Market Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/portal/calculator', label: 'ROI Calculator', icon: <Calculator className="w-4 h-4" /> },
    { href: '/portal/portfolio', label: 'My Portfolio', icon: <DollarSign className="w-4 h-4" /> },
    { href: '/portal/favorites', label: 'Saved Properties', icon: <Heart className="w-4 h-4" /> },
  ]

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : 'shadow-sm'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">SIP</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 block leading-tight">
                Smart Investment
              </span>
              <span className="text-xs text-gray-500">Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/properties" icon={<Building2 className="w-4 h-4" />} isActive={isActive('/properties')}>
              Properties
            </NavLink>
            
            {/* Portal Dropdown for logged in users */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsPortalDropdownOpen(false), 200)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    pathname.startsWith('/portal')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Portal
                  <ChevronDown className={`w-3 h-3 transition-transform ${
                    isPortalDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {isPortalDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                    {portalLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <NavLink href="/about" icon={<Info className="w-4 h-4" />} isActive={isActive('/about')}>
              About
            </NavLink>
            <NavLink href="/contact" icon={<Phone className="w-4 h-4" />} isActive={isActive('/contact')}>
              Contact
            </NavLink>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                {!pathname.startsWith('/portal') && (
                  <Link href="/portal/dashboard">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      Go to Portal
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={signOut} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <AuthModal>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </AuthModal>
                <AuthModal>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Get Started
                  </Button>
                </AuthModal>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-1 border-t">
            <MobileNavLink 
              href="/properties" 
              icon={<Building2 className="w-4 h-4" />}
              isActive={isActive('/properties')}
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </MobileNavLink>
            
            {/* Mobile Portal Links */}
            {user && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Portal
                </div>
                {portalLinks.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    isActive={isActive(link.href)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </MobileNavLink>
                ))}
                <div className="my-2 border-t"></div>
              </>
            )}
            
            <MobileNavLink 
              href="/about" 
              icon={<Info className="w-4 h-4" />}
              isActive={isActive('/about')}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </MobileNavLink>
            <MobileNavLink 
              href="/contact" 
              icon={<Phone className="w-4 h-4" />}
              isActive={isActive('/contact')}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </MobileNavLink>
            
            {/* Mobile Auth Section */}
            <div className="pt-4 px-4 border-t">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-10 w-full rounded-lg"></div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 font-medium">
                      {user.email}
                    </span>
                  </div>
                  <Button 
                    onClick={signOut} 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthModal>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                    Sign In / Get Started
                  </Button>
                </AuthModal>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Desktop Navigation Link Component
function NavLink({ href, icon, children, isActive }: any) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}

// Mobile Navigation Link Component  
function MobileNavLink({ href, icon, children, isActive, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}
