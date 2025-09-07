import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactFormSchema } from '@propgroup/config'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json()
    const validation = contactFormSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { email, name, phone, propertyId, message } = validation.data

    // Send email notification using Resend
    const { data, error } = await resend.emails.send({
      from: 'Smart Investment Portal <noreply@yourdomain.com>',
      to: ['admin@yourdomain.com'], // Replace with your admin email
      subject: `New Property Inquiry - ${name}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Property ID:</strong> ${propertyId}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        {
          error: 'Failed to send email notification',
        },
        { status: 500 }
      )
    }

    // Send confirmation email to the user
    await resend.emails.send({
      from: 'Smart Investment Portal <noreply@yourdomain.com>',
      to: [email],
      subject: 'Thank you for your inquiry',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your inquiry about our property. We have received your message and will get back to you within 24 hours.</p>
        <p>Best regards,<br>Smart Investment Portal Team</p>
      `,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        data: {
          emailId: data?.id,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request',
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
    },
    { status: 405 }
  )
}
