import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Row,
  Column,
  Link,
} from '@react-email/components';
import { ReceiptProps } from '@/lib/types';

export const ReceiptEmail: React.FC<ReceiptProps> & { PreviewProps?: ReceiptProps } = ({
  customerName = 'Sarah Connor',
  orderNumber = 'ORD-89421',
  orderDate = 'October 3, 2026',
  items = [
    { name: 'Developer Pro Subscription (Annual)', quantity: 1, price: 149.0 },
    { name: 'Dedicated Inbound Email Route', quantity: 1, price: 29.0 },
    { name: 'Dedicated IP Addon', quantity: 1, price: 30.0 },
  ],
  subtotal = 208.0,
  tax = 16.64,
  total = 224.64,
  paymentMethod = 'Visa ending in 4242',
}) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Receipt for order #{orderNumber} from Acme Cloud</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerSectionStyle}>
            <Text style={companyBadgeStyle}>ACME CLOUD INVOICING</Text>
            <Heading style={headingStyle}>Thank you for your purchase!</Heading>
            <Text style={subheadingStyle}>
              Hi {customerName}, here is your receipt for order{' '}
              <strong style={{ color: '#f8fafc' }}>#{orderNumber}</strong> processed on {orderDate}.
            </Text>
          </Section>

          {/* Payment Info Pill */}
          <Section style={metaBoxStyle}>
            <Row>
              <Column style={{ width: '50%' }}>
                <Text style={metaLabelStyle}>Order Number</Text>
                <Text style={metaValueStyle}>#{orderNumber}</Text>
              </Column>
              <Column style={{ width: '50%' }}>
                <Text style={metaLabelStyle}>Payment Method</Text>
                <Text style={metaValueStyle}>{paymentMethod}</Text>
              </Column>
            </Row>
          </Section>

          {/* Itemized Table */}
          <Section style={tableSectionStyle}>
            <Text style={tableHeaderStyle}>ORDER SUMMARY</Text>
            <Hr style={dividerStyle} />

            {items.map((item, index) => (
              <Row key={index} style={itemRowStyle}>
                <Column style={{ width: '70%' }}>
                  <Text style={itemNameStyle}>{item.name}</Text>
                  <Text style={itemQtyStyle}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={{ width: '30%', textAlign: 'right' }}>
                  <Text style={itemPriceStyle}>${(item.price * item.quantity).toFixed(2)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={dividerStyle} />

            {/* Calculations */}
            <Row style={calcRowStyle}>
              <Column style={{ width: '70%' }}>
                <Text style={calcLabelStyle}>Subtotal</Text>
              </Column>
              <Column style={{ width: '30%', textAlign: 'right' }}>
                <Text style={calcValueStyle}>${subtotal.toFixed(2)}</Text>
              </Column>
            </Row>

            <Row style={calcRowStyle}>
              <Column style={{ width: '70%' }}>
                <Text style={calcLabelStyle}>Estimated Tax (8%)</Text>
              </Column>
              <Column style={{ width: '30%', textAlign: 'right' }}>
                <Text style={calcValueStyle}>${tax.toFixed(2)}</Text>
              </Column>
            </Row>

            <Hr style={dividerStyle} />

            <Row style={totalRowStyle}>
              <Column style={{ width: '70%' }}>
                <Text style={totalLabelStyle}>Total Paid</Text>
              </Column>
              <Column style={{ width: '30%', textAlign: 'right' }}>
                <Text style={totalValueStyle}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Download / Support */}
          <Section style={footerActionStyle}>
            <Text style={footerTextStyle}>
              Need a formal PDF invoice for taxes?{' '}
              <Link href="https://resend.com" style={linkStyle}>
                Download PDF Invoice
              </Link>
            </Text>
          </Section>

          <Hr style={dividerStyle} />

          <Text style={copyrightStyle}>
            Questions about this charge? Reply directly to this email or visit our help center.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

ReceiptEmail.PreviewProps = {
  customerName: 'Sarah Connor',
  orderNumber: 'ORD-89421',
  orderDate: 'October 3, 2026',
  items: [
    { name: 'Developer Pro Subscription (Annual)', quantity: 1, price: 149.0 },
    { name: 'Dedicated Inbound Email Route', quantity: 1, price: 29.0 },
    { name: 'Dedicated IP Addon', quantity: 1, price: 30.0 },
  ],
  subtotal: 208.0,
  tax: 16.64,
  total: 224.64,
  paymentMethod: 'Visa ending in 4242',
};

export default ReceiptEmail;

// Inline styles
const mainStyle: React.CSSProperties = {
  backgroundColor: '#090d16',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 16px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#111827',
  borderRadius: '12px',
  border: '1px solid #1f2937',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '36px 32px',
};

const headerSectionStyle: React.CSSProperties = {
  marginBottom: '24px',
};

const companyBadgeStyle: React.CSSProperties = {
  color: '#10b981',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  margin: '0 0 8px 0',
};

const headingStyle: React.CSSProperties = {
  color: '#f9fafb',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 10px 0',
};

const subheadingStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const metaBoxStyle: React.CSSProperties = {
  backgroundColor: '#1f2937',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
};

const metaLabelStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  margin: '0 0 4px 0',
};

const metaValueStyle: React.CSSProperties = {
  color: '#f3f4f6',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const tableSectionStyle: React.CSSProperties = {
  margin: '24px 0',
};

const tableHeaderStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  margin: '0 0 8px 0',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#1f2937',
  borderStyle: 'solid',
  margin: '12px 0',
};

const itemRowStyle: React.CSSProperties = {
  padding: '6px 0',
};

const itemNameStyle: React.CSSProperties = {
  color: '#e5e7eb',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const itemQtyStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '2px 0 0 0',
};

const itemPriceStyle: React.CSSProperties = {
  color: '#f3f4f6',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const calcRowStyle: React.CSSProperties = {
  padding: '4px 0',
};

const calcLabelStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: '0',
};

const calcValueStyle: React.CSSProperties = {
  color: '#d1d5db',
  fontSize: '13px',
  margin: '0',
};

const totalRowStyle: React.CSSProperties = {
  padding: '8px 0',
};

const totalLabelStyle: React.CSSProperties = {
  color: '#f9fafb',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

const totalValueStyle: React.CSSProperties = {
  color: '#10b981',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
};

const footerActionStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0 16px 0',
};

const footerTextStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: '0',
};

const linkStyle: React.CSSProperties = {
  color: '#38bdf8',
  textDecoration: 'underline',
};

const copyrightStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '12px',
  textAlign: 'center',
  margin: '16px 0 0 0',
};
