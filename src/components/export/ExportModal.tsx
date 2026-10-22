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
  Printer,
  Info,
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { document: biodata, exportModalOpen, setExportModalOpen } = useBiodata();

  const [format, setFormat] = useState<'vector_print' | 'pdf' | 'docx'>('vector_print');
  const [filename, setFilename] = useState(() => {
    return biodata.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'biodata';
  });
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (format === 'vector_print') {
      window.print();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#d97706', '#0284c7', '#059669'],
        });
      } catch {
        // silent fallback
      }
      setTimeout(() => setExportModalOpen(false), 500);
      return;
    }

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
      description="Download print-ready PDF, crisp vector print, or genuine editable Word document"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Format Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Vector Print Option (Recommended) */}
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setFormat('vector_print')}
              className={`col-span-2 p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                format === 'vector_print'
                  ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Crisp Vector PDF (Browser Print)</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Razor-sharp vector rendering, selectable text, and smallest file size.
                  </p>
                </div>
              </div>
            </button>

            {/* Direct PDF */}
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setFormat('pdf')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                format === 'pdf'
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  format === 'pdf' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Direct PDF File</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Automated 1-click download file</div>
              </div>
            </button>

            {/* Word DOCX */}
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setFormat('docx')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                format === 'docx'
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  format === 'docx' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileDown className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Word Doc (.docx)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Editable native DOCX tables</div>
              </div>
            </button>
          </div>
        </div>

        {/* Browser Vector Print Tip */}
        {format === 'vector_print' && (
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Browser Print Tip for Pixel-Perfect PDF:</p>
              <p className="text-amber-800 text-[11px]">
                In the print dialog, select <strong>Destination</strong>: <em>"Save as PDF"</em> and set <strong>Margins</strong>: <em>"None"</em>.
              </p>
            </div>
          </div>
        )}

        {/* Document Details & Page Count Summary */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="text-slate-600">
            <span className="font-semibold text-slate-800">Total Document Content:</span>{' '}
            1 Main Biodata Page
            {biodata.attachedImages && biodata.attachedImages.length > 0 && (
              <> + {biodata.attachedImages.length} High-Res Photo Attachment{biodata.attachedImages.length > 1 ? 's' : ''}</>
            )}
          </div>
          <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
            {(biodata.attachedImages?.length || 0) + 1} Page{((biodata.attachedImages?.length || 0) + 1) > 1 ? 's' : ''}
          </span>
        </div>

        {/* Filename Input */}
        {format !== 'vector_print' && (
          <Input
            label="File Name"
            value={filename}
            disabled={isExporting}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="biodata"
            helperText={`Will be saved as ${filename.trim() || 'biodata'}.${format}`}
          />
        )}

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
            icon={
              progress === 100 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : format === 'vector_print' ? (
                <Printer className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )
            }
            onClick={handleExport}
          >
            {isExporting
              ? 'Generating...'
              : format === 'vector_print'
              ? 'Print / Save as PDF'
              : `Download .${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
