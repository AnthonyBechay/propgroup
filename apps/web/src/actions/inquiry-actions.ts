'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const inquirySchema = z.object({
  propertyId: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

export async function submitInquiry(data: z.infer<typeof inquirySchema>) {
  try {
    const validatedData = inquirySchema.parse(data)
    
    // Get current user if logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Create the inquiry
    const inquiry = await prisma.propertyInquiry.create({
      data: {
        propertyId: validatedData.propertyId,
        userId: user?.id || null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message || null,
      },
      include: {
        property: true,
      },
    })

    // Log the inquiry for now (you could store this in a separate table for admin review)
    console.log('New property inquiry:', {
      property: inquiry.property.title,
      name: inquiry.name,
      email: inquiry.email,
      date: inquiry.createdAt
    })

    return { 
      success: true, 
      inquiry,
      message: 'Your inquiry has been submitted successfully! We will get back to you soon.'
    }
  } catch (error) {
    console.error('Error submitting inquiry:', error)
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0].message 
      }
    }
    return { 
      success: false, 
      error: 'Failed to submit inquiry. Please try again.' 
    }
  }
}

export async function getUserInquiries() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be logged in to view inquiries' }
    }

    const inquiries = await prisma.propertyInquiry.findMany({
      where: {
        OR: [
          { userId: user.id },
          { email: user.email }
        ]
      },
      include: {
        property: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { 
      success: true, 
      inquiries 
    }
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return { success: false, error: 'Failed to fetch inquiries' }
  }
}

export async function getPropertyInquiries(propertyId: string) {
  try {
    const inquiries = await prisma.propertyInquiry.findMany({
      where: {
        propertyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { 
      success: true, 
      inquiries 
    }
  } catch (error) {
    console.error('Error fetching property inquiries:', error)
    return { success: false, error: 'Failed to fetch inquiries' }
  }
}
