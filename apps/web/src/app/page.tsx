import { PropertyCard } from '@/components/PropertyCard';
import { InvestmentMatchmaker } from '@/components/InvestmentMatchmaker';
import { prisma } from '@/lib/prisma';
import { getFavoriteStatus } from '@/actions/favorite-actions';
import { createClient } from '@/lib/supabase/server';

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
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Investment Matchmaker */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <InvestmentMatchmaker />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Investment Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked properties with exceptional investment potential and verified returns
            </p>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: any) => (
                <PropertyCard
                  key={property.id}
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No featured properties available at the moment.
              </div>
              <p className="text-gray-400">
                Check back soon for new investment opportunities!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Properties Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">12.5%</div>
              <div className="text-gray-300">Average ROI</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-300">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">$2.5M+</div>
              <div className="text-gray-300">Investments Facilitated</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful investors who trust our platform for their international real estate investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/properties"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get Expert Advice
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
