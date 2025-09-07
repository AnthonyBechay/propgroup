'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
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
import { addOwnedProperty } from '@/actions/portfolio-actions'
import { Plus, Building2 } from 'lucide-react'

const ownedPropertySchema = z.object({
  customName: z.string().min(1, 'Property name is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  initialMortgage: z.number().optional(),
  currentRent: z.number().optional(),
  notes: z.string().optional(),
  propertyId: z.string().optional(),
})

type OwnedPropertyFormData = z.infer<typeof ownedPropertySchema>

interface AddPropertyModalProps {
  children: React.ReactNode
}

export function AddPropertyModal({ children }: AddPropertyModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<OwnedPropertyFormData>({
    resolver: zodResolver(ownedPropertySchema),
    defaultValues: {
      customName: '',
      purchasePrice: 0,
      purchaseDate: '',
      initialMortgage: undefined,
      currentRent: undefined,
      notes: '',
      propertyId: undefined,
    },
  })

  const onSubmit = async (data: OwnedPropertyFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await addOwnedProperty({
        ...data,
        userId: user.id,
        initialMortgage: data.initialMortgage || null,
        currentRent: data.currentRent || null,
        notes: data.notes || null,
        propertyId: data.propertyId || null,
      })
      
      form.reset()
      setOpen(false)
      // Refresh the page
      window.location.reload()
    } catch (error) {
      console.error('Error adding property:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Add Property to Portfolio
          </DialogTitle>
          <DialogDescription>
            Add a property you own to track its performance and manage your portfolio.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., My Downtown Apartment" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
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
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialMortgage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Mortgage Payment (Optional)</FormLabel>
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
                name="currentRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Monthly Rent (Optional)</FormLabel>
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
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to Platform Property (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Property ID from platform" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes about this property..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Property'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
