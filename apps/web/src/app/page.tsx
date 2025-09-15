import { PropertyCard } from '@/components/PropertyCard';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Sparkles } from 'lucide-react';

export default async function Home() {
  // Get current user to check favorites
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch featured properties from the database
  const featuredProperties = await prisma.property.findMany({
    where: { 
      // For now, we'll get the first 6 properties as featured
      // In a real app, you'd have an isFeatured field
    },
    include: { 
      investmentData: true,
      developer: true,
      favoriteProperties: user ? {
        where: {
          userId: user.id
        }
      } : false
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              FEATURED PROPERTIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Investment{' '}
              <span className="text-gradient">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hand-picked properties with exceptional investment potential and verified returns
            </p>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: any, index: number) => (
                <div
                  key={property.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    description={property.description}
                    price={property.price}
                    currency={property.currency}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    country={property.country.toLowerCase()}
                    status={property.status}
                    images={property.images}
                    isGoldenVisaEligible={property.isGoldenVisaEligible}
                    investmentData={{
                      expectedROI: property.investmentData?.expectedROI,
                      rentalYield: property.investmentData?.rentalYield,
                      capitalGrowth: property.investmentData?.capitalGrowth,
                    }}
                    isFavorited={property.favoriteProperties?.length > 0}
                    featured={index < 3}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                Loading amazing properties...
              </div>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/properties"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>View All Properties</span>
              <Sparkles className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
