'use client'

import { useState } from 'react'
import { 
  DollarSign, 
  Home, 
  MapPin, 
  Bed, 
  Bath,
  Square,
  X,
  ChevronDown,
  BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PropertyFiltersProps {
  filters: any
  onChange: (filters: any) => void
  onClose: () => void
}

const countries = [
  { value: 'uae', label: 'United Arab Emirates', flag: '🇦🇪' },
  { value: 'usa', label: 'United States', flag: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'spain', label: 'Spain', flag: '🇪🇸' },
  { value: 'portugal', label: 'Portugal', flag: '🇵🇹' },
  { value: 'greece', label: 'Greece', flag: '🇬🇷' },
  { value: 'canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'australia', label: 'Australia', flag: '🇦🇺' },
]

const propertyTypes = [
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'villa', label: 'Villa', icon: '🏡' },
  { value: 'penthouse', label: 'Penthouse', icon: '🏙️' },
  { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
  { value: 'commercial', label: 'Commercial', icon: '🏪' },
  { value: 'land', label: 'Land', icon: '🏞️' },
]

const statusOptions = [
  { value: 'OFF_PLAN', label: 'Off Plan' },
  { value: 'NEW_BUILD', label: 'New Build' },
  { value: 'RESALE', label: 'Resale' },
]

export function PropertyFilters({ filters, onChange, onClose }: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [priceRange, setPriceRange] = useState([
    filters.minPrice ? parseInt(filters.minPrice) / 1000 : 0,
    filters.maxPrice ? parseInt(filters.maxPrice) / 1000 : 5000
  ])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    handleFilterChange('minPrice', values[0] * 1000)
    handleFilterChange('maxPrice', values[1] * 1000)
  }

  const applyFilters = () => {
    onChange(localFilters)
    onClose()
  }

  const resetFilters = () => {
    setLocalFilters({})
    setPriceRange([0, 5000])
    onChange({})
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Filter Properties
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            Location
          </Label>
          <Select
            value={localFilters.country}
            onValueChange={(value) => handleFilterChange('country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" />
            Property Type
          </Label>
          <Select
            value={localFilters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <span className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-gray-500" />
            Status
          </Label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-gray-500" />
            Bedrooms
          </Label>
          <Select
            value={localFilters.bedrooms}
            onValueChange={(value) => handleFilterChange('bedrooms', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range - Full width */}
        <div className="space-y-2 lg:col-span-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            Price Range
          </Label>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ${priceRange[0]}k
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ${priceRange[1]}k{priceRange[1] >= 5000 ? '+' : ''}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              min={0}
              max={5000}
              step={100}
              className="w-full"
            />
          </div>
        </div>

        {/* Area Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Square className="w-4 h-4 text-gray-500" />
            Area (m²)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxArea || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value)}
            />
          </div>
        </div>

        {/* Golden Visa */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-yellow-500" />
            Special Features
          </Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.goldenVisa === 'true'}
                onChange={(e) => handleFilterChange('goldenVisa', e.target.checked ? 'true' : '')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Golden Visa Eligible
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.highRoi === 'true'}
                onChange={(e) => handleFilterChange('highRoi', e.target.checked ? 'true' : '')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                High ROI (15%+)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-gray-600 dark:text-gray-400"
        >
          Reset Filters
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={applyFilters}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
