import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
console.log('Using API key starting with:', apiKey ? apiKey.substring(0, 7) + '...' : 'NONE');

const resend = new Resend(apiKey);

async function test() {
  console.log('Sending test email via Resend SDK...');
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: 'delivered@resend.dev',
    subject: 'Next.js Boilerplate Resend Integration Test',
    html: '<strong>Success!</strong> Resend integration is operational in Next.js.',
  });

  if (error) {
    console.error('Failed to send email:', error);
    process.exit(1);
  }

  console.log('Email sent successfully! ID:', data.id);

  // Now test getting the email details
  console.log('Retrieving email details...');
  const { data: emailData, error: getError } = await resend.emails.get(data.id);
  if (getError) {
    console.warn('Could not get email details:', getError);
  } else {
    console.log('Retrieved email:', {
      id: emailData.id,
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      last_event: emailData.last_event
    });
  }
}

test();
