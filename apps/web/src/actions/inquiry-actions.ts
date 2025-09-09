'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send email notification if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== '[YOUR-RESEND-API-KEY]') {
      try {
        // Email to admin
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
          to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
          subject: `New Property Inquiry - ${inquiry.property.title}`,
          html: `
            <h2>New Property Inquiry</h2>
            <p><strong>Property:</strong> ${inquiry.property.title}</p>
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
            ${inquiry.message ? `<p><strong>Message:</strong> ${inquiry.message}</p>` : ''}
            <p><strong>Date:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
          `,
        })

        // Confirmation email to user
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
          to: inquiry.email,
          subject: 'Your Property Inquiry Has Been Received',
          html: `
            <h2>Thank you for your inquiry!</h2>
            <p>We've received your inquiry about <strong>${inquiry.property.title}</strong>.</p>
            <p>Our team will get back to you within 24-48 hours.</p>
            <br>
            <p>Best regards,<br>Smart Investment Portal Team</p>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send email notifications:', emailError)
        // Don't fail the inquiry if email fails
      }
    }

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
        error: error.errors[0].message 
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
