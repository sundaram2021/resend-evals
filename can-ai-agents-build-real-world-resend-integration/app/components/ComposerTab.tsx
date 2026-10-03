'use client';

import React, { useState } from 'react';
import {
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  Layers,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { TEMPLATES } from '@/emails';
import { TemplateId } from '@/lib/types';

interface ComposerTabProps {
  onEmailSent: (email: any) => void;
  onPreviewTemplate: (templateId: TemplateId, props: any) => void;
  addToast: (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => void;
  defaultSenderEmail: string;
}

export const ComposerTab: React.FC<ComposerTabProps> = ({
  onEmailSent,
  onPreviewTemplate,
  addToast,
  defaultSenderEmail,
}) => {
  const [recipient, setRecipient] = useState<string>('delivered@resend.dev');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('welcome');
  const [subject, setSubject] = useState<string>(TEMPLATES.welcome.defaultSubject);
  const [templateProps, setTemplateProps] = useState<Record<string, any>>({
    ...TEMPLATES.welcome.defaultProps,
  });
  const [customHtml, setCustomHtml] = useState<string>(
    '<h1>Hello from Next.js & Resend!</h1><p>This is a custom transactional email test.</p>'
  );

  // Advanced fields
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [bcc, setBcc] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');

  // Status
  const [loading, setLoading] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<{
    id: string;
    to: string[];
    idempotencyKey: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Switch template handler
  const handleTemplateChange = (id: TemplateId) => {
    setSelectedTemplate(id);
    const tmpl = TEMPLATES[id];
    setSubject(tmpl.defaultSubject);
    setTemplateProps({ ...tmpl.defaultProps });
  };

  const handlePropChange = (key: string, value: any) => {
    setTemplateProps((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      addToast({
        type: 'error',
        title: 'Missing recipient',
        message: 'Please provide a valid recipient email address.',
      });
      return;
    }

    setLoading(true);
    setLastResult(null);

    try {
      const payload: any = {
        to: recipient.trim(),
        subject: subject.trim(),
        templateId: selectedTemplate,
        props: templateProps,
      };

      if (selectedTemplate === 'custom') {
        payload.html = customHtml;
      }
      if (replyTo.trim()) payload.replyTo = replyTo.trim();
      if (cc.trim()) payload.cc = cc.trim();
      if (bcc.trim()) payload.bcc = bcc.trim();
      if (scheduledAt.trim()) payload.scheduledAt = scheduledAt.trim();

      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to send email via Resend');
      }

      setLastResult(json.data);
      onEmailSent(json.data);

      addToast({
        type: 'success',
        title: 'Email Sent Successfully!',
        message: `Message ID: ${json.data.id}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Send failed';
      addToast({
        type: 'error',
        title: 'Delivery Error',
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyEmailId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Composer Form */}
      <div className="lg:col-span-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" />
              Email Composer
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Send transactional emails via Resend SDK with built-in React Email templates and idempotency.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPreviewTemplate(selectedTemplate, templateProps)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            Live Preview
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-6">
          {/* Sender & Recipient Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                From (Sender)
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 text-sm font-mono flex items-center justify-between">
                <span>{defaultSenderEmail}</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                  Default
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                To (Recipient)
              </label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm transition-all"
              />
            </div>
          </div>

          {/* Quick Test Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500 font-medium">Quick Test Recipient:</span>
            <button
              type="button"
              onClick={() => setRecipient('delivered@resend.dev')}
              className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/50 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              delivered@resend.dev (Pass)
            </button>
            <button
              type="button"
              onClick={() => setRecipient('bounced@resend.dev')}
              className="text-xs px-2.5 py-1 rounded-md bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              bounced@resend.dev (Bounce)
            </button>
            <button
              type="button"
              onClick={() => setRecipient('complained@resend.dev')}
              className="text-xs px-2.5 py-1 rounded-md bg-amber-950/60 hover:bg-amber-900/60 text-amber-400 border border-amber-800/50 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              complained@resend.dev (Spam)
            </button>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Email Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => {
                const tmpl = TEMPLATES[id];
                const isSelected = selectedTemplate === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleTemplateChange(id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-zinc-800/90 border-indigo-500 shadow-md shadow-indigo-950/30'
                        : 'bg-zinc-950/50 border-zinc-800/80 hover:bg-zinc-800/50 hover:border-zinc-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400"></div>
                    )}
                    <div className="text-sm font-semibold text-white">{tmpl.name}</div>
                    <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {tmpl.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Subject Line
              </label>
              <button
                type="button"
                onClick={() => setSubject(TEMPLATES[selectedTemplate].defaultSubject)}
                className="text-[11px] text-zinc-400 hover:text-indigo-400 transition-colors"
              >
                Reset to default
              </button>
            </div>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm"
            />
          </div>

          {/* Dynamic Template Fields */}
          {selectedTemplate === 'welcome' && (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Welcome Template Variables
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">User Name</label>
                  <input
                    type="text"
                    value={templateProps.name || ''}
                    onChange={(e) => handlePropChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={templateProps.companyName || ''}
                    onChange={(e) => handlePropChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-zinc-400 mb-1">CTA Action URL</label>
                  <input
                    type="url"
                    value={templateProps.loginUrl || ''}
                    onChange={(e) => handlePropChange('loginUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'receipt' && (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Receipt Template Variables
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={templateProps.customerName || ''}
                    onChange={(e) => handlePropChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Order Number</label>
                  <input
                    type="text"
                    value={templateProps.orderNumber || ''}
                    onChange={(e) => handlePropChange('orderNumber', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Total Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={templateProps.total || 0}
                    onChange={(e) => handlePropChange('total', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={templateProps.paymentMethod || ''}
                    onChange={(e) => handlePropChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'security' && (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Security Alert Variables
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">User Name</label>
                  <input
                    type="text"
                    value={templateProps.userName || ''}
                    onChange={(e) => handlePropChange('userName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={templateProps.ipAddress || ''}
                    onChange={(e) => handlePropChange('ipAddress', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Device / Browser</label>
                  <input
                    type="text"
                    value={templateProps.device || ''}
                    onChange={(e) => handlePropChange('device', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={templateProps.location || ''}
                    onChange={(e) => handlePropChange('location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'feedback' && (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Feedback Template Variables
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={templateProps.customerName || ''}
                    onChange={(e) => handlePropChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={templateProps.productName || ''}
                    onChange={(e) => handlePropChange('productName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'custom' && (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Raw HTML Content
              </label>
              <textarea
                rows={6}
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs font-mono"
              />
            </div>
          )}

          {/* Advanced Options Accordion */}
          <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950/40">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span>Advanced Delivery Options (Reply-To, CC, BCC, Schedule)</span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Reply-To</label>
                  <input
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    placeholder="support@yourdomain.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">CC Recipient</label>
                  <input
                    type="email"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="manager@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">BCC Recipient</label>
                  <input
                    type="email"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="audit@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Scheduled Send (Optional)
                  </label>
                  <input
                    type="text"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    placeholder="in 1 hour or ISO-8601"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending via Resend API...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Email with Resend
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success Result Card */}
        {lastResult && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 animate-in fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-emerald-200">
                  Email Dispatched Successfully
                </h4>
                <p className="text-xs text-emerald-300/80 mt-1">
                  Resend has accepted your message and is processing delivery.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono bg-zinc-900 text-zinc-300 px-2.5 py-1 rounded border border-zinc-800">
                    ID: {lastResult.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyEmailId(lastResult.id)}
                    className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1"
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy ID
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Tips & Resend Insights */}
      <div className="lg:col-span-4 space-y-6">
        {/* Deliverability Badge Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            <Layers className="w-4 h-4" />
            Integration Highlights
          </div>
          <ul className="space-y-3 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Idempotency Enforced:</strong> Prevents double-charging or duplicate sends during network retries.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>React Email:</strong> Production-tested HTML output tested on Gmail, Apple Mail, and Outlook.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Non-Throwing SDK:</strong> Explicitly checks <code>error</code> object for deterministic error handling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Webhooks Ready:</strong> Inbound delivery verification with Svix timestamps and signatures.
              </span>
            </li>
          </ul>
        </div>

        {/* Sandbox Note */}
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-6 text-xs text-amber-200/90 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Sandbox Mode Notice
          </div>
          <p>
            When sending from <code>onboarding@resend.dev</code>, Resend only delivers to your account registration email and simulation addresses (<code>delivered@resend.dev</code>).
          </p>
          <p className="text-zinc-400">
            To send to arbitrary external domains, add and verify your custom domain in the Resend dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};
