'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageSquare,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Property {
  id: string
  title: string
  price: number
  currency: string
  country: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  isGoldenVisaEligible: boolean
  createdAt: string
  developer?: {
    id: string
    name: string
  } | null
  investmentData?: {
    expectedROI?: number
    rentalYield?: number
    capitalGrowth?: number
  } | null
  _count: {
    favoriteProperties: number
    propertyInquiries: number
  }
}

interface PropertyTableProps {
  properties: Property[]
}

export function PropertyTable({ properties }: PropertyTableProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OFF_PLAN':
        return 'bg-blue-100 text-blue-800'
      case 'NEW_BUILD':
        return 'bg-green-100 text-green-800'
      case 'RESALE':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEdit = (property: Property) => {
    // TODO: Implement edit functionality
    console.log('Edit property:', property.id)
  }

  const handleDelete = (property: Property) => {
    // TODO: Implement delete functionality
    console.log('Delete property:', property.id)
  }

  const handleView = (property: Property) => {
    // TODO: Implement view functionality
    console.log('View property:', property.id)
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Developer</TableHead>
              <TableHead>Metrics</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium text-gray-900">
                      {property.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sq ft
                    </div>
                    {property.isGoldenVisaEligible && (
                      <Badge variant="secondary" className="mt-1 w-fit">
                        Golden Visa
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(property.price, property.currency)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="capitalize">{property.country.toLowerCase()}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(property.status)}>
                    {property.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {property.developer ? (
                    <div className="text-sm">
                      <div className="font-medium">{property.developer.name}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">No developer</span>
                  )}
                </TableCell>
                <TableCell>
                  {property.investmentData ? (
                    <div className="text-sm space-y-1">
                      {property.investmentData.rentalYield && (
                        <div className="text-green-600">
                          {property.investmentData.rentalYield.toFixed(1)}% yield
                        </div>
                      )}
                      {property.investmentData.expectedROI && (
                        <div className="text-blue-600">
                          {property.investmentData.expectedROI.toFixed(1)}% ROI
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">No data</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-red-600">
                      <Heart className="h-4 w-4 mr-1" />
                      {property._count.favoriteProperties}
                    </div>
                    <div className="flex items-center text-blue-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {property._count.propertyInquiries}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(property)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(property)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(property)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
