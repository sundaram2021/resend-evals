import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { addWebhookEvent, getWebhookEvents, clearWebhookEvents } from '@/lib/webhook-store';

export async function POST(req: NextRequest) {
  try {
    // Check if this is a simulation request from our dashboard
    const isSimulatedHeader = req.headers.get('x-simulated-event');
    if (isSimulatedHeader === 'true') {
      const payload = await req.json();
      const record = addWebhookEvent({
        type: payload.type || 'email.delivered',
        data: payload.data || {},
        verified: true,
        source: 'simulated',
      });
      return NextResponse.json({ success: true, record });
    }

    // IMPORTANT RESEND REQUIREMENT: Webhook verification requires raw text, NOT req.json()
    const rawPayload = await req.text();
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    let verified = false;
    let event: any = null;

    if (webhookSecret) {
      try {
        const id = req.headers.get('svix-id') || '';
        const timestamp = req.headers.get('svix-timestamp') || '';
        const signature = req.headers.get('svix-signature') || '';

        event = resend.webhooks.verify({
          payload: rawPayload,
          headers: {
            id,
            timestamp,
            signature,
          },
          webhookSecret,
        });
        verified = true;
      } catch (verifyErr) {
        console.warn('[Resend Webhook] Signature verification failed:', verifyErr);
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    } else {
      // If secret not configured in dev, parse safely for demo/testing
      try {
        event = JSON.parse(rawPayload);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
      }
    }

    // Process event types (e.g. email.sent, email.delivered, email.bounced, email.complained, email.opened, email.clicked)
    const eventType = event?.type || 'unknown';
    const eventData = event?.data || {};

    const record = addWebhookEvent({
      type: eventType,
      data: eventData,
      verified,
      source: 'live',
    });

    console.log(`[Resend Webhook Received]: ${eventType} for email:`, eventData?.email_id);

    return NextResponse.json({ success: true, eventId: record.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing error';
    console.error('[Resend Webhook Handler Exception]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('action') === 'clear') {
    clearWebhookEvents();
    return NextResponse.json({ success: true, message: 'Webhook history cleared' });
  }

  const events = getWebhookEvents();
  return NextResponse.json({ success: true, events });
}
