import { Resend } from 'resend';
import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Section
} from '@react-email/components';

function WelcomeEmail({ name = 'Developer', inviteLink = 'https://resend.com' }) {
  return React.createElement(
    Html,
    { lang: 'en' },
    React.createElement(Head),
    React.createElement(Preview, null, 'Welcome to Resend Integration in Next.js!'),
    React.createElement(
      Body,
      { style: { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif', padding: '20px 0' } },
      React.createElement(
        Container,
        { style: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '32px', maxWidth: '580px', margin: '0 auto' } },
        React.createElement(Heading, { style: { color: '#0f172a', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' } }, 'Welcome to Resend + Next.js!'),
        React.createElement(Text, { style: { color: '#475569', fontSize: '16px', lineHeight: '24px' } }, `Hello ${name},`),
        React.createElement(Text, { style: { color: '#475569', fontSize: '16px', lineHeight: '24px' } }, 'Your Resend email integration is officially up and running seamlessly with Next.js App Router.'),
        React.createElement(
          Section,
          { style: { textAlign: 'center', margin: '28px 0' } },
          React.createElement(Button, { href: inviteLink, style: { backgroundColor: '#000000', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' } }, 'Open Resend Dashboard')
        ),
        React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0' } }),
        React.createElement(Text, { style: { color: '#94a3b8', fontSize: '13px' } }, 'Sent automatically from your Next.js application.')
      )
    )
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log('Sending email with React template...');
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: 'delivered@resend.dev',
    subject: 'React Email Template Test',
    react: React.createElement(WelcomeEmail, { name: 'Alex' }),
  });

  if (error) {
    console.error('Error with React email:', error);
    process.exit(1);
  }
  console.log('React email sent successfully! ID:', data.id);
}

test();
