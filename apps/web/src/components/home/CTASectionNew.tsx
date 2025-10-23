'use client'

import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const benefits = [
  'AI-powered property recommendations',
  'Verified investment opportunities',
  'Real-time market analytics',
  'Expert consultation included',
  'No hidden fees',
  '24/7 platform access',
]

export function CTASectionNew() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-[#0a1628] dark:via-[#0f2439] dark:to-[#1e293b] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
            animation: 'pg-blob-float 15s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            animation: 'pg-blob-float 18s ease-in-out infinite',
            animationDelay: '7s',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main CTA Card */}
          <div className="pg-glass-card bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left side - Content */}
              <div className="p-8 sm:p-10 lg:p-12">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 dark:border-cyan-500/30 mb-6 pg-fade-in">
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                    Start Today
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 pg-fade-in-up pg-stagger-1">
                  Ready to{' '}
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                    Transform
                  </span>{' '}
                  Your Portfolio?
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 dark:text-slate-300 mb-8 pg-fade-in-up pg-stagger-2">
                  Join thousands of successful investors who trust PropGroup for their
                  real estate investment needs. Start building your global property portfolio today.
                </p>

                {/* Benefits List */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8 pg-fade-in-up pg-stagger-3">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pg-fade-in-up pg-stagger-4">
                  <Link href="/auth/signup" className="flex-1 sm:flex-initial">
                    <Button
                      size="lg"
                      className="w-full h-14 px-8 text-base font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </Link>

                  <Link href="/properties" className="flex-1 sm:flex-initial">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-14 px-8 text-base font-semibold bg-white/50 dark:bg-white/5 border-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/30 rounded-xl backdrop-blur-sm transition-all"
                    >
                      Browse Properties
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 pg-fade-in-up pg-stagger-5">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Visual */}
              <div className="relative lg:block hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 dark:from-cyan-500/10 dark:to-blue-600/10" />

                {/* Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="relative w-full h-full">
                    {/* Floating cards animation */}
                    <div
                      className="absolute top-8 right-8 w-48 h-32 bg-white dark:bg-white/10 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20 p-4 backdrop-blur-sm"
                      style={{ animation: 'pg-float 6s ease-in-out infinite' }}
                    >
                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-2">Monthly ROI</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        +12.5%
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-500" />
                      </div>
                    </div>

                    <div
                      className="absolute bottom-8 left-8 w-48 h-32 bg-white dark:bg-white/10 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20 p-4 backdrop-blur-sm"
                      style={{ animation: 'pg-float 6s ease-in-out infinite', animationDelay: '2s' }}
                    >
                      <div className="text-xs text-gray-500 dark:text-slate-400 mb-2">Portfolio Value</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        $2.5M
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +18.5% this year
                      </div>
                    </div>

                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center"
                      style={{ animation: 'pg-pulse-glow 2s ease-in-out infinite' }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center pg-fade-in-up pg-stagger-6">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
              Trusted by leading investment firms worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
              {/* Placeholder for company logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-24 h-12 bg-gray-300 dark:bg-white/10 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
