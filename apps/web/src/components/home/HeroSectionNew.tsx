'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, TrendingUp, Globe, Shield, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIPropertySearch } from '@/components/ai/AIPropertySearch'
import Link from 'next/link'

export function HeroSectionNew() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'traditional'>('ai')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b]">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large animated blob - blue */}
        <div
          className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
            animation: 'pg-blob-float 20s ease-in-out infinite',
          }}
        />

        {/* Medium animated blob - purple */}
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            animation: 'pg-blob-float 18s ease-in-out infinite',
            animationDelay: '7s',
          }}
        />

        {/* Small animated blob - cyan */}
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            animation: 'pg-blob-float 16s ease-in-out infinite',
            animationDelay: '14s',
          }}
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pg-grid-pattern opacity-[0.02]" />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">

          {/* Top Badge */}
          <div className="flex justify-center mb-8 sm:mb-10 pg-fade-in">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 shadow-xl">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-wider">
                AI-Powered Investment Platform
              </span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight pg-fade-in-up pg-stagger-1">
              <span className="block text-white mb-2 sm:mb-3">
                Discover Your Next
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Investment Opportunity
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 pg-fade-in-up pg-stagger-2">
              Unlock global real estate potential with AI-driven insights,
              <span className="text-cyan-400 font-semibold"> verified data</span>, and
              <span className="text-purple-400 font-semibold"> guaranteed returns</span>.
            </p>
          </div>

          {/* AI Search Section */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16 pg-fade-in-up pg-stagger-3">
            {/* Tab Switcher */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1.5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`
                    relative px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300
                    ${activeTab === 'ai'
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                    }
                  `}
                >
                  {activeTab === 'ai' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Search
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('traditional')}
                  className={`
                    relative px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300
                    ${activeTab === 'traditional'
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                    }
                  `}
                >
                  {activeTab === 'traditional' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 shadow-lg" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Traditional
                  </span>
                </button>
              </div>
            </div>

            {/* Search Interface */}
            <div className="pg-glass-card bg-white/5 border-white/10 p-4 sm:p-6 lg:p-8 shadow-2xl">
              {activeTab === 'ai' ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold text-white">Try AI Search:</span> Describe your dream property in natural language.
                      <br />
                      <span className="text-xs text-slate-400">Example: "3-bedroom villa in Cyprus under $500k with sea view and high ROI"</span>
                    </div>
                  </div>

                  <AIPropertySearch
                    variant="inline"
                    placeholder="Describe your ideal investment property..."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Location"
                    className="px-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all outline-none"
                  />
                  <select className="px-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all outline-none">
                    <option value="">Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <select className="px-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all outline-none">
                    <option value="">Budget</option>
                    <option value="0-500000">Under $500K</option>
                    <option value="500000-1000000">$500K - $1M</option>
                    <option value="1000000-">Above $1M</option>
                  </select>
                  <Button className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-4xl mx-auto px-4 pg-fade-in-up pg-stagger-4">
            <div className="pg-glass-card bg-white/5 border-white/10 p-4 sm:p-6 text-center group hover:border-cyan-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">12.5%</div>
              <div className="text-xs sm:text-sm text-slate-400">Average ROI</div>
            </div>

            <div className="pg-glass-card bg-white/5 border-white/10 p-4 sm:p-6 text-center group hover:border-blue-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">25+</div>
              <div className="text-xs sm:text-sm text-slate-400">Countries</div>
            </div>

            <div className="pg-glass-card bg-white/5 border-white/10 p-4 sm:p-6 text-center group hover:border-purple-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-xs sm:text-sm text-slate-400">Secure & Verified</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 pg-fade-in-up pg-stagger-5">
            <Link href="/properties">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all"
              >
                <span className="flex items-center gap-2 sm:gap-3">
                  Start Investing
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>

            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-2xl backdrop-blur-sm transition-all"
              >
                <span className="flex items-center gap-2 sm:gap-3">
                  Browse Properties
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-20 pg-fade-in-up pg-stagger-6">
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1 group-hover:border-cyan-400 transition-colors">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce group-hover:bg-cyan-400 transition-colors" />
          </div>
        </div>
      </div>
    </section>
  )
}
