'use client';

import React from 'react';
import { Mail, Zap, ExternalLink, Activity, Terminal } from 'lucide-react';

interface NavbarProps {
  health: {
    status: string;
    connected: boolean;
    latencyMs: number;
    fromEmail: string;
    isSandbox: boolean;
  } | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, activeTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-zinc-400 p-[1px] shadow-lg shadow-white/5 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Resend</span>
              <span className="text-zinc-600 font-mono text-xs">/</span>
              <span className="font-medium text-xs text-zinc-300">Next.js Integration</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                v16 App Router
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
          {[
            { id: 'composer', label: 'Send Email' },
            { id: 'preview', label: 'Template Preview' },
            { id: 'logs', label: 'Activity Logs' },
            { id: 'webhooks', label: 'Webhooks' },
            { id: 'settings', label: 'Diagnostics & CLI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white shadow-sm shadow-black/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Health status & Links */}
        <div className="flex items-center gap-3">
          {health ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-300 font-medium">Operational</span>
              <span className="text-zinc-500">({health.latencyMs}ms)</span>
              {health.isSandbox && (
                <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 text-[10px] font-medium rounded border border-amber-500/20">
                  Sandbox
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              <Activity className="w-3 h-3 animate-spin text-zinc-500" />
              <span>Connecting...</span>
            </div>
          )}

          <a
            href="https://resend.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            Docs
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 border-t border-zinc-800/60 overflow-x-auto scrollbar-none">
        {[
          { id: 'composer', label: 'Send Email' },
          { id: 'preview', label: 'Preview' },
          { id: 'logs', label: 'Logs' },
          { id: 'webhooks', label: 'Webhooks' },
          { id: 'settings', label: 'Diagnostics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
