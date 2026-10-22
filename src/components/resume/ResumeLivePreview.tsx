import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeTemplateRenderer } from './ResumeTemplateRenderer';
import { generateResumePlainText } from '../../utils/resumeStorage';
import { usePageMetrics } from '../../utils/pageMetrics';
import { auditResume } from '../../utils/atsAuditor';
import { ATSAuditorModal } from './ATSAuditorModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const ResumeLivePreview: React.FC = () => {
  const { document, previewZoom, setPreviewZoom, setExportModalOpen } = useResume();
  const containerRef = useRef<HTMLDivElement>(null);
  const documentWrapperRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [fitScale, setFitScale] = useState(0.85);
  const [showPageGuides, setShowPageGuides] = useState(true);
  const [isAuditorOpen, setIsAuditorOpen] = useState(false);

  const isLetter = document.styling.paperSize === 'letter';
  const pageWidthPx = isLetter ? 816 : 794;

  const isSinglePage = document.styling.pageSplitAt === 'single-page';
  const hasPage2 =
    !isSinglePage &&
    (document.projects.length > 0 ||
      document.education.length > 0 ||
      document.certifications.length > 0 ||
      document.customSections.length > 0);
  const totalPages = hasPage2 ? 2 : 1;

  // Real-time page boundary measurements
  const metrics = usePageMetrics(documentWrapperRef, document.styling.paperSize);

  // Auto-fit calculation
  useEffect(() => {
    const calculateFit = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.clientWidth - 48;
      if (parentWidth > 0) {
        const calculated = Math.min(1.0, Math.max(0.4, (parentWidth - 32) / pageWidthPx));
        setFitScale(calculated);
      }
    };

    calculateFit();
    window.addEventListener('resize', calculateFit);
    return () => window.removeEventListener('resize', calculateFit);
  }, [pageWidthPx]);

  // Comprehensive rule-based ATS audit
  const atsReport = useMemo(() => auditResume(document), [document]);

  const handleCopyPlainText = () => {
    const text = generateResumePlainText(document);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Zoom scale multiplier
  const scale = previewZoom === 'fit' ? fitScale : typeof previewZoom === 'number' ? previewZoom : 0.85;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-200/80 overflow-hidden relative">
      {/* Top Controls Toolbar */}
      <div className="h-13 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-2 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left Side: ATS Score & A4 Page Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Clickable ATS Score Badge -> opens detailed Auditor */}
          <button
            type="button"
            onClick={() => setIsAuditorOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition hover:shadow-xs active:scale-95 cursor-pointer ${
              atsReport.overallScore >= 80
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : atsReport.overallScore >= 60
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
            title="Click to view detailed Rule-Based ATS Audit & Action Verbs breakdown"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>ATS Score: {atsReport.overallScore}%</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 bg-white/80 rounded-md">
              {atsReport.grade}
            </span>
          </button>

          {/* Page Fit Badge */}
          {totalPages === 1 ? (
            metrics.isOverflowing ? (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse"
                title={`Page 1 is overflowing by ~${metrics.estimatedLinesOver} lines (${metrics.overflowPx}px). Upon export this will spill onto page 2.`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Spills into Page 2 (+{metrics.estimatedLinesOver} lines)</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                title={`Perfect 1-Page fit (${metrics.fillPercentage}% filled). Highest recruiter preference.`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1 Page {isLetter ? 'Letter' : 'A4'} ({metrics.fillPercentage}% full)</span>
              </div>
            )
          ) : (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200"
              title="2-Page Resume: Split across two distinct pages with matched headers & margins."
            >
              <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>2 Pages {isLetter ? 'Letter' : 'A4'}</span>
            </div>
          )}

          {/* Page Guides Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPageGuides((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
              showPageGuides
                ? 'bg-teal-50 text-teal-800 border-teal-300'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle visual page boundary lines & overflow indicators"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Page Guide</span>
          </button>
        </div>

        {/* Right Preview Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-slate-600">
            <button
              onClick={() => setPreviewZoom(typeof previewZoom === 'number' ? Math.max(0.4, previewZoom - 0.1) : Math.max(0.4, fitScale - 0.1))}
              className="p-1 hover:text-slate-900 hover:bg-white rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setPreviewZoom(typeof previewZoom === 'number' ? Math.min(1.4, previewZoom + 0.1) : Math.min(1.4, fitScale + 0.1))}
              className="p-1 hover:text-slate-900 hover:bg-white rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewZoom(previewZoom === 'fit' ? 1.0 : 'fit')}
              className={`p-1 rounded transition text-[11px] font-semibold px-2 ${
                previewZoom === 'fit' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="Fit to Screen"
            >
              Fit
            </button>
          </div>

          {/* Copy ATS Text */}
          <button
            onClick={handleCopyPlainText}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Copy plain ATS text to clipboard"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedText ? 'Copied ATS Text' : 'Copy ATS'}</span>
          </button>

          {/* Vector Print button */}
          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition hidden sm:flex"
            title="Crisp Native Vector Print (window.print)"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Export Button */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Resume</span>
          </button>
        </div>
      </div>

      {/* Main Preview Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center justify-start print:p-0 print:overflow-visible"
      >
        {/* Scale Wrapper */}
        <div
          ref={documentWrapperRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.12s ease-out',
            width: `${pageWidthPx}px`,
          }}
          className="preview-scale-wrapper shrink-0 mb-16 relative"
        >
          {/* Document Renderer */}
          <ResumeTemplateRenderer resume={document} />

          {/* Visual Page Break Guide Overlay (Only when enabled and in single-page mode) */}
          {showPageGuides && totalPages === 1 && (
            <div
              className="page-break-guide-line no-print pointer-events-none absolute left-0 right-0 z-30"
              style={{
                top: `${metrics.nominalPageHeightPx}px`,
              }}
            >
              {/* Boundary dashed line */}
              <div className="relative border-b-2 border-dashed border-rose-500/80 w-full flex items-center justify-center">
                <span className="absolute -top-3.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  {isLetter ? 'US Letter' : 'A4'} Page 1 End ({metrics.nominalPageHeightPx}px)
                </span>
              </div>

              {/* Overflow warning banner if content exceeds nominal height */}
              {metrics.isOverflowing && (
                <div
                  className="bg-rose-500/10 border-l-4 border-rose-500 mt-2 mx-2 p-3 rounded text-rose-900 text-xs font-medium space-y-1 backdrop-blur-2xs shadow-xs"
                  style={{
                    minHeight: `${Math.max(40, metrics.overflowPx)}px`,
                  }}
                >
                  <div className="flex items-center gap-2 font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Content overflow detected: ~{metrics.estimatedLinesOver} lines ({metrics.overflowPx}px) past Page 1.
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    Recruiter tip: To fit cleanly onto 1 page, switch to "Compact" margins in Styling, or trim 1-2 bullet points.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom Summary Footer */}
          <div className="preview-page-footer pt-6 text-center text-xs text-slate-500 font-medium select-none no-print">
            {totalPages === 1 ? (
              metrics.isOverflowing ? (
                <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Overflowing Page 1 by ~{metrics.estimatedLinesOver} lines (spills onto Page 2)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Fits cleanly on 1 standard {isLetter ? 'US Letter' : 'A4'} page ({metrics.fillPercentage}% full)
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80 shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Paginated across {totalPages} distinct {isLetter ? 'US Letter' : 'A4'} pages with matched margins & headers
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ATS Rule-Based Auditor Modal */}
      <ATSAuditorModal
        isOpen={isAuditorOpen}
        onClose={() => setIsAuditorOpen(false)}
        resume={document}
      />
    </div>
  );
};
