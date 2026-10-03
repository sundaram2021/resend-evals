import { NextRequest, NextResponse } from 'next/server';
import { renderTemplateToHtml } from '@/emails';
import { TemplateId } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId = 'welcome', props = {} } = body;

    const { html, text } = await renderTemplateToHtml(
      templateId as TemplateId,
      props
    );

    return NextResponse.json({
      success: true,
      html,
      text: text || '',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to render preview';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
