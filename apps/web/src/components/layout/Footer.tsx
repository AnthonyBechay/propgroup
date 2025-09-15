'use client'

import Link from 'next/link'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  Globe,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Successfully subscribed!",
      description: "You'll receive our latest investment opportunities and market insights.",
    })
    
    setEmail('')
    setIsSubscribing(false)
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Stay Ahead of the Market</h3>
                <p className="text-gray-300">
                  Get exclusive investment opportunities and market insights delivered to your inbox.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 min-w-[120px]"
                >
                  {isSubscribing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                      Subscribing
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">PropGroup</h3>
                <p className="text-xs text-gray-400">Smart Investments</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner in international real estate investment. 
              We combine technology with expertise to deliver exceptional investment opportunities.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Invest
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/portal/calculator" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/portal/market-analysis" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link href="/portal/portfolio" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  Investment Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  Investment Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  Investment Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  123 Investment Plaza<br />
                  Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <a href="tel:+97142345678" className="text-sm hover:text-white transition-colors">
                  +971 4 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <a href="mailto:invest@propgroup.com" className="text-sm hover:text-white transition-colors">
                  invest@propgroup.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure Transactions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Licensed & Regulated</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Global Reach</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm">12.5% Avg ROI</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} PropGroup. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
      </div>
    </footer>
  )
}
