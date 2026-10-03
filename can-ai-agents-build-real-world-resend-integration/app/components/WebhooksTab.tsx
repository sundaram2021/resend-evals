'use client';

import React, { useState, useEffect } from 'react';
import {
  Webhook,
  Activity,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Play,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Code
} from 'lucide-react';
import { WebhookEventRecord } from '@/lib/types';

interface WebhooksTabProps {
  addToast: (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => void;
}

export const WebhooksTab: React.FC<WebhooksTabProps> = ({ addToast }) => {
  const [events, setEvents] = useState<WebhookEventRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [selectedEventType, setSelectedEventType] = useState<string>('email.delivered');
  const [copied, setCopied] = useState<boolean>(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/webhooks/resend');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const fakeEmailId = `01a${Math.random().toString(36).substring(2, 10)}`;
      const payload = {
        type: selectedEventType,
        data: {
          email_id: fakeEmailId,
          from: 'onboarding@resend.dev',
          to: ['delivered@resend.dev'],
          subject: 'Welcome to Resend Integration',
          created_at: new Date().toISOString(),
          tags: [{ name: 'category', value: 'onboarding' }],
        },
      };

      const res = await fetch('/api/webhooks/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-simulated-event': 'true',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        addToast({
          type: 'success',
          title: 'Webhook Event Simulated',
          message: `Dispatched ${selectedEventType} successfully`,
        });
        await fetchEvents();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Simulation failed';
      addToast({ type: 'error', title: 'Simulation Error', message: msg });
    } finally {
      setSimulating(false);
    }
  };

  const handleClear = async () => {
    try {
      await fetch('/api/webhooks/resend?action=clear');
      setEvents([]);
      addToast({
        type: 'info',
        title: 'Cleared History',
        message: 'All webhook event logs have been cleared.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyEndpoint = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    navigator.clipboard.writeText(`${origin}/api/webhooks/resend`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Copied Endpoint URL',
      message: `${origin}/api/webhooks/resend`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Webhook className="w-5 h-5 text-indigo-400" />
            Inbound Webhook Verification & Events
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time delivery events captured and verified with Svix cryptographic signatures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {events.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 text-xs font-semibold border border-rose-800/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid: Webhook Endpoint Setup & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Card */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Endpoint URL & Signature Security
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Handler
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono truncate">
              /api/webhooks/resend
            </div>
            <button
              type="button"
              onClick={copyEndpoint}
              className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs flex items-center gap-1 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 space-y-2 font-mono">
            <div className="text-zinc-300 font-semibold">// Svix Verification Pattern:</div>
            <div className="text-indigo-300">
              const payload = await req.text(); // Raw text!
            </div>
            <div className="text-indigo-300">
              resend.webhooks.verify({`{ payload, headers, webhookSecret }`});
            </div>
          </div>
        </div>

        {/* Simulator Card */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Play className="w-4 h-4 text-indigo-400" />
            Event Simulator
          </span>
          <p className="text-xs text-zinc-400">
            Simulate Resend delivery events to test how your application reacts to delivery confirmations, bounces, or opens in real time.
          </p>

          <div className="flex items-center gap-3">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none"
            >
              <option value="email.delivered">email.delivered (Successful delivery)</option>
              <option value="email.opened">email.opened (Recipient opened message)</option>
              <option value="email.clicked">email.clicked (Recipient clicked link)</option>
              <option value="email.bounced">email.bounced (Hard bounce occurred)</option>
              <option value="email.complained">email.complained (Spam complaint received)</option>
            </select>

            <button
              type="button"
              onClick={handleSimulate}
              disabled={simulating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              {simulating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              Trigger
            </button>
          </div>
        </div>
      </div>

      {/* Events Stream List */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Captured Webhook Stream ({events.length})
        </h3>

        {events.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No webhook events captured yet. Click "Trigger" above or connect your endpoint in Resend.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold ${
                      evt.type === 'email.delivered'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                        : evt.type === 'email.opened' || evt.type === 'email.clicked'
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                    }`}
                  >
                    {evt.type}
                  </span>
                  <div>
                    <span className="font-mono text-zinc-300">
                      Email ID: {evt.data?.email_id || 'N/A'}
                    </span>
                    <span className="text-zinc-500 ml-2">
                      ({new Date(evt.created_at).toLocaleTimeString()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      evt.source === 'live'
                        ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {evt.source === 'live' ? 'Live Signature' : 'Simulated'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
