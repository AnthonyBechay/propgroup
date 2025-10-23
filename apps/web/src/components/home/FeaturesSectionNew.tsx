'use client'

import {
  Brain,
  Shield,
  TrendingUp,
  Globe,
  Clock,
  Award,
  LineChart,
  Lock,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Advanced machine learning algorithms analyze market trends and predict investment potential with unprecedented accuracy.',
    gradient: 'from-cyan-500 to-blue-600',
    glowColor: 'cyan',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your investments are protected with enterprise-grade encryption and multi-factor authentication protocols.',
    gradient: 'from-purple-500 to-pink-600',
    glowColor: 'purple',
  },
  {
    icon: TrendingUp,
    title: 'Guaranteed Returns',
    description: 'Verified ROI projections backed by comprehensive market analysis and legal guarantees.',
    gradient: 'from-green-500 to-emerald-600',
    glowColor: 'green',
  },
  {
    icon: Globe,
    title: 'Global Portfolio',
    description: 'Access premium properties across 25+ countries with diverse investment opportunities.',
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'blue',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Stay informed with instant notifications on property status, market changes, and investment opportunities.',
    gradient: 'from-orange-500 to-red-600',
    glowColor: 'orange',
  },
  {
    icon: LineChart,
    title: 'Advanced Analytics',
    description: 'Comprehensive dashboards with detailed performance metrics, forecasts, and market comparisons.',
    gradient: 'from-teal-500 to-cyan-600',
    glowColor: 'teal',
  },
]

export function FeaturesSectionNew() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-[#0a1628] dark:via-[#0f2439] dark:to-[#1e293b] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pg-dot-pattern opacity-30" />

      {/* Floating Gradient Blobs */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-10 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full opacity-10 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-white/10 mb-6 pg-fade-in">
            <Zap className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider">
              Platform Features
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-6 pg-fade-in-up pg-stagger-1">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
              Invest Smarter
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 pg-fade-in-up pg-stagger-2">
            Cutting-edge technology meets real estate expertise. Our platform combines AI-driven analytics
            with human insight for optimal investment decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group pg-glass-card bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 sm:p-8 hover:border-blue-300 dark:hover:border-cyan-500/50 transition-all duration-300 pg-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Learn more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-20 text-center pg-fade-in-up pg-stagger-6">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Award-winning platform</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <Lock className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">100% Verified Properties</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
