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
import { FeedbackProps } from '@/lib/types';

export const FeedbackEmail: React.FC<FeedbackProps> & { PreviewProps?: FeedbackProps } = ({
  customerName = 'Taylor',
  productName = 'Resend Next.js App',
  feedbackUrl = 'https://resend.com/feedback',
}) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>How was your experience with {productName}?</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={pillStyle}>💌 YOUR FEEDBACK MATTERS</div>
            <Heading style={headingStyle}>How are we doing, {customerName}?</Heading>
            <Text style={introStyle}>
              We are constantly working to improve {productName}. How would you rate your recent experience?
            </Text>
          </Section>

          {/* Rating Buttons */}
          <Section style={ratingSectionStyle}>
            <Row>
              {[
                { score: '1', label: '😞 Disappointed' },
                { score: '2', label: '😐 Okay' },
                { score: '3', label: '🙂 Good' },
                { score: '4', label: '😃 Great' },
                { score: '5', label: '🚀 Amazing' },
              ].map((item) => (
                <Column key={item.score} style={{ textAlign: 'center', padding: '0 4px' }}>
                  <Button
                    href={`${feedbackUrl}?score=${item.score}`}
                    style={ratingButtonStyle}
                    className="box-border"
                  >
                    {item.score}
                  </Button>
                </Column>
              ))}
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Column style={{ width: '50%', textAlign: 'left' }}>
                <Text style={scaleLabelStyle}>1 - Needs work</Text>
              </Column>
              <Column style={{ width: '50%', textAlign: 'right' }}>
                <Text style={scaleLabelStyle}>5 - Outstanding</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Text style={commentPromptStyle}>
              Have specific ideas or feature requests?
            </Text>
            <Button
              href={feedbackUrl}
              style={fullReviewButtonStyle}
              className="box-border"
            >
              Share Detailed Feedback (Takes 1 min) →
            </Button>
          </Section>

          <Hr style={dividerStyle} />

          <Text style={footerTextStyle}>
            Thank you for helping us craft better tools. Sent via Resend email service.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

FeedbackEmail.PreviewProps = {
  customerName: 'Taylor Morgan',
  productName: 'Next.js Resend Integration',
  feedbackUrl: 'https://resend.com/feedback',
};

export default FeedbackEmail;

const mainStyle: React.CSSProperties = {
  backgroundColor: '#09090b',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 16px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  border: '1px solid #27272a',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '36px 32px',
};

const pillStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(168, 85, 247, 0.15)',
  border: '1px solid rgba(168, 85, 247, 0.35)',
  color: '#c084fc',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  padding: '4px 12px',
  borderRadius: '9999px',
  marginBottom: '12px',
};

const headingStyle: React.CSSProperties = {
  color: '#fafafa',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 10px 0',
};

const introStyle: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const ratingSectionStyle: React.CSSProperties = {
  backgroundColor: '#27272a',
  borderRadius: '10px',
  padding: '24px 16px 16px 16px',
  margin: '28px 0',
};

const ratingButtonStyle: React.CSSProperties = {
  backgroundColor: '#3f3f46',
  color: '#f4f4f5',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  padding: '12px 14px',
  display: 'block',
  border: '1px solid #52525b',
};

const scaleLabelStyle: React.CSSProperties = {
  color: '#71717a',
  fontSize: '11px',
  margin: '0',
};

const commentPromptStyle: React.CSSProperties = {
  color: '#d4d4d8',
  fontSize: '14px',
  margin: '0 0 12px 0',
};

const fullReviewButtonStyle: React.CSSProperties = {
  backgroundColor: '#9333ea',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#27272a',
  borderStyle: 'solid',
  margin: '24px 0 16px 0',
};

const footerTextStyle: React.CSSProperties = {
  color: '#71717a',
  fontSize: '12px',
  textAlign: 'center',
  margin: '0',
};
