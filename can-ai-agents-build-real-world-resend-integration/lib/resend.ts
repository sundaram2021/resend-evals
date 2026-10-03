import { Resend } from 'resend';

// Validate and retrieve API key
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    '[Resend Warning] RESEND_API_KEY environment variable is not defined. Ensure it is set in .env.local.'
  );
}

// Resend client singleton
export const resend = new Resend(apiKey || 're_mock_placeholder');

// Default sender address configured in environment or Resend onboarding domain
export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Generate a unique, compliant idempotency key (format: <event-type>/<entity-id>)
 * Resend idempotency keys: max 256 chars, valid for 24 hours.
 */
export function generateIdempotencyKey(scope = 'transactional'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${scope}/${timestamp}-${random}`;
}

/**
 * Formats API errors from Resend SDK responses into user-friendly messages
 */
export function formatResendError(error: unknown): string {
  if (!error) return 'Unknown error occurred';
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
