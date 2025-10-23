import { HeroSectionNew } from '@/components/home/HeroSectionNew'
import { FeaturesSectionSimple } from '@/components/home/FeaturesSectionSimple'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CTASectionSimple } from '@/components/home/CTASectionSimple'

export default async function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      {/* Hero Section with AI Search */}
      <HeroSectionNew />

      {/* Features Section */}
      <FeaturesSectionSimple />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASectionSimple />
    </main>
  )
}
