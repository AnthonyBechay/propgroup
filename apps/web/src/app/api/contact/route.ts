import { NextResponse } from 'next/server';

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

    // For now, just log the contact form submission
    // You could save this to Supabase instead
    console.log('Contact form submission:', {
      email,
      name, 
      phone,
      message,
      propertyId,
      timestamp: new Date().toISOString()
    });

    // TODO: Save to Supabase database if you want to track contacts
    // const { data, error } = await supabase
    //   .from('contacts')
    //   .insert({ email, name, phone, message, propertyId });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
