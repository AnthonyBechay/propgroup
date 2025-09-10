'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  TrendingUp, 
  Home, 
  BadgeCheck,
  Star,
  Clock,
  Eye,
  ArrowRight
} from 'lucide-react'
import { toggleFavorite } from '@/actions/favorite-actions'
import { submitInquiry } from '@/actions/inquiry-actions'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/use-toast'

interface PropertyCardProps {
  id: string
  title: string
  description: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  area: number
  country: string
  status: string
  images: string[]
  isGoldenVisaEligible?: boolean
  investmentData?: {
    expectedROI?: number | null
    rentalYield?: number | null
    capitalGrowth?: number | null
  }
  isFavorited?: boolean
  className?: string
  featured?: boolean
}

export function PropertyCard({
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
  isGoldenVisaEligible,
  investmentData,
  isFavorited: initialFavorited = false,
  className,
  featured = false,
}: PropertyCardProps) {
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)
  const [imageError, setImageError] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: user?.email || '',
      phone: '',
      message: '',
    },
  })

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsLoadingFavorite(true)
    try {
      const result = await toggleFavorite(id)
      if (result.success) {
        setIsFavorited(result.isFavorited || false)
        toast({
          title: result.isFavorited ? 'Added to favorites' : 'Removed from favorites',
          description: result.isFavorited 
            ? 'You can view your favorites in your portal' 
            : 'Property removed from your favorites',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update favorite status',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const onInquirySubmit = async (data: any) => {
    setIsSubmittingInquiry(true)
    try {
      const result = await submitInquiry({
        propertyId: id,
        ...data,
      })

      if (result.success) {
        toast({
          title: 'Inquiry sent!',
          description: result.message,
        })
        reset()
        setShowInquiryModal(false)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send inquiry',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const statusConfig = {
    OFF_PLAN: { 
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600', 
      text: 'text-white',
      label: 'Off Plan'
    },
    NEW_BUILD: { 
      bg: 'bg-gradient-to-r from-green-500 to-green-600', 
      text: 'text-white',
      label: 'New Build'
    },
    RESALE: { 
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600', 
      text: 'text-white',
      label: 'Resale'
    },
  }[status] || { bg: 'bg-gray-500', text: 'text-white', label: status }

  const defaultImage = '/placeholder-property.jpg'
  const mainImage = images && images.length > 0 ? images[0] : defaultImage

  // Calculate best metric to highlight
  const bestMetric = investmentData ? 
    Math.max(
      investmentData.expectedROI || 0,
      investmentData.rentalYield || 0,
      investmentData.capitalGrowth || 0
    ) : 0

  return (
    <>
      <div className={`group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${className} ${featured ? 'ring-2 ring-blue-500' : ''}`}>
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <Link href={`/property/${id}`}>
            <div className="relative w-full h-full">
              {(mainImage === defaultImage || imageError) ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              ) : (
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => setImageError(true)}
                />
              )}
              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
                {statusConfig.label}
              </span>
              {featured && (
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
            </div>
            
            {isGoldenVisaEligible && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <BadgeCheck className="w-3 h-3" />
                Golden Visa
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isLoadingFavorite}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              } ${isLoadingFavorite ? 'animate-pulse' : ''}`}
            />
          </button>

          {/* View count (mock data) */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {Math.floor(Math.random() * 500 + 100)} views
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title and Location */}
          <div>
            <Link href={`/property/${id}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                {title}
              </h3>
            </Link>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{description}</p>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{bedrooms} Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{area} m²</span>
            </div>
          </div>

          {/* Investment Metrics */}
          {investmentData && bestMetric > 0 && (
            <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              {investmentData.expectedROI && (
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium">ROI</div>
                  <div className="text-base font-bold text-green-600">
                    {investmentData.expectedROI}%
                  </div>
                </div>
              )}
              {investmentData.rentalYield && (
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium">Rental</div>
                  <div className="text-base font-bold text-blue-600">
                    {investmentData.rentalYield}%
                  </div>
                </div>
              )}
              {investmentData.capitalGrowth && (
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium">Growth</div>
                  <div className="text-base font-bold text-purple-600">
                    {investmentData.capitalGrowth}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {area > 0 ? `${formatPrice(Math.round(price / area))}/m²` : ''}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/property/${id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="group/btn hover:bg-gray-50"
                >
                  View
                  <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInquiryModal(true)
                }}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
              >
                Inquire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal>
          <div />
        </AuthModal>
      )}

      {/* Inquiry Modal */}
      <Dialog open={showInquiryModal} onOpenChange={setShowInquiryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Property Inquiry</DialogTitle>
            <DialogDescription>
              Send us your inquiry about "{title}" and we'll get back to you within 24-48 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onInquirySubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Tell us what you'd like to know..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInquiryModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingInquiry}>
                {isSubmittingInquiry ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
