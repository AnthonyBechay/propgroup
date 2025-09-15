'use client'

export function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5" />
            </div>
            
            {/* Features */}
            <div className="flex gap-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
            </div>
            
            {/* Metrics */}
            <div className="h-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl" />
            
            {/* Price and buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end justify-between mb-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
