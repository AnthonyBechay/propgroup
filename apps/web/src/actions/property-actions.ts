'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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

export async function createProperty(data: z.infer<typeof propertySchema>) {
  try {
    // Validate the input
    const validatedData = propertySchema.parse(data)

    // Create the property with investment data in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the property
      const property = await tx.property.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price,
          currency: validatedData.currency,
          bedrooms: validatedData.bedrooms,
          bathrooms: validatedData.bathrooms,
          area: validatedData.area,
          country: validatedData.country,
          status: validatedData.status,
          isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
          developerId: validatedData.developerId || null,
          locationGuideId: validatedData.locationGuideId || null,
          images: [], // Default empty array, can be updated later
        },
      })

      // Create investment data if any investment fields are provided
      if (
        validatedData.expectedROI ||
        validatedData.rentalYield ||
        validatedData.capitalGrowth ||
        validatedData.minInvestment ||
        validatedData.maxInvestment ||
        validatedData.paymentPlan ||
        validatedData.completionDate
      ) {
        await tx.propertyInvestmentData.create({
          data: {
            propertyId: property.id,
            expectedROI: validatedData.expectedROI || null,
            rentalYield: validatedData.rentalYield || null,
            capitalGrowth: validatedData.capitalGrowth || null,
            isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
            minInvestment: validatedData.minInvestment || null,
            maxInvestment: validatedData.maxInvestment || null,
            paymentPlan: validatedData.paymentPlan || null,
            completionDate: validatedData.completionDate 
              ? new Date(validatedData.completionDate) 
              : null,
          },
        })
      }

      return property
    })

    // Revalidate the properties page
    revalidatePath('/admin/properties')
    revalidatePath('/properties')

    return { success: true, property: result }
  } catch (error) {
    console.error('Error creating property:', error)
    throw new Error('Failed to create property')
  }
}

export async function updateProperty(id: string, data: Partial<z.infer<typeof propertySchema>>) {
  try {
    const validatedData = propertySchema.partial().parse(data)

    const result = await prisma.$transaction(async (tx: any) => {
      // Update the property
      const property = await tx.property.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price,
          currency: validatedData.currency,
          bedrooms: validatedData.bedrooms,
          bathrooms: validatedData.bathrooms,
          area: validatedData.area,
          country: validatedData.country,
          status: validatedData.status,
          isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
          developerId: validatedData.developerId || null,
          locationGuideId: validatedData.locationGuideId || null,
        },
      })

      // Update or create investment data
      if (
        validatedData.expectedROI !== undefined ||
        validatedData.rentalYield !== undefined ||
        validatedData.capitalGrowth !== undefined ||
        validatedData.minInvestment !== undefined ||
        validatedData.maxInvestment !== undefined ||
        validatedData.paymentPlan !== undefined ||
        validatedData.completionDate !== undefined
      ) {
        await tx.propertyInvestmentData.upsert({
          where: { propertyId: id },
          update: {
            expectedROI: validatedData.expectedROI || null,
            rentalYield: validatedData.rentalYield || null,
            capitalGrowth: validatedData.capitalGrowth || null,
            isGoldenVisaEligible: validatedData.isGoldenVisaEligible || false,
            minInvestment: validatedData.minInvestment || null,
            maxInvestment: validatedData.maxInvestment || null,
            paymentPlan: validatedData.paymentPlan || null,
            completionDate: validatedData.completionDate 
              ? new Date(validatedData.completionDate) 
              : null,
          },
          create: {
            propertyId: id,
            expectedROI: validatedData.expectedROI || null,
            rentalYield: validatedData.rentalYield || null,
            capitalGrowth: validatedData.capitalGrowth || null,
            isGoldenVisaEligible: validatedData.isGoldenVisaEligible || false,
            minInvestment: validatedData.minInvestment || null,
            maxInvestment: validatedData.maxInvestment || null,
            paymentPlan: validatedData.paymentPlan || null,
            completionDate: validatedData.completionDate 
              ? new Date(validatedData.completionDate) 
              : null,
          },
        })
      }

      return property
    })

    revalidatePath('/admin/properties')
    revalidatePath('/properties')
    revalidatePath(`/property/${id}`)

    return { success: true, property: result }
  } catch (error) {
    console.error('Error updating property:', error)
    throw new Error('Failed to update property')
  }
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({
      where: { id },
    })

    revalidatePath('/admin/properties')
    revalidatePath('/properties')

    return { success: true }
  } catch (error) {
    console.error('Error deleting property:', error)
    throw new Error('Failed to delete property')
  }
}
