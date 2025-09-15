'use client'

import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MapViewProps {
  properties: any[]
}

export function MapView({ properties }: MapViewProps) {
  return (
    <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
      {/* Map placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Interactive Map View
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Explore properties on an interactive map with filters and real-time updates
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline">
              <Navigation className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Enable Map View
            </Button>
          </div>
        </div>
      </div>

      {/* Property markers preview */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          {properties.length} Properties Available
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click on markers to view property details
        </p>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="sm" variant="outline" className="bg-white dark:bg-gray-800">
          <span className="text-lg">+</span>
        </Button>
        <Button size="sm" variant="outline" className="bg-white dark:bg-gray-800">
          <span className="text-lg">-</span>
        </Button>
      </div>
    </div>
  )
}
