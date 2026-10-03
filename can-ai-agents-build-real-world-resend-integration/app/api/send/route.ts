import { NextRequest, NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL, generateIdempotencyKey } from '@/lib/resend';
import { getTemplateElement } from '@/emails';
import { SendEmailPayload, TemplateId } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: SendEmailPayload = await req.json();
    const {
      to,
      subject,
      templateId = 'welcome',
      props = {},
      html,
      text,
      replyTo,
      cc,
      bcc,
      scheduledAt,
    } = body;

    // Validate recipient
    if (!to || (Array.isArray(to) && to.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Recipient email address ("to") is required.' },
        { status: 400 }
      );
    }

    if (!subject || subject.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Email subject is required.' },
        { status: 400 }
      );
    }

    // Generate unique idempotency key for this request to prevent duplicate sends on retries
    const idempotencyKey = generateIdempotencyKey(`send-${templateId}`);

    // Build Resend send options
    const sendOptions: any = {
      from: DEFAULT_FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
    };

    if (replyTo) sendOptions.reply_to = replyTo;
    if (cc) sendOptions.cc = Array.isArray(cc) ? cc : [cc];
    if (bcc) sendOptions.bcc = Array.isArray(bcc) ? bcc : [bcc];
    if (scheduledAt) sendOptions.scheduled_at = scheduledAt;

    // Attach React component or HTML/text
    if (templateId === 'custom') {
      if (html) sendOptions.html = html;
      if (text) sendOptions.text = text;
      if (!html && !text) {
        sendOptions.html = '<p>Notification from Next.js application</p>';
      }
    } else {
      const reactElement = getTemplateElement(templateId as TemplateId, props);
      if (reactElement) {
        sendOptions.react = reactElement;
      } else {
        sendOptions.html = html || '<p>Default notification</p>';
      }
    }

    // Call Resend API with idempotency key
    // Note: Resend Node SDK does NOT throw on error — it returns { data, error }
    const { data, error } = await resend.emails.send(sendOptions, {
      idempotencyKey,
    });

    if (error) {
      console.error('[Resend Send Error]:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to send email via Resend',
          name: error.name,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data?.id,
        to: sendOptions.to,
        from: sendOptions.from,
        subject: sendOptions.subject,
        idempotencyKey,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    console.error('[API Send Exception]:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
