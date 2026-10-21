import React, { useRef, useState, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { PATTERNS } from '../../assets/patterns';
import { ClassicTraditional } from './templates/ClassicTraditional';
import { ModernMinimal } from './templates/ModernMinimal';
import { ElegantPremium } from './templates/ElegantPremium';
import { FamilyFocused } from './templates/FamilyFocused';
import { Professional } from './templates/Professional';
import { PhotoFocused } from './templates/PhotoFocused';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Printer,
  Download,
} from 'lucide-react';
import { Button } from '../common/Button';

export const LivePreview: React.FC = () => {
  const { document, setExportModalOpen } = useBiodata();
  const { styling } = document;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.85);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Auto-fit calculation
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.clientWidth - 48; // padding
      const a4WidthPx = 794; // approx 210mm in px at 96dpi
      if (parentWidth > 0 && parentWidth < a4WidthPx) {
        setScale(Math.max(0.45, Math.min(1, parentWidth / a4WidthPx)));
      } else if (parentWidth >= a4WidthPx + 100) {
        setScale(0.9);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const patternData = PATTERNS[styling.backgroundPattern] || PATTERNS.none;

  // Render correct template component
  const renderTemplate = () => {
    switch (styling.templateId) {
      case 'modern-minimal':
        return <ModernMinimal document={document} />;
      case 'elegant-premium':
        return <ElegantPremium document={document} />;
      case 'family-focused':
        return <FamilyFocused document={document} />;
      case 'professional':
        return <Professional document={document} />;
      case 'photo-focused':
        return <PhotoFocused document={document} />;
      case 'classic-traditional':
      default:
        return <ClassicTraditional document={document} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col h-full ${
        isFullScreen ? 'fixed inset-0 z-50 bg-slate-900/90 p-4 sm:p-8 backdrop-blur-md' : ''
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="bg-white/90 backdrop-blur border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm mb-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">A4 Preview</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono text-slate-500">{Math.round(scale * 100)}%</span>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScale((prev) => Math.max(0.4, prev - 0.1))}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setScale((prev) => Math.min(1.3, prev + 0.1))}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Preview'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Direct Print or Browser Save to PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <Button
            type="button"
            size="sm"
            variant="primary"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => setExportModalOpen(true)}
            className="shadow-sm shadow-rose-600/20"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Scrollable Document Canvas Wrapper */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-2 sm:p-6 bg-slate-100/70 rounded-2xl border border-slate-200/60 shadow-inner">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shrink-0 mb-12 shadow-2xl transition-all"
        >
          {/* Printable A4 Canvas */}
          <div
            id="printable-biodata"
            className="a4-document-container relative overflow-hidden text-slate-800"
            style={{
              backgroundColor: styling.backgroundColor || '#FFFFFF',
              fontFamily: styling.fontFamilyBody,
            }}
          >
            {/* Background Pattern Layer */}
            {styling.backgroundPattern !== 'none' && (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage: patternData.css,
                  opacity: styling.backgroundOpacity,
                }}
              />
            )}

            {/* User Custom Background Image Layer */}
            {styling.backgroundImageUrl && (
              <div
                className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${styling.backgroundImageUrl})`,
                  opacity: styling.backgroundOpacity,
                }}
              />
            )}

            {/* Active Document Template Container */}
            <div className="relative z-10 w-full min-h-[297mm]">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
