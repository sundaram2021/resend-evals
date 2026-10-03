import { WebhookEventRecord } from './types';

// Global singleton to persist webhook events in memory across API requests in development
const globalForWebhookStore = globalThis as unknown as {
  webhookEvents: WebhookEventRecord[] | undefined;
};

const MAX_STORED_EVENTS = 50;

export const webhookEventsStore: WebhookEventRecord[] =
  globalForWebhookStore.webhookEvents ?? [];

if (process.env.NODE_ENV !== 'production') {
  globalForWebhookStore.webhookEvents = webhookEventsStore;
}

export function addWebhookEvent(event: Omit<WebhookEventRecord, 'id' | 'created_at'>): WebhookEventRecord {
  const record: WebhookEventRecord = {
    ...event,
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  webhookEventsStore.unshift(record);

  if (webhookEventsStore.length > MAX_STORED_EVENTS) {
    webhookEventsStore.pop();
  }

  return record;
}

export function getWebhookEvents(): WebhookEventRecord[] {
  return [...webhookEventsStore];
}

export function clearWebhookEvents(): void {
  webhookEventsStore.length = 0;
}
