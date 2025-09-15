'use client'

import { ArrowRight, Sparkles, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            LIMITED TIME OFFER
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Build Your
            <br />
            <span className="text-gradient-gold">Wealth Portfolio?</span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful investors who trust PropGroup for their 
            international real estate investments. Get started with a free consultation today.
          </p>

          {/* Benefits list */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white/90">Free Portfolio Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white/90">Personalized Strategy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white/90">Expert Guidance</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all px-8 py-6 text-lg font-semibold"
              >
                <span className="flex items-center gap-2">
                  Start Investing Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Free Consultation
                </span>
              </Button>
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-10 flex items-center justify-center gap-2 text-white/80">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">100% Secure • No Hidden Fees • Cancel Anytime</span>
          </div>

          {/* Urgency indicator */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span>12 investors joined today</span>
          </div>
        </div>
      </div>
    </section>
  )
}
