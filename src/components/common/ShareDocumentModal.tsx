import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BiodataDocument } from '../../types/biodata';
import { ResumeDocument } from '../../types/resume';
import { createShareableLink } from '../../services/shareService';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Loader2,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'biodata' | 'resume';
  document: BiodataDocument | ResumeDocument;
}

export const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  onClose,
  type,
  document,
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isCloud, setIsCloud] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const hasGeneratedRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      hasGeneratedRef.current = null;
      return;
    }

    // Only generate once per modal open for this document ID
    if (hasGeneratedRef.current === document.id && shareUrl) {
      return;
    }

    hasGeneratedRef.current = document.id;
    let mounted = true;
    setLoading(true);

    createShareableLink(type, document)
      .then((res) => {
        if (mounted) {
          setShareUrl(res.url);
          setIsCloud(res.isCloud);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate share link:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, type, document.id]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNewTab = () => {
    if (!shareUrl) return;
    window.open(shareUrl, '_blank');
  };

  const handleWhatsAppShare = () => {
    if (!shareUrl) return;
    const title = document.title || (type === 'biodata' ? 'Matrimonial Biodata' : 'Professional Resume');
    const msg = encodeURIComponent(
      `Hello! Please view my ${type === 'biodata' ? 'Matrimonial Biodata' : 'Resume'} (${title}):\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  // Safe QR code image generator URL via standard quickchart api (or fallback)
  const qrCodeImgUrl = `https://quickchart.io/qr?text=${encodeURIComponent(shareUrl)}&size=200&margin=1`;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs ${
                type === 'biodata' ? 'bg-rose-600' : 'bg-teal-700'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Share Read-Only {type === 'biodata' ? 'Biodata' : 'Resume'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Recipients view a clean, distraction-free document with instant PDF download.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <span>Generating read-only link...</span>
            </div>
          ) : (
            <>
              {/* Cloud or Zero-Config Badge */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Public Shareable Link</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                    isCloud
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}
                >
                  {isCloud ? 'Cloud Synced' : 'Zero-Config Direct'}
                </span>
              </div>

              {/* Link Input & Copy */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Open in tab */}
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 flex flex-col items-center gap-1 transition text-center"
                >
                  <ExternalLink className="w-4 h-4 text-teal-700" />
                  <span className="text-[11px] font-semibold">Open Preview</span>
                </button>

                {/* WhatsApp Share */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 flex flex-col items-center gap-1 transition text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-semibold">WhatsApp</span>
                </button>

                {/* QR Code Toggle */}
                <button
                  type="button"
                  onClick={() => setShowQr((prev) => !prev)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition text-center ${
                    showQr
                      ? 'border-teal-500 bg-teal-50 text-teal-800'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span className="text-[11px] font-semibold">QR Code</span>
                </button>
              </div>

              {/* QR Code View */}
              {showQr && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center gap-2 animate-in fade-in">
                  <img
                    src={qrCodeImgUrl}
                    alt="Document QR Code"
                    className="w-36 h-36 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500 text-center">
                    Scan with smartphone camera to view this {type} instantly.
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p>
                  Anyone with this link can view the document and download it as PDF. They cannot edit your original document.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, window.document.body);
};
