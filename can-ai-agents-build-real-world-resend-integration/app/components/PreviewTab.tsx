'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  Code2,
  FileText,
  Eye,
  Copy,
  Check,
  RefreshCw,
  Send,
  Loader2
} from 'lucide-react';
import { TEMPLATES } from '@/emails';
import { TemplateId } from '@/lib/types';

interface PreviewTabProps {
  initialTemplate?: TemplateId;
  initialProps?: Record<string, any>;
  onSelectToSend: (templateId: TemplateId, props: Record<string, any>) => void;
  addToast: (toast: { type: 'success' | 'error' | 'info'; title: string; message?: string }) => void;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
  initialTemplate = 'welcome',
  initialProps,
  onSelectToSend,
  addToast,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(initialTemplate);
  const [templateProps, setTemplateProps] = useState<Record<string, any>>(
    initialProps || TEMPLATES[initialTemplate].defaultProps
  );
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'html' | 'text'>('visual');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync when initialTemplate changes
  useEffect(() => {
    if (initialTemplate) {
      setSelectedTemplate(initialTemplate);
      setTemplateProps(initialProps || TEMPLATES[initialTemplate].defaultProps);
    }
  }, [initialTemplate, initialProps]);

  // Fetch rendered HTML from API
  const fetchPreview = async (tmplId: TemplateId, props: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: tmplId, props }),
      });
      const data = await res.json();
      if (data.success) {
        setHtmlContent(data.html);
        setTextContent(data.text || '');
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Preview error';
      addToast({ type: 'error', title: 'Preview Error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview(selectedTemplate, templateProps);
  }, [selectedTemplate]);

  const handleTemplateChange = (id: TemplateId) => {
    setSelectedTemplate(id);
    setTemplateProps({ ...TEMPLATES[id].defaultProps });
  };

  const handleCopyCode = () => {
    const textToCopy = viewMode === 'text' ? textContent : htmlContent;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Copied to clipboard',
      message: `${viewMode.toUpperCase()} markup copied.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm shadow-lg">
        {/* Template Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Template:
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs font-medium focus:border-indigo-500 focus:outline-none"
          >
            {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
              <option key={id} value={id}>
                {TEMPLATES[id].name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => fetchPreview(selectedTemplate, templateProps)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Viewport switch & View Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Desktop / Mobile Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewport === 'desktop'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop (600px)
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewport === 'mobile'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile (375px)
            </button>
          </div>

          {/* Mode Toggle: Visual / HTML / Text */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'visual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visual
            </button>
            <button
              type="button"
              onClick={() => setViewMode('html')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'html'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              HTML Source
            </button>
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'text'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Plain Text
            </button>
          </div>

          {/* Action to send */}
          <button
            type="button"
            onClick={() => onSelectToSend(selectedTemplate, templateProps)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Send This
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative min-h-[600px] flex justify-center items-start bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-6 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-zinc-300 text-xs font-medium shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              Rendering template with React Email...
            </div>
          </div>
        )}

        {/* Visual Mode View */}
        {viewMode === 'visual' && (
          <div
            className={`transition-all duration-300 mx-auto shadow-2xl rounded-xl overflow-hidden border border-zinc-700/60 bg-white ${
              viewport === 'desktop' ? 'w-full max-w-[620px]' : 'w-[375px]'
            }`}
          >
            {/* Window bar */}
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="font-mono text-[11px] truncate max-w-[200px]">
                {TEMPLATES[selectedTemplate].defaultSubject}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase">{viewport}</span>
            </div>

            {/* Iframe */}
            <iframe
              srcDoc={htmlContent}
              title="Email Preview"
              className="w-full min-h-[620px] border-none bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        )}

        {/* HTML Source View */}
        {viewMode === 'html' && (
          <div className="w-full max-w-4xl bg-zinc-900 rounded-xl border border-zinc-800 p-4 relative font-mono text-xs text-zinc-300">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-zinc-500 text-[11px]">Rendered HTML Output</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy HTML
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-2 text-zinc-300 max-h-[550px] whitespace-pre-wrap scrollbar-thin">
              {htmlContent}
            </pre>
          </div>
        )}

        {/* Plain Text View */}
        {viewMode === 'text' && (
          <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 p-6 relative font-mono text-xs text-zinc-300">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-zinc-500 text-[11px]">Plain-Text Fallback</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Text
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 bg-zinc-950 rounded-lg text-zinc-200 max-h-[550px] whitespace-pre-wrap leading-relaxed">
              {textContent || 'No plain text rendered.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
