'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Square, TrendingUp, Home, BadgeCheck } from 'lucide-react'
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
}: PropertyCardProps) {
  const { user } = useAuth()
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)

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

  const handleFavorite = async () => {
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

  const statusColor = {
    OFF_PLAN: 'bg-purple-100 text-purple-800',
    NEW_BUILD: 'bg-green-100 text-green-800',
    RESALE: 'bg-blue-100 text-blue-800',
  }[status] || 'bg-gray-100 text-gray-800'

  const defaultImage = '/placeholder-property.jpg'
  const mainImage = images && images.length > 0 ? images[0] : defaultImage

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${className}`}>
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64">
          <Link href={`/property/${id}`}>
            <div className="relative w-full h-full">
              {mainImage === defaultImage ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              ) : (
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
          </Link>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              {status.replace('_', ' ')}
            </span>
          </div>

          {/* Golden Visa Badge */}
          {isGoldenVisaEligible && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" />
              Golden Visa
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isLoadingFavorite}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Location */}
          <div>
            <Link href={`/property/${id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{area} m²</span>
            </div>
          </div>

          {/* Investment Metrics */}
          {investmentData && (investmentData.expectedROI || investmentData.rentalYield || investmentData.capitalGrowth) && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              {investmentData.expectedROI && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">ROI</div>
                  <div className="text-sm font-semibold text-green-600">
                    {investmentData.expectedROI}%
                  </div>
                </div>
              )}
              {investmentData.rentalYield && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">Rental</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {investmentData.rentalYield}%
                  </div>
                </div>
              )}
              {investmentData.capitalGrowth && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">Growth</div>
                  <div className="text-sm font-semibold text-purple-600">
                    {investmentData.capitalGrowth}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </div>
            </div>
            <Button
              onClick={() => setShowInquiryModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Inquire
            </Button>
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
