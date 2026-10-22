import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeTemplateRenderer } from './ResumeTemplateRenderer';
import { generateResumePlainText } from '../../utils/resumeStorage';
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
} from 'lucide-react';

export const ResumeLivePreview: React.FC = () => {
  const { document, previewZoom, setPreviewZoom, setExportModalOpen } = useResume();
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [fitScale, setFitScale] = useState(0.85);

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

  // ATS score calculation
  const atsScore = useMemo(() => {
    let score = 0;
    const checks: { label: string; passed: boolean }[] = [];

    const hasName = !!document.contact.fullName?.trim();
    checks.push({ label: 'Full Name', passed: hasName });
    if (hasName) score += 15;

    const hasEmail = !!document.contact.email?.trim();
    const hasPhone = !!document.contact.phone?.trim();
    checks.push({ label: 'Email & Phone', passed: hasEmail && hasPhone });
    if (hasEmail) score += 10;
    if (hasPhone) score += 10;

    const hasTitle = !!document.contact.jobTitle?.trim();
    checks.push({ label: 'Target Job Title', passed: hasTitle });
    if (hasTitle) score += 10;

    const hasSummary = document.summary?.trim().length > 40;
    checks.push({ label: 'Summary Statement', passed: hasSummary });
    if (hasSummary) score += 15;

    const hasExp = document.experience.length > 0 && document.experience.some((e) => e.bullets.length > 0);
    checks.push({ label: 'Experience with Bullets', passed: hasExp });
    if (hasExp) score += 20;

    const hasSkills = document.skillCategories.some((sc) => sc.skills.length > 0);
    checks.push({ label: 'Technical / Core Skills', passed: hasSkills });
    if (hasSkills) score += 10;

    const hasEdu = document.education.length > 0;
    checks.push({ label: 'Education Credential', passed: hasEdu });
    if (hasEdu) score += 10;

    return { score, checks };
  }, [document]);

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
          {/* ATS Score */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              atsScore.score >= 80
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : atsScore.score >= 50
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
            title={`ATS Readiness: ${atsScore.score}%`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ATS Score: {atsScore.score}%</span>
          </div>

          {/* Page Count Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition ${
              totalPages === 1
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                : 'bg-amber-50 text-amber-800 border-amber-200/80'
            }`}
            title={
              totalPages === 1
                ? 'Optimal 1-Page Resume: Highest recruiter preference for most applicants.'
                : '2-Page Resume: Recruiter tip — adjust spacing or bullets to fit 1 page if needed.'
            }
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {totalPages === 1 ? '1 Page A4' : `${totalPages} Pages A4 (Multi-Page)`}
            </span>
            {totalPages === 1 ? (
              <span className="text-[10px] text-emerald-600 font-semibold">(Perfect Fit)</span>
            ) : (
              <span className="text-[10px] text-amber-600 font-semibold">(2nd Page Ready)</span>
            )}
          </div>

          <span className="hidden xl:inline-block text-[11px] text-slate-500 font-medium">
            Standard: {isLetter ? 'US Letter (215.9 × 279.4 mm)' : 'A4 (210 × 297 mm)'}
          </span>
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

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition hidden sm:flex"
            title="Print preview"
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
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.12s ease-out',
            width: `${pageWidthPx}px`,
          }}
          className="shrink-0 mb-16 relative"
        >
          {/* Document Renderer (renders Page 1 and Page 2 as discrete A4 sheets) */}
          <ResumeTemplateRenderer resume={document} />

          {/* Bottom Summary Footer */}
          <div className="preview-page-footer pt-6 text-center text-xs text-slate-500 font-medium select-none">
            {totalPages === 1 ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fits cleanly on 1 standard {isLetter ? 'US Letter' : 'A4'} page
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80 shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Paginated across {totalPages} distinct A4 pages with matched margins & headers
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
