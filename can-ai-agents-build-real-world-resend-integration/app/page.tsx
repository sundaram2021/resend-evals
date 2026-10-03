'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ComposerTab } from './components/ComposerTab';
import { PreviewTab } from './components/PreviewTab';
import { LogsTab } from './components/LogsTab';
import { WebhooksTab } from './components/WebhooksTab';
import { SettingsTab } from './components/SettingsTab';
import { ToastContainer, ToastMessage } from './components/Toast';
import { TemplateId } from '@/lib/types';
import { TEMPLATES } from '@/emails';
import { Sparkles, Terminal, Mail, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('composer');
  const [health, setHealth] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Preview tab state
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId>('welcome');
  const [previewProps, setPreviewProps] = useState<Record<string, any>>({
    ...TEMPLATES.welcome.defaultProps,
  });

  const addToast = (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch health data on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        console.error('Health check failed:', err);
      }
    };
    checkHealth();
  }, []);

  // Callback when user clicks "Live Preview" in the composer
  const handlePreviewFromComposer = (tmplId: TemplateId, props: Record<string, any>) => {
    setPreviewTemplate(tmplId);
    setPreviewProps(props);
    setActiveTab('preview');
  };

  // Callback when user clicks "Send this" in preview
  const handleSelectToSendFromPreview = (tmplId: TemplateId, props: Record<string, any>) => {
    setPreviewTemplate(tmplId);
    setPreviewProps(props);
    setActiveTab('composer');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-900/20 via-blue-900/10 to-transparent blur-3xl opacity-60"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-900/10 blur-3xl rounded-full opacity-40"></div>
      </div>

      {/* Top Navbar */}
      <Navbar
        health={health}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Resend Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Production Email Engine
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Next.js 16 App Router integration with Resend Node SDK, React Email templates, Svix webhook verification, and CLI tooling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('composer')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'composer'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Send Email
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              CLI & Setup
            </button>
          </div>
        </div>

        {/* Dynamic Tab Contents */}
        {activeTab === 'composer' && (
          <ComposerTab
            onEmailSent={(email) => {
              // Switch to logs or update
            }}
            onPreviewTemplate={handlePreviewFromComposer}
            addToast={addToast}
            defaultSenderEmail={health?.fromEmail || 'onboarding@resend.dev'}
          />
        )}

        {activeTab === 'preview' && (
          <PreviewTab
            initialTemplate={previewTemplate}
            initialProps={previewProps}
            onSelectToSend={handleSelectToSendFromPreview}
            addToast={addToast}
          />
        )}

        {activeTab === 'logs' && <LogsTab addToast={addToast} />}

        {activeTab === 'webhooks' && <WebhooksTab addToast={addToast} />}

        {activeTab === 'settings' && (
          <SettingsTab health={health} addToast={addToast} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 py-6 mt-16 bg-zinc-950/60 backdrop-blur-sm text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Resend SDK v6.32.0 • React Email • Next.js 16</span>
          </div>
          <div>
            Built with modern web standards, strict error handling, and deliverability best practices.
          </div>
        </div>
      </footer>

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
