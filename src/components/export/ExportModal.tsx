import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useBiodata } from '../../context/BiodataContext';
import { exportBiodataToPdf } from './exportPdf';
import { exportBiodataToDocx } from './exportDocx';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  FileDown,
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { document: biodata, exportModalOpen, setExportModalOpen } = useBiodata();

  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [filename, setFilename] = useState(() => {
    return biodata.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'biodata';
  });
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(5);
    setStatusMessage('Starting export...');
    setError(null);

    const safeFilename = filename.trim() || 'biodata';

    try {
      if (format === 'pdf') {
        await exportBiodataToPdf('printable-biodata', {
          filename: safeFilename,
          onProgress: (p, msg) => {
            setProgress(p);
            setStatusMessage(msg);
          },
        });
      } else {
        await exportBiodataToDocx(biodata, safeFilename, (p, msg) => {
          setProgress(p);
          setStatusMessage(msg);
        });
      }

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#d97706', '#0284c7', '#059669'],
      });

      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
        setStatusMessage('');
        setExportModalOpen(false);
      }, 1200);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err?.message || 'Failed to export document. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={exportModalOpen}
      onClose={() => !isExporting && setExportModalOpen(false)}
      title="Export Biodata Document"
      description="Download print-ready PDF or genuine editable Word document"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Format Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setFormat('pdf')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                format === 'pdf'
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  format === 'pdf' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">PDF Document</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  High-res 300 DPI, vector fonts, ideal for sharing & printing
                </div>
              </div>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={() => setFormat('docx')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                format === 'docx'
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  format === 'docx' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Word Document (.docx)</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Genuine editable DOCX with tables, styles & photo
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Filename Input */}
        <Input
          label="File Name"
          value={filename}
          disabled={isExporting}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="biodata"
          helperText={`Will be saved as ${filename.trim() || 'biodata'}.${format}`}
        />

        {/* Progress or Error bar */}
        {isExporting && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{statusMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={isExporting}
            onClick={() => setExportModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={isExporting}
            icon={progress === 100 ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            {isExporting ? 'Generating...' : `Download .${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
