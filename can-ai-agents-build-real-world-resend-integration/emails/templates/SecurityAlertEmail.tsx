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
  Row,
  Column,
  Link,
} from '@react-email/components';
import { SecurityAlertProps } from '@/lib/types';

export const SecurityAlertEmail: React.FC<SecurityAlertProps> & { PreviewProps?: SecurityAlertProps } = ({
  userName = 'Jordan',
  loginTime = 'October 3, 2026 at 10:14 AM UTC',
  ipAddress = '198.51.100.42',
  location = 'San Francisco, CA, United States',
  device = 'Chrome 128 on macOS (Sonoma)',
  actionUrl = 'https://resend.com/security/sessions',
}) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Security Alert: New login detected for your account</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header with Alert Badge */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={shieldBadgeStyle}>🛡️ SECURITY NOTIFICATION</div>
            <Heading style={headingStyle}>New Login Detected</Heading>
            <Text style={introTextStyle}>
              Hi {userName}, your account was recently accessed from a new device or IP address.
            </Text>
          </Section>

          {/* Details Box */}
          <Section style={alertBoxStyle}>
            <Row style={detailRowStyle}>
              <Column style={{ width: '35%' }}>
                <Text style={labelStyle}>Time</Text>
              </Column>
              <Column style={{ width: '65%' }}>
                <Text style={valueStyle}>{loginTime}</Text>
              </Column>
            </Row>

            <Row style={detailRowStyle}>
              <Column style={{ width: '35%' }}>
                <Text style={labelStyle}>Device & Browser</Text>
              </Column>
              <Column style={{ width: '65%' }}>
                <Text style={valueStyle}>{device}</Text>
              </Column>
            </Row>

            <Row style={detailRowStyle}>
              <Column style={{ width: '35%' }}>
                <Text style={labelStyle}>IP Address</Text>
              </Column>
              <Column style={{ width: '65%' }}>
                <Text style={valueStyle}>{ipAddress}</Text>
              </Column>
            </Row>

            <Row style={detailRowStyle}>
              <Column style={{ width: '35%' }}>
                <Text style={labelStyle}>Approx. Location</Text>
              </Column>
              <Column style={{ width: '65%' }}>
                <Text style={valueStyle}>{location}</Text>
              </Column>
            </Row>
          </Section>

          {/* Action Call */}
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Text style={adviceTextStyle}>
              If this was you, you can safely ignore this email. If you did not initiate this login, secure your account immediately:
            </Text>
            <Button
              href={actionUrl}
              style={dangerButtonStyle}
              className="box-border"
            >
              Review Active Sessions & Revoke Access →
            </Button>
          </Section>

          <Hr style={dividerStyle} />

          <Text style={securityTipsStyle}>
            Security tip: Never share your one-time passwords or Resend API keys with anyone.
          </Text>

          <Text style={footerTextStyle}>
            This is an automated security alert delivered directly via Resend to protect your account.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

SecurityAlertEmail.PreviewProps = {
  userName: 'Jordan Lee',
  loginTime: 'October 3, 2026 at 10:14 AM UTC',
  ipAddress: '198.51.100.42',
  location: 'San Francisco, CA, United States',
  device: 'Chrome 128 on macOS (Sonoma)',
  actionUrl: 'https://resend.com/security/sessions',
};

export default SecurityAlertEmail;

const mainStyle: React.CSSProperties = {
  backgroundColor: '#0c0a09',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 16px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#1c1917',
  borderRadius: '12px',
  border: '1px solid #292524',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '36px 32px',
};

const shieldBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(239, 68, 68, 0.15)',
  border: '1px solid rgba(239, 68, 68, 0.35)',
  color: '#f87171',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  padding: '4px 12px',
  borderRadius: '9999px',
  marginBottom: '12px',
};

const headingStyle: React.CSSProperties = {
  color: '#fafaf9',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 10px 0',
};

const introTextStyle: React.CSSProperties = {
  color: '#a8a29e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const alertBoxStyle: React.CSSProperties = {
  backgroundColor: '#292524',
  borderLeft: '4px solid #ef4444',
  borderRadius: '8px',
  padding: '18px 20px',
  margin: '24px 0',
};

const detailRowStyle: React.CSSProperties = {
  padding: '6px 0',
};

const labelStyle: React.CSSProperties = {
  color: '#a8a29e',
  fontSize: '13px',
  margin: '0',
};

const valueStyle: React.CSSProperties = {
  color: '#f5f5f4',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
};

const adviceTextStyle: React.CSSProperties = {
  color: '#d6d3d1',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 20px 0',
};

const dangerButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '13px 26px',
  display: 'inline-block',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#292524',
  borderStyle: 'solid',
  margin: '24px 0 16px 0',
};

const securityTipsStyle: React.CSSProperties = {
  color: '#78716c',
  fontSize: '12px',
  fontStyle: 'italic',
  textAlign: 'center',
  margin: '0 0 8px 0',
};

const footerTextStyle: React.CSSProperties = {
  color: '#57534e',
  fontSize: '11px',
  textAlign: 'center',
  margin: '0',
};
