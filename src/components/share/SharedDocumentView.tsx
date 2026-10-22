import React, { useState, useEffect } from 'react';
import { resolveSharedDocument, SharedDocumentResult } from '../../services/shareService';
import { ResumeDocument } from '../../types/resume';
import { BiodataDocument } from '../../types/biodata';
import { ResumeTemplateRenderer } from '../resume/ResumeTemplateRenderer';

// Biodata Templates
import { MandalaRadiance } from '../preview/templates/MandalaRadiance';
import { MarigoldToran } from '../preview/templates/MarigoldToran';
import { VintageParchment } from '../preview/templates/VintageParchment';
import { ClassicTraditional } from '../preview/templates/ClassicTraditional';
import { SimpleBox } from '../preview/templates/SimpleBox';
import { FloralBorder } from '../preview/templates/FloralBorder';
import { InstantRoyalMaroon } from '../preview/templates/InstantRoyalMaroon';
import { InstantPeacockNavy } from '../preview/templates/InstantPeacockNavy';
import { InstantFloralBlush } from '../preview/templates/InstantFloralBlush';
import { ModernMinimal } from '../preview/templates/ModernMinimal';
import { ElegantPremium } from '../preview/templates/ElegantPremium';
import { FamilyFocused } from '../preview/templates/FamilyFocused';
import { Professional } from '../preview/templates/Professional';
import { PhotoFocused } from '../preview/templates/PhotoFocused';

import {
  Printer,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Loader2,
  FileText,
  AlertCircle,
  Briefcase,
  Heart,
} from 'lucide-react';

export const SharedDocumentView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [docResult, setDocResult] = useState<SharedDocumentResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    resolveSharedDocument()
      .then((res) => {
        if (isMounted) {
          setDocResult(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error resolving shared document:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    window.location.hash = '';
    window.location.search = '';
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-semibold text-slate-700">Loading shared document...</p>
      </div>
    );
  }

  if (!docResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Document Not Found</h2>
          <p className="text-xs text-slate-500">
            This share link may have expired or is incomplete. Please check the URL with the sender.
          </p>
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Go to BiodataMaker & ResumeBuilder
          </button>
        </div>
      </div>
    );
  }

  const { type, data } = docResult;

  // Render biodata template
  const renderBiodata = (biodata: BiodataDocument) => {
    switch (biodata.styling.templateId) {
      case 'mandala-radiance':
        return <MandalaRadiance document={biodata} />;
      case 'marigold-toran':
        return <MarigoldToran document={biodata} />;
      case 'vintage-parchment':
        return <VintageParchment document={biodata} />;
      case 'instant-royal-maroon':
        return <InstantRoyalMaroon document={biodata} />;
      case 'instant-peacock-navy':
        return <InstantPeacockNavy document={biodata} />;
      case 'instant-floral-blush':
        return <InstantFloralBlush document={biodata} />;
      case 'simple-box':
        return <SimpleBox document={biodata} />;
      case 'floral-border':
        return <FloralBorder document={biodata} />;
      case 'modern-minimal':
        return <ModernMinimal document={biodata} />;
      case 'elegant-premium':
        return <ElegantPremium document={biodata} />;
      case 'family-focused':
        return <FamilyFocused document={biodata} />;
      case 'photo-focused':
        return <PhotoFocused document={biodata} />;
      default:
        return <Professional document={biodata} />;
    }
  };

  const getBiodataName = (doc: BiodataDocument): string => {
    if (doc.sections) {
      for (const s of doc.sections) {
        for (const f of s.fields) {
          if (f.label.toLowerCase().includes('name') && f.value?.trim()) {
            return f.value.trim();
          }
        }
      }
    }
    return doc.title || 'Biodata';
  };

  const displayName =
    type === 'resume'
      ? (data as ResumeDocument).contact.fullName || 'Professional'
      : getBiodataName(data as BiodataDocument);

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      {/* Top Read-Only Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 h-14 flex items-center justify-between no-print">
        {/* Left: Document info */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold shadow-xs ${
              type === 'biodata' ? 'bg-rose-600' : 'bg-teal-700'
            }`}
          >
            {type === 'biodata' ? <Heart className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {displayName}
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              Read-Only {type === 'biodata' ? 'Matrimonial Biodata' : 'Professional Resume'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleGoHome}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build Your Own</span>
          </button>
        </div>
      </header>

      {/* Main Document Canvas Viewport */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:overflow-visible">
        {type === 'resume' ? (
          <div className="preview-scale-wrapper w-full max-w-[794px] print:max-w-none">
            <ResumeTemplateRenderer resume={data as ResumeDocument} />
          </div>
        ) : (
          <div
            id="printable-biodata"
            className="preview-scale-wrapper w-full max-w-[794px] print:max-w-none bg-white shadow-sm rounded overflow-hidden"
          >
            {renderBiodata(data as BiodataDocument)}
          </div>
        )}
      </main>
    </div>
  );
};
