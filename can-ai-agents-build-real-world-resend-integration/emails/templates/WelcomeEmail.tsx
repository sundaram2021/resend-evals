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
  Section,
  Hr,
  Link,
} from '@react-email/components';
import { WelcomeProps } from '@/lib/types';

export const WelcomeEmail: React.FC<WelcomeProps> & { PreviewProps?: WelcomeProps } = ({
  name = 'Alex',
  loginUrl = 'https://resend.com/overview',
  companyName = 'Acme Inc.',
  supportEmail = 'support@example.com',
}) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to {companyName} — Let's get started!</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Badge */}
          <Section style={badgeSectionStyle}>
            <div style={badgeStyle}>✨ Welcome aboard</div>
          </Section>

          {/* Heading */}
          <Heading style={headingStyle}>Welcome to {companyName}, {name}!</Heading>

          <Text style={paragraphStyle}>
            We're thrilled to have you with us. Your account is configured and ready to go with high-performance transactional email delivery powered by Resend.
          </Text>

          {/* Onboarding steps card */}
          <Section style={stepsBoxStyle}>
            <Text style={stepHeaderStyle}>Here's what you can do right now:</Text>
            
            <div style={stepItemStyle}>
              <div style={stepNumberStyle}>1</div>
              <div style={stepContentStyle}>
                <strong style={stepTitleStyle}>Explore the API & Templates</strong>
                <p style={stepDescStyle}>Send transactional messages with dynamic variables and React templates.</p>
              </div>
            </div>

            <div style={stepItemStyle}>
              <div style={stepNumberStyle}>2</div>
              <div style={stepContentStyle}>
                <strong style={stepTitleStyle}>Connect Webhooks & Domains</strong>
                <p style={stepDescStyle}>Verify DNS records (SPF, DKIM, DMARC) for 99.9% inbox deliverability.</p>
              </div>
            </div>

            <div style={stepItemStyle}>
              <div style={stepNumberStyle}>3</div>
              <div style={stepContentStyle}>
                <strong style={stepTitleStyle}>Inspect Real-Time Logs</strong>
                <p style={stepDescStyle}>Track delivery, opens, clicks, and bounces in real-time.</p>
              </div>
            </div>
          </Section>

          {/* CTA Action */}
          <Section style={ctaSectionStyle}>
            <Button
              href={loginUrl}
              style={buttonStyle}
              className="box-border"
            >
              Get Started in Dashboard →
            </Button>
          </Section>

          <Text style={footerNoteStyle}>
            Need assistance? Feel free to reach out to our team at{' '}
            <Link href={`mailto:${supportEmail}`} style={linkStyle}>
              {supportEmail}
            </Link>
            . We're here to help!
          </Text>

          <Hr style={dividerStyle} />

          <Text style={footerDisclaimerStyle}>
            © {new Date().getFullYear()} {companyName}. All rights reserved. Delivered via Resend.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  name: 'Alex Rivera',
  loginUrl: 'https://resend.com/overview',
  companyName: 'Acme Cloud Platform',
  supportEmail: 'support@example.com',
};

export default WelcomeEmail;

// Inline Email Styles
const mainStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 16px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  border: '1px solid #334155',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '36px 32px',
};

const badgeSectionStyle: React.CSSProperties = {
  marginBottom: '16px',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(56, 189, 248, 0.15)',
  border: '1px solid rgba(56, 189, 248, 0.4)',
  color: '#38bdf8',
  fontSize: '12px',
  fontWeight: '600',
  borderRadius: '9999px',
  padding: '4px 12px',
  letterSpacing: '0.02em',
};

const headingStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontSize: '24px',
  fontWeight: '700',
  letterSpacing: '-0.02em',
  margin: '12px 0 16px 0',
};

const paragraphStyle: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 24px 0',
};

const stepsBoxStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const stepHeaderStyle: React.CSSProperties = {
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const stepItemStyle: React.CSSProperties = {
  display: 'flex',
  marginBottom: '14px',
};

const stepNumberStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '12px',
  flexShrink: 0,
};

const stepContentStyle: React.CSSProperties = {
  flex: 1,
};

const stepTitleStyle: React.CSSProperties = {
  color: '#f1f5f9',
  fontSize: '14px',
  display: 'block',
  marginBottom: '2px',
};

const stepDescStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0',
  lineHeight: '18px',
};

const ctaSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0 24px 0',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '14px 28px',
  display: 'inline-block',
  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
};

const footerNoteStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 24px 0',
};

const linkStyle: React.CSSProperties = {
  color: '#60a5fa',
  textDecoration: 'underline',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#334155',
  borderStyle: 'solid',
  margin: '24px 0',
};

const footerDisclaimerStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '12px',
  textAlign: 'center',
  margin: '0',
};
