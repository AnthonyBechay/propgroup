// Email service configuration
// Only initializes if API key is present

let resendClient: any = null;

// Check if Resend should be initialized
if (process.env.RESEND_API_KEY) {
  try {
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend email service initialized');
  } catch (error) {
    console.warn('Resend package not installed or initialization failed:', error);
  }
} else {
  console.log('Resend API key not found, email features disabled');
}

export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}) {
  if (!resendClient) {
    console.warn('Email service not configured. Set RESEND_API_KEY to enable.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resendClient.emails.send({
      from: params.from || 'PropGroup <noreply@propgroup.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Export a mock client if Resend is not configured
export const resend = resendClient || {
  emails: {
    send: async () => {
      console.warn('Resend not configured, skipping email send');
      return { id: 'mock-email-id' };
    }
  }
};
