import { 
  Building2, 
  Users, 
  Target, 
  Globe, 
  Shield, 
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: Building2,
      title: 'Verified Properties',
      description: 'Every property is thoroughly vetted for investment potential and legal compliance.'
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Advanced analytics and market research to identify the best investment opportunities.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security and data protection for all your investment information.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Access to premium properties across multiple countries and markets.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Dedicated investment advisors to guide you through every step of the process.'
    },
    {
      icon: Award,
      title: 'Proven Track Record',
      description: 'Over $2.5M in successful investments with an average 12.5% ROI.'
    }
  ]

  const stats = [
    { number: '500+', label: 'Properties Analyzed' },
    { number: '12.5%', label: 'Average ROI' },
    { number: '95%', label: 'Client Satisfaction' },
    { number: '$2.5M+', label: 'Investments Facilitated' }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      description: '15+ years in real estate investment and international property development.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Analytics',
      description: 'Former investment banker with expertise in market analysis and risk assessment.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Legal Director',
      description: 'International property law specialist ensuring compliance across all markets.',
      image: '/api/placeholder/150/150'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Smart Investment Portal
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Your trusted partner in international real estate investment
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              We combine cutting-edge technology with deep market expertise to help you discover, 
              analyze, and invest in the world's most promising real estate opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              To democratize access to premium international real estate investments by providing 
              transparent, data-driven insights and comprehensive support to investors of all levels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Precision</h3>
                <p className="text-gray-600">
                  Every property is carefully selected based on rigorous investment criteria and market analysis.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Security</h3>
                <p className="text-gray-600">
                  Your investments are protected by comprehensive due diligence and legal compliance.
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth</h3>
                <p className="text-gray-600">
                  We focus on properties with strong potential for capital appreciation and rental income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Us
              </h2>
              <p className="text-xl text-gray-600">
                We provide everything you need to make informed investment decisions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Impact
              </h2>
              <p className="text-xl text-blue-100">
                Numbers that speak to our success and your potential
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-200 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                Experienced professionals dedicated to your investment success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful investors who trust our platform for their international real estate investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/properties"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
