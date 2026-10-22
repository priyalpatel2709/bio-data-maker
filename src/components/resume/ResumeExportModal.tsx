import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { exportResumeToPdf } from './exportResumePdf';
import { exportResumeToDocx } from './exportResumeDocx';
import { generateResumePlainText } from '../../utils/resumeStorage';
import confetti from 'canvas-confetti';
import {
  X,
  FileDown,
  FileType,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const ResumeExportModal: React.FC = () => {
  const { document, exportModalOpen, setExportModalOpen } = useResume();
  const [format, setFormat] = useState<'pdf' | 'docx' | 'ats_txt' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [filename, setFilename] = useState(() => {
    const safeName = (document.contact.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    return `${safeName}_Resume`;
  });
  const [copiedTxt, setCopiedTxt] = useState(false);

  if (!exportModalOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(5);
    setStatusMessage('Preparing export file...');

    try {
      if (format === 'pdf') {
        await exportResumeToPdf('resume-preview-document', {
          filename: `${filename}.pdf`,
          paperSize: document.styling.paperSize,
          onProgress: (p, msg) => {
            setProgress(p);
            setStatusMessage(msg);
          },
        });
      } else if (format === 'docx') {
        await exportResumeToDocx(document, `${filename}.docx`, (p, msg) => {
          setProgress(p);
          setStatusMessage(msg);
        });
      } else if (format === 'ats_txt') {
        const text = generateResumePlainText(document);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `${filename}_ATS.txt`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'json') {
        const jsonStr = JSON.stringify(document, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }

      setProgress(100);
      setStatusMessage('Export completed!');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // silent fallback
      }

      setTimeout(() => {
        setIsExporting(false);
        setExportModalOpen(false);
      }, 900);
    } catch (err: any) {
      console.error('Export failed:', err);
      setStatusMessage('Export error: ' + (err?.message || 'Unknown error'));
      setIsExporting(false);
    }
  };

  const handleCopyAts = () => {
    const text = generateResumePlainText(document);
    navigator.clipboard.writeText(text);
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Your Resume</h3>
              <p className="text-xs text-slate-500">Select standard format for job applications</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Format Picker */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">Select Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              {/* PDF */}
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  format === 'pdf'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Vector PDF
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">PDF Document</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">High-res print & human recruiter review</p>
                </div>
              </button>

              {/* Word Docx */}
              <button
                type="button"
                onClick={() => setFormat('docx')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  format === 'docx'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FileType className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    .docx
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Microsoft Word</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">100% editable native Word document</p>
                </div>
              </button>

              {/* ATS Plain Text */}
              <button
                type="button"
                onClick={() => setFormat('ats_txt')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  format === 'ats_txt'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    ATS Safe
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Plain Text (.txt)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">For pasting into portal text areas</p>
                </div>
              </button>

              {/* JSON Backup */}
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  format === 'json'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Backup
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">JSON Data</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Backup data or transfer to another device</p>
                </div>
              </button>
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">File Name</label>
            <div className="flex items-center">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l-lg border border-slate-300 focus:outline-teal-600 text-xs font-medium"
              />
              <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 text-slate-600 rounded-r-lg font-mono text-xs">
                .{format === 'ats_txt' ? 'txt' : format}
              </span>
            </div>
          </div>

          {/* ATS Copy Shortcut */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800">Quick Copy Plain Text</span>
                <p className="text-[10px] text-slate-500">Copy to clipboard without downloading</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyAts}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              {copiedTxt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTxt ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

          {/* Progress / Status Bar */}
          {isExporting && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>{statusMessage}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setExportModalOpen(false)}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
