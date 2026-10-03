export type TemplateId = 'welcome' | 'receipt' | 'security' | 'feedback' | 'custom';

export interface WelcomeProps {
  name: string;
  loginUrl: string;
  companyName: string;
  supportEmail: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export interface SecurityAlertProps {
  userName: string;
  loginTime: string;
  ipAddress: string;
  location: string;
  device: string;
  actionUrl: string;
}

export interface FeedbackProps {
  customerName: string;
  productName: string;
  feedbackUrl: string;
}

export type TemplatePropsMap = {
  welcome: WelcomeProps;
  receipt: ReceiptProps;
  security: SecurityAlertProps;
  feedback: FeedbackProps;
  custom: { htmlContent: string };
};

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  templateId: TemplateId;
  props?: Record<string, unknown>;
  html?: string;
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  scheduledAt?: string;
}

export interface ResendEmailItem {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  last_event: 'delivered' | 'sent' | 'bounced' | 'complained' | 'queued' | 'delivery_delayed' | string;
  message_id?: string | null;
  scheduled_at?: string | null;
}

export interface WebhookEventRecord {
  id: string;
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    [key: string]: unknown;
  };
  verified: boolean;
  source: 'live' | 'simulated';
}
