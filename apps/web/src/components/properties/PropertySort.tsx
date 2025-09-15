'use client'

import { ArrowUpDown, TrendingUp, DollarSign, Square } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PropertySortProps {
  value: string
  onChange: (value: string) => void
}

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: '🆕' },
  { value: 'price-asc', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-desc', label: 'Price: High to Low', icon: '💎' },
  { value: 'roi-desc', label: 'Highest ROI', icon: '📈' },
  { value: 'area-desc', label: 'Largest Area', icon: '🏠' },
  { value: 'popular', label: 'Most Popular', icon: '⭐' },
]

export function PropertySort({ value, onChange }: PropertySortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
        Sort by:
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
