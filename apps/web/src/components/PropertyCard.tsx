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
  ArrowRight,
  Sparkles,
  DollarSign,
  BarChart3,
  Shield,
  Award,
  Camera
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
      bg: 'from-purple-500 to-pink-600', 
      text: 'text-white',
      label: 'Off Plan',
      icon: Sparkles
    },
    NEW_BUILD: { 
      bg: 'from-green-500 to-emerald-600', 
      text: 'text-white',
      label: 'New Build',
      icon: Award
    },
    RESALE: { 
      bg: 'from-blue-500 to-cyan-600', 
      text: 'text-white',
      label: 'Resale',
      icon: Shield
    },
  }[status] || { bg: 'from-gray-500 to-gray-600', text: 'text-white', label: status, icon: Home }

  const defaultImage = '/placeholder-property.jpg'
  const mainImage = images && images.length > 0 ? images[currentImageIndex] : defaultImage

  // Calculate best metric to highlight
  const bestMetric = investmentData ? 
    Math.max(
      investmentData.expectedROI || 0,
      investmentData.rentalYield || 0,
      investmentData.capitalGrowth || 0
    ) : 0

  const StatusIcon = statusConfig.icon

  return (
    <>
      <div className={`group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${className} ${featured ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
        {/* Featured ribbon */}
        {featured && (
          <div className="absolute top-4 -right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 px-12 rotate-45 z-20 shadow-lg">
            FEATURED
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <Link href={`/property/${id}`}>
            <div className="relative w-full h-full">
              {(mainImage === defaultImage || imageError) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                </div>
              ) : (
                <>
                  <Image
                    src={mainImage}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => setImageError(true)}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              )}
            </div>
          </Link>

          {/* Image counter */}
          {images && images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              {images.length} photos
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${statusConfig.bg} ${statusConfig.text} shadow-lg backdrop-blur-sm flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
            
            {isGoldenVisaEligible && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg backdrop-blur-sm flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                Golden Visa
              </span>
            )}

            {bestMetric > 15 && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg backdrop-blur-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                High ROI
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isLoadingFavorite}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group/fav"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400 group-hover/fav:text-red-500'
              } ${isLoadingFavorite ? 'animate-pulse' : ''}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and Location */}
          <div>
            <Link href={`/property/${id}`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                {title}
              </h3>
            </Link>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
              {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Bed className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Bath className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Square className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{area} m²</span>
            </div>
          </div>

          {/* Investment Metrics */}
          {investmentData && bestMetric > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Investment Metrics
                </span>
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {investmentData.expectedROI && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {investmentData.expectedROI}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">ROI</div>
                  </div>
                )}
                {investmentData.rentalYield && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {investmentData.rentalYield}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Rental</div>
                  </div>
                )}
                {investmentData.capitalGrowth && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {investmentData.capitalGrowth}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Growth</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price and Actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(price)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {area > 0 ? `${formatPrice(Math.round(price / area))}/m²` : ''}
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">(4.8)</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link href={`/property/${id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full group/btn hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowInquiryModal(true)
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Inquire Now
              </Button>
            </div>
          </div>
        </div>

        {/* Hover shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Property Inquiry</DialogTitle>
            <DialogDescription className="text-base">
              Interested in "{title}"? Fill out the form below and our team will contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onInquirySubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
                className="h-11"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
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
                placeholder="john@example.com"
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Tell us about your investment goals or any specific questions..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInquiryModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmittingInquiry}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmittingInquiry ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Sending...
                  </span>
                ) : (
                  'Send Inquiry'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
