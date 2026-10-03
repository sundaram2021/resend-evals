import { NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';

export async function GET() {
  const startTime = Date.now();
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        status: 'unconfigured',
        message: 'RESEND_API_KEY environment variable is not set.',
        latencyMs: 0,
      },
      { status: 500 }
    );
  }

  try {
    // Ping Resend API to verify authentication and fetch domain status
    const { data: domainsData, error: domainsError } = await resend.domains.list();
    const latencyMs = Date.now() - startTime;

    if (domainsError) {
      return NextResponse.json({
        status: 'error',
        error: domainsError.message,
        latencyMs,
        apiKeyMasked: `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`,
        fromEmail: DEFAULT_FROM_EMAIL,
      });
    }

    const domains = domainsData?.data || [];
    const isSandbox = DEFAULT_FROM_EMAIL.includes('resend.dev');

    return NextResponse.json({
      status: 'healthy',
      connected: true,
      latencyMs,
      apiKeyMasked: `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`,
      fromEmail: DEFAULT_FROM_EMAIL,
      isSandbox,
      domainsCount: domains.length,
      domains: domains.map((d: any) => ({
        id: d.id,
        name: d.name,
        status: d.status,
        region: d.region,
      })),
    });
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const message = err instanceof Error ? err.message : 'Failed to reach Resend API';
    return NextResponse.json(
      {
        status: 'error',
        error: message,
        latencyMs,
      },
      { status: 500 }
    );
  }
}
