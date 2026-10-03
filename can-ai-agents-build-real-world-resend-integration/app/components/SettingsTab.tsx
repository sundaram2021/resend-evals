'use client';

import React, { useState } from 'react';
import {
  Settings,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Server,
  Zap,
  Globe
} from 'lucide-react';

interface SettingsTabProps {
  health: {
    status: string;
    connected: boolean;
    latencyMs: number;
    apiKeyMasked?: string;
    fromEmail: string;
    isSandbox: boolean;
    domainsCount?: number;
    domains?: Array<{ id: string; name: string; status: string; region: string }>;
  } | null;
  addToast: (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ health, addToast }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    addToast({
      type: 'info',
      title: 'Command Copied',
      message: cmd,
    });
  };

  const cliCommands = [
    {
      title: 'Check Environment Health',
      command: 'resend doctor -q',
      desc: 'Validates API key, credential storage, and domain configuration.',
    },
    {
      title: 'Send Test Email via CLI',
      command: 'resend emails send --from onboarding@resend.dev --to delivered@resend.dev --subject "Hello" --text "Testing"',
      desc: 'Dispatches a test email directly from your terminal using the configured profile.',
    },
    {
      title: 'Forward Webhooks to Localhost',
      command: 'resend webhooks listen --forward http://localhost:3000/api/webhooks/resend',
      desc: 'Streams real-time Resend delivery events to your local Next.js dev server.',
    },
    {
      title: 'Inspect Authentication Profile',
      command: 'resend whoami -q',
      desc: 'Displays active profile, permissions (full_access), and credentials path.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Diagnostics, Environment & CLI Commands
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Configuration status, Resend CLI workflows, and production deliverability checklists.
          </p>
        </div>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Resend API Status</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational
          </div>
          <div className="text-xs text-zinc-400">
            Roundtrip latency: <strong className="text-zinc-200">{health?.latencyMs || 0} ms</strong>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>API Key Authentication</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-mono font-semibold text-zinc-200">
            {health?.apiKeyMasked || 're_...'}
          </div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Full Access Key Configured
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-semibold">
            <span>Sender Domain Status</span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-base font-mono font-semibold text-zinc-200 truncate">
            {health?.fromEmail || 'onboarding@resend.dev'}
          </div>
          <div className="text-xs text-amber-400 font-medium">
            {health?.isSandbox ? 'Sandbox Mode (resend.dev)' : 'Verified Custom Domain'}
          </div>
        </div>
      </div>

      {/* CLI Tools section */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Pre-Configured Resend CLI
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Your environment already has <code>resend-cli v2.23.0</code> authenticated and ready to run.
            </p>
          </div>
          <a
            href="https://resend.com/docs/cli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            CLI Reference
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cliCommands.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  {item.title}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  {item.desc}
                </span>
              </div>

              <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 font-mono text-xs text-indigo-300 overflow-x-auto">
                <span className="truncate mr-2">{item.command}</span>
                <button
                  type="button"
                  onClick={() => copyCommand(item.command, idx)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverability & Compliance Checklist */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          Production Deliverability Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="font-semibold text-white block">1. Custom Domain DNS</span>
            <p className="text-zinc-400">
              Add your domain in Resend dashboard and configure the required DKIM, SPF, and MX records with your DNS provider.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="font-semibold text-white block">2. DMARC Alignment</span>
            <p className="text-zinc-400">
              Publish a TXT record for <code>_dmarc.yourdomain.com</code> with <code>v=DMARC1; p=quarantine;</code> or <code>p=reject;</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="font-semibold text-white block">3. Suppression Protection</span>
            <p className="text-zinc-400">
              Resend automatically suppresses emails that bounce or trigger spam complaints to safeguard your sender reputation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
