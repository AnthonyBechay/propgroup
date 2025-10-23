'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, Building2, DollarSign, Globe, Award } from 'lucide-react'

const stats = [
  {
    icon: Building2,
    value: '5,000+',
    label: 'Properties Listed',
    suffix: '',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Active Investors',
    suffix: '',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: DollarSign,
    value: '$2.5B',
    label: 'Total Investment Value',
    suffix: '',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    value: '25',
    label: 'Countries',
    suffix: '+',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: TrendingUp,
    value: '12.5',
    label: 'Average ROI',
    suffix: '%',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Award,
    value: '98',
    label: 'Client Satisfaction',
    suffix: '%',
    color: 'from-yellow-500 to-orange-500',
  },
]

function CountUp({ end, suffix = '', duration = 2000 }: { end: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState('0')
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          // Extract numeric value
          const numericEnd = parseFloat(end.replace(/[^0-9.]/g, ''))
          const isDecimal = end.includes('.')
          const isCurrency = end.includes('B') || end.includes('M') || end.includes('K')
          const prefix = end.match(/^[^0-9]*/)?.[0] || ''
          const postfix = end.match(/[^0-9.]+$/)?.[0] || ''

          const startTime = Date.now()
          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const current = numericEnd * easeOutQuart

            if (isDecimal) {
              setCount(`${prefix}${current.toFixed(1)}${postfix}`)
            } else if (isCurrency) {
              setCount(`${prefix}${current.toFixed(1)}${postfix}`)
            } else {
              setCount(`${prefix}${Math.floor(current).toLocaleString()}${postfix}`)
            }

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(end)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <div ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </div>
  )
}

export function StatsSectionNew() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            animation: 'pg-blob-float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            animation: 'pg-blob-float 18s ease-in-out infinite',
            animationDelay: '7s',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 pg-fade-in">
            Trusted by Investors{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 pg-fade-in-up pg-stagger-1">
            Join thousands of successful investors who have transformed their portfolios
            with our platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group pg-glass-card bg-white/5 border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-all duration-300 pg-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>

                  {/* Sparkle indicator */}
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Value */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-sm sm:text-base text-slate-400 font-medium">
                  {stat.label}
                </div>

                {/* Progress bar animation */}
                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000`}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto pg-fade-in-up pg-stagger-6">
          <div className="pg-glass-card bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-cyan-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div>
                <p className="text-lg sm:text-xl text-white font-medium mb-4 leading-relaxed">
                  "PropGroup has revolutionized how we approach real estate investment.
                  The AI-powered insights and verified data give us confidence in every decision."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
                  <div>
                    <div className="font-semibold text-white">Sarah Johnson</div>
                    <div className="text-sm text-slate-400">Portfolio Manager, Global Investments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
