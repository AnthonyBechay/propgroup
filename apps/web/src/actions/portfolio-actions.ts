'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ownedPropertySchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  customName: z.string().min(1, 'Property name is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  initialMortgage: z.number().optional().nullable(),
  currentRent: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  propertyId: z.string().optional().nullable(),
})

export async function addOwnedProperty(data: z.infer<typeof ownedPropertySchema>) {
  try {
    // Validate the input
    const validatedData = ownedPropertySchema.parse(data)

    // Create the owned property
    const ownedProperty = await prisma.userOwnedProperty.create({
      data: {
        userId: validatedData.userId,
        customName: validatedData.customName,
        purchasePrice: validatedData.purchasePrice,
        purchaseDate: new Date(validatedData.purchaseDate),
        initialMortgage: validatedData.initialMortgage,
        currentRent: validatedData.currentRent,
        notes: validatedData.notes,
        propertyId: validatedData.propertyId,
      },
      include: {
        property: {
          include: {
            investmentData: true,
            developer: true
          }
        }
      }
    })

    // Revalidate the portfolio page
    revalidatePath('/portal/portfolio')

    return { success: true, ownedProperty }
  } catch (error) {
    console.error('Error adding owned property:', error)
    throw new Error('Failed to add property to portfolio')
  }
}

export async function updateOwnedProperty(id: string, data: Partial<z.infer<typeof ownedPropertySchema>>) {
  try {
    const validatedData = ownedPropertySchema.partial().parse(data)

    const ownedProperty = await prisma.userOwnedProperty.update({
      where: { id },
      data: {
        customName: validatedData.customName,
        purchasePrice: validatedData.purchasePrice,
        purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : undefined,
        initialMortgage: validatedData.initialMortgage,
        currentRent: validatedData.currentRent,
        notes: validatedData.notes,
        propertyId: validatedData.propertyId,
      },
      include: {
        property: {
          include: {
            investmentData: true,
            developer: true
          }
        }
      }
    })

    revalidatePath('/portal/portfolio')

    return { success: true, ownedProperty }
  } catch (error) {
    console.error('Error updating owned property:', error)
    throw new Error('Failed to update property in portfolio')
  }
}

export async function deleteOwnedProperty(id: string) {
  try {
    await prisma.userOwnedProperty.delete({
      where: { id },
    })

    revalidatePath('/portal/portfolio')

    return { success: true }
  } catch (error) {
    console.error('Error deleting owned property:', error)
    throw new Error('Failed to delete property from portfolio')
  }
}
