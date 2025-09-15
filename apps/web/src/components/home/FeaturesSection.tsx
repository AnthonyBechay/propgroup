'use client'

import { 
  TrendingUp, 
  Shield, 
  Globe, 
  BarChart3, 
  Users, 
  Award,
  Zap,
  Lock
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'High ROI Opportunities',
    description: 'Access properties with proven track records of 12-15% annual returns',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Bank-level security with encrypted transactions and escrow protection',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'Global Portfolio',
    description: 'Diversify across 25+ countries with emerging and stable markets',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'AI-powered market analysis and predictive investment insights',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Personal investment advisors with 15+ years of experience',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: Award,
    title: 'Golden Visa Support',
    description: 'Complete assistance for residency and citizenship programs',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-500/10',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="text-gradient">PropGroup</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We combine cutting-edge technology with deep market expertise to deliver 
            exceptional investment opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgColor} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              
              {/* Icon */}
              <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`} />
            </div>
          ))}
        </div>

        {/* Additional features row */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Zap className="w-10 h-10 mx-auto mb-2" />
              <h4 className="text-xl font-bold">Instant Processing</h4>
              <p className="text-blue-100">Quick property evaluation and approval within 24 hours</p>
            </div>
            <div className="space-y-2">
              <Lock className="w-10 h-10 mx-auto mb-2" />
              <h4 className="text-xl font-bold">Legal Protection</h4>
              <p className="text-blue-100">Full legal documentation and ownership verification</p>
            </div>
            <div className="space-y-2">
              <Award className="w-10 h-10 mx-auto mb-2" />
              <h4 className="text-xl font-bold">Best Price Guarantee</h4>
              <p className="text-blue-100">Exclusive deals with 5-10% below market prices</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
