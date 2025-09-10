import { PropertyCard } from '@propgroup/ui';
import { prisma } from '@/lib/prisma';
import { SearchParams } from '@/types/search';

interface PropertiesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  // Await searchParams as it's now a Promise in Next.js 15
  const params = await searchParams;
  
  // Build the where clause based on search parameters
  const where: any = {};
  
  if (params.country) {
    where.country = params.country.toUpperCase();
  }
  
  if (params.status) {
    where.status = params.status.toUpperCase();
  }
  
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      where.price.gte = parseInt(params.minPrice);
    }
    if (params.maxPrice) {
      where.price.lte = parseInt(params.maxPrice);
    }
  }

  // Handle budget parameter from investment matchmaker
  if (params.budget) {
    where.price = {
      ...where.price,
      lte: parseInt(params.budget)
    };
  }

  // Handle goal parameter
  if (params.goal === 'HIGH_ROI') {
    // You might want to filter or sort by ROI here
    // For now, we'll just include all properties
  } else if (params.goal === 'GOLDEN_VISA') {
    where.isGoldenVisaEligible = true;
  }

  // Fetch properties from the database
  const properties = await prisma.property.findMany({
    where,
    include: { 
      investmentData: true,
      developer: true 
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Investment Properties
          </h1>
          <p className="text-xl text-gray-600">
            Discover your next investment opportunity from our curated selection
          </p>
        </div>

        {/* Search Results Summary */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-gray-900">
                {properties.length} properties found
              </span>
              {params.goal && (
                <span className="ml-2 text-sm text-gray-600">
                  for {params.goal.replace('_', ' ').toLowerCase()} goal
                </span>
              )}
              {params.budget && (
                <span className="ml-2 text-sm text-gray-600">
                  under ${parseInt(params.budget).toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Sorted by newest first
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any) => (
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
                onFavorite={(id: string) => console.log('Favorited property:', id)}
                onInquiry={(id: string) => console.log('Inquiry for property:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              No properties match your search criteria.
            </div>
            <p className="text-gray-400 mb-8">
              Try adjusting your filters or browse all properties.
            </p>
            <a
              href="/properties"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
