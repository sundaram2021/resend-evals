import * as React from 'react';
import { render } from '@react-email/components';
import { TemplateId } from '@/lib/types';
import WelcomeEmail from './templates/WelcomeEmail';
import ReceiptEmail from './templates/ReceiptEmail';
import SecurityAlertEmail from './templates/SecurityAlertEmail';
import FeedbackEmail from './templates/FeedbackEmail';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'onboarding' | 'transactional' | 'security' | 'marketing' | 'custom';
  description: string;
  defaultSubject: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
}

export const TEMPLATES: Record<TemplateId, TemplateDefinition> = {
  welcome: {
    id: 'welcome',
    name: 'Welcome & Onboarding',
    category: 'onboarding',
    description: 'Clean SaaS customer onboarding with step-by-step guide and CTA button.',
    defaultSubject: 'Welcome aboard! Let’s get you started',
    component: WelcomeEmail,
    defaultProps: (WelcomeEmail.PreviewProps || {
      name: 'Alex Rivera',
      loginUrl: 'https://resend.com',
      companyName: 'Acme Cloud Platform',
      supportEmail: 'support@example.com',
    }) as Record<string, any>,
  },
  receipt: {
    id: 'receipt',
    name: 'Purchase Receipt',
    category: 'transactional',
    description: 'Itemized transaction receipt with subtotal, tax calculation, and order metadata.',
    defaultSubject: 'Your receipt for Order #ORD-89421',
    component: ReceiptEmail,
    defaultProps: (ReceiptEmail.PreviewProps || {
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
    }) as Record<string, any>,
  },
  security: {
    id: 'security',
    name: 'Security Login Alert',
    category: 'security',
    description: 'Critical warning email with device, IP, and location context plus revoke button.',
    defaultSubject: 'Security Alert: New sign-in detected',
    component: SecurityAlertEmail,
    defaultProps: (SecurityAlertEmail.PreviewProps || {
      userName: 'Jordan Lee',
      loginTime: 'October 3, 2026 at 10:14 AM UTC',
      ipAddress: '198.51.100.42',
      location: 'San Francisco, CA, United States',
      device: 'Chrome 128 on macOS (Sonoma)',
      actionUrl: 'https://resend.com/security/sessions',
    }) as Record<string, any>,
  },
  feedback: {
    id: 'feedback',
    name: 'Customer Feedback (CSAT)',
    category: 'marketing',
    description: 'Interactive rating survey with 1-5 score buttons and feedback prompt.',
    defaultSubject: 'How was your experience with Acme?',
    component: FeedbackEmail,
    defaultProps: (FeedbackEmail.PreviewProps || {
      customerName: 'Taylor Morgan',
      productName: 'Next.js Resend Integration',
      feedbackUrl: 'https://resend.com/feedback',
    }) as Record<string, any>,
  },
  custom: {
    id: 'custom',
    name: 'Custom HTML / Plain Text',
    category: 'custom',
    description: 'Send custom raw HTML markup or simple plain-text messages.',
    defaultSubject: 'Custom notification via Resend',
    component: () => null,
    defaultProps: {
      htmlContent: '<h1>Hello from Next.js!</h1><p>This is a custom email sent directly through Resend.</p>',
    },
  },
};

/**
 * Returns the React element for the specified template and props
 */
export function getTemplateElement(
  templateId: TemplateId,
  props?: Record<string, unknown>
): React.ReactElement | null {
  if (templateId === 'custom') return null;

  const template = TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Unknown template ID: ${templateId}`);
  }

  const mergedProps = {
    ...template.defaultProps,
    ...(props || {}),
  };

  return React.createElement(template.component, mergedProps);
}

/**
 * Renders the template to an HTML string and plain-text version
 */
export async function renderTemplateToHtml(
  templateId: TemplateId,
  props?: Record<string, unknown>
): Promise<{ html: string; text?: string }> {
  if (templateId === 'custom') {
    const rawHtml =
      typeof props?.htmlContent === 'string'
        ? props.htmlContent
        : '<p>Custom email body</p>';
    return { html: rawHtml };
  }

  const element = getTemplateElement(templateId, props);
  if (!element) {
    return { html: '<p>Empty template</p>' };
  }

  const html = await render(element);
  const text = await render(element, { plainText: true });

  return { html, text };
}

export { WelcomeEmail, ReceiptEmail, SecurityAlertEmail, FeedbackEmail };
