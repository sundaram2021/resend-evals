'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  AlertOctagon,
  AlertTriangle,
  Send,
  Eye,
  X,
  Copy,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ResendEmailItem } from '@/lib/types';

interface LogsTabProps {
  addToast: (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => void;
}

export const LogsTab: React.FC<LogsTabProps> = ({ addToast }) => {
  const [emails, setEmails] = useState<ResendEmailItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [inspectLoading, setInspectLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emails');
      const data = await res.json();
      if (data.success) {
        setEmails(data.data || []);
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch logs';
      addToast({ type: 'error', title: 'Logs Error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleInspect = async (emailId: string) => {
    setInspectLoading(true);
    try {
      const res = await fetch(`/api/emails?id=${emailId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedEmail(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load details';
      addToast({ type: 'error', title: 'Inspection Error', message: msg });
    } finally {
      setInspectLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Filter emails
  const filteredEmails = emails.filter((item) => {
    const matchesStatus =
      filterStatus === 'all' || item.last_event === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.to.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Send className="w-3 h-3" />
            Sent
          </span>
        );
      case 'bounced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertOctagon className="w-3 h-3" />
            Bounced
          </span>
        );
      case 'complained':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Complained
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
            <Clock className="w-3 h-3" />
            {status || 'Queued'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-400" />
            Sent Email Activity Logs
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time delivery status, tracking events, and metadata retrieved directly from the Resend API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchEmails}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'sent', label: 'Sent' },
            { id: 'bounced', label: 'Bounced' },
            { id: 'complained', label: 'Complained' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === st.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, recipient, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-indigo-500 focus:outline-none text-white text-xs"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Message ID</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading && emails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Fetching email records from Resend...
                  </td>
                </tr>
              ) : filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No emails match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEmails.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                    onClick={() => handleInspect(item.id)}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.last_event)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                      {item.to.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px] truncate max-w-[150px]">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspect(item.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Email Inspection</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  ID: {selectedEmail.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block">Status</span>
                  <span className="font-semibold text-white mt-1 block">
                    {getStatusBadge(selectedEmail.last_event)}
                  </span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block">Recipient</span>
                  <span className="font-mono text-zinc-200 mt-1 block">
                    {Array.isArray(selectedEmail.to)
                      ? selectedEmail.to.join(', ')
                      : selectedEmail.to}
                  </span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block">Sender (From)</span>
                  <span className="font-mono text-zinc-200 mt-1 block">
                    {selectedEmail.from}
                  </span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block">Created At</span>
                  <span className="text-zinc-200 mt-1 block">
                    {new Date(selectedEmail.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Full API Response Payload
                </label>
                <div className="relative">
                  <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60 scrollbar-thin">
                    {JSON.stringify(selectedEmail, null, 2)}
                  </pre>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(JSON.stringify(selectedEmail, null, 2), 'payload')
                    }
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1"
                  >
                    {copied === 'payload' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
              <a
                href={`https://resend.com/emails/${selectedEmail.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View in Resend Dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
