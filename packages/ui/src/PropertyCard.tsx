import React from 'react';

export interface PropertyCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  country: string;
  status: string;
  images: string[];
  isGoldenVisaEligible?: boolean;
  investmentData?: {
    expectedROI?: number;
    rentalYield?: number;
    capitalGrowth?: number;
  };
  onFavorite?: (propertyId: string) => void;
  onInquiry?: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  description,
  price,
  currency,
  bedrooms,
  bathrooms,
  area,
  country,
  status,
  images,
  isGoldenVisaEligible = false,
  investmentData,
  onFavorite,
  onInquiry
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {isGoldenVisaEligible && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Golden Visa
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {title}
          </h3>
          <span className="text-sm text-gray-500 capitalize">
            {status.toLowerCase().replace('_', ' ')}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{bedrooms} bed</span>
          <span>{bathrooms} bath</span>
          <span>{area} sq ft</span>
          <span className="capitalize">{country}</span>
        </div>

        {/* Investment Metrics */}
        {investmentData && (
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            {investmentData.rentalYield && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {investmentData.rentalYield.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Rental Yield</div>
              </div>
            )}
            {investmentData.capitalGrowth && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {investmentData.capitalGrowth.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Growth YoY</div>
              </div>
            )}
            {investmentData.expectedROI && (
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {investmentData.expectedROI.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Expected ROI</div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            {currency} {price.toLocaleString()}
          </div>
          <div className="flex space-x-2">
            {onFavorite && (
              <button
                onClick={() => onFavorite(id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Add to favorites"
              >
                ♡
              </button>
            )}
            {onInquiry && (
              <button
                onClick={() => onInquiry(id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Inquire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
