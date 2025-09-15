'use client'

import { useEffect, useState } from 'react'
import { Building2, Users, Globe, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: Building2,
    value: 500,
    suffix: '+',
    label: 'Properties Analyzed',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: TrendingUp,
    value: 12.5,
    suffix: '%',
    label: 'Average ROI',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Users,
    value: 95,
    suffix: '%',
    label: 'Client Satisfaction',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Globe,
    value: 2.5,
    prefix: '$',
    suffix: 'M+',
    label: 'Investments Facilitated',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '', decimals = 0 }: any) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (end - startValue) * easeOutQuart
      
      setCount(Number(currentValue.toFixed(decimals)))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [end, duration, decimals])

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-gradient-gold">Thousands</span> of Investors
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our track record speaks for itself - consistent returns and satisfied clients worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-full ${stat.bgColor} mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>

                {/* Animated value */}
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                  />
                </div>

                {/* Label */}
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
                  <div className={`absolute inset-0 rounded-2xl ${stat.bgColor} blur-xl`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-300 mb-6">
            Join our growing community of successful investors
          </p>
          <button className="btn-primary">
            <span>Start Your Journey</span>
          </button>
        </div>
      </div>
    </section>
  )
}
