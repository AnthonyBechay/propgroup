import { HeroSectionNew } from '@/components/home/HeroSectionNew'
import { FeaturesSectionNew } from '@/components/home/FeaturesSectionNew'
import { StatsSectionNew } from '@/components/home/StatsSectionNew'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CTASectionNew } from '@/components/home/CTASectionNew'

export default async function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with AI Search */}
      <HeroSectionNew />

      {/* Features Section */}
      <FeaturesSectionNew />

      {/* Stats Section */}
      <StatsSectionNew />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASectionNew />
    </main>
  )
}
