'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProperty } from '@/actions/property-actions'

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(3, 'Currency is required'),
  bedrooms: z.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  area: z.number().min(0, 'Area must be positive'),
  country: z.enum(['GEORGIA', 'CYPRUS', 'GREECE', 'LEBANON']),
  status: z.enum(['OFF_PLAN', 'NEW_BUILD', 'RESALE']),
  isGoldenVisaEligible: z.boolean(),
  developerId: z.string().optional(),
  locationGuideId: z.string().optional(),
  // Investment data
  expectedROI: z.number().optional(),
  rentalYield: z.number().optional(),
  capitalGrowth: z.number().optional(),
  minInvestment: z.number().optional(),
  maxInvestment: z.number().optional(),
  paymentPlan: z.string().optional(),
  completionDate: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface Developer {
  id: string
  name: string
  country: string
}

interface LocationGuide {
  id: string
  title: string
  country: string
}

interface CreatePropertyModalProps {
  children: React.ReactNode
  developers: Developer[]
  locationGuides: LocationGuide[]
}

export function CreatePropertyModal({ 
  children, 
  developers, 
  locationGuides 
}: CreatePropertyModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      currency: 'USD',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      country: 'GEORGIA',
      status: 'NEW_BUILD',
      isGoldenVisaEligible: false,
      expectedROI: undefined,
      rentalYield: undefined,
      capitalGrowth: undefined,
      minInvestment: undefined,
      maxInvestment: undefined,
      paymentPlan: '',
      completionDate: '',
    },
  })

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      await createProperty(data)
      form.reset()
      setOpen(false)
      // Refresh the page or update the table
      window.location.reload()
    } catch (error) {
      console.error('Error creating property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Property</DialogTitle>
          <DialogDescription>
            Add a new property listing to your platform. Fill in all the required information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Property title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Property description" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (sq ft)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GEORGIA">Georgia</SelectItem>
                            <SelectItem value="CYPRUS">Cyprus</SelectItem>
                            <SelectItem value="GREECE">Greece</SelectItem>
                            <SelectItem value="LEBANON">Lebanon</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OFF_PLAN">Off Plan</SelectItem>
                            <SelectItem value="NEW_BUILD">New Build</SelectItem>
                            <SelectItem value="RESALE">Resale</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Investment Data */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Investment Data</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expectedROI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected ROI (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rentalYield"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rental Yield (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="capitalGrowth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capital Growth (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Investment</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Investment</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="developerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Developer (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select developer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {developers.map((developer) => (
                            <SelectItem key={developer.id} value={developer.id}>
                              {developer.name} ({developer.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationGuideId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Guide (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location guide" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationGuides.map((guide) => (
                            <SelectItem key={guide.id} value={guide.id}>
                              {guide.title} ({guide.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
