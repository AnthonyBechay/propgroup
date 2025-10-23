'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASectionSimple() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#0a1628] to-[#1e293b] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Start{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Investing?
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors building wealth through verified real estate opportunities
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Verified properties</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Expert support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl shadow-xl transition-all"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>

            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-10 text-base font-semibold bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-xl backdrop-blur-sm transition-all"
              >
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
