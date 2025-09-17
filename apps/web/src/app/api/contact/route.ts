import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, message, propertyId } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${propertyId ? `<p><strong>Property ID:</strong> ${propertyId}</p>` : ''}
      ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
    `;

    const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${propertyId ? `Property ID: ${propertyId}` : ''}
${message ? `Message:\n${message}` : ''}
    `.trim();

    // Try to send email if configured
    const emailResult = await sendEmail({
      to: process.env.CONTACT_EMAIL || 'info@propgroup.com',
      subject: `New Contact from ${name}`,
      html: emailHtml,
      text: emailText,
      from: 'PropGroup Contact <noreply@propgroup.com>'
    });

    if (!emailResult.success) {
      // Log the error but don't fail the request
      console.warn('Email send failed, but contact form submission accepted:', emailResult.error);
    }

    // You could also save to database here if needed
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
