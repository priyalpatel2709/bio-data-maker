import React, { useRef } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Button } from '../common/Button';
import {
  ImagePlus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  FileImage,
  ShieldCheck,
} from 'lucide-react';

export const AttachedImagesManager: React.FC = () => {
  const {
    document,
    addAttachedImage,
    updateAttachedImage,
    deleteAttachedImage,
    reorderAttachedImages,
  } = useBiodata();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachedImages = document.attachedImages || [];

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not a supported image.`);
        return;
      }

      // Read high-resolution image data without lossy compression
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Derive default caption from filename if clean
          const defaultCaption = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

          addAttachedImage({
            url: reader.result,
            caption: defaultCaption,
            filename: file.name,
            sizeBytes: file.size,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= attachedImages.length) return;

    const updated = [...attachedImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    reorderAttachedImages(updated);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileImage className="w-4 h-4 text-rose-600" />
            Attached Photos & Document Pages ({attachedImages.length})
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Add full-length portraits, family pictures, or horoscope/kundali charts to the end of your PDF & Word document.
          </p>
        </div>

        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={<ImagePlus className="w-4 h-4" />}
            onClick={() => fileInputRef.current?.click()}
            className="shadow-sm shadow-rose-600/20"
          >
            Attach Images
          </Button>
        </div>
      </div>

      {/* Quality Guarantee Notice */}
      <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>High-Fidelity Quality:</strong> Images are appended at original resolution without downscaling, preserving crystal-clear clarity in exported PDFs and DOCX files.
        </span>
      </div>

      {/* Attached Images List */}
      {attachedImages.length > 0 ? (
        <div className="space-y-3 pt-1">
          {attachedImages.map((img, index) => {
            const sizeKb = img.sizeBytes ? Math.round(img.sizeBytes / 1024) : null;

            return (
              <div
                key={img.id}
                className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 group hover:border-slate-300 transition-all"
              >
                {/* Thumbnail Preview */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200/90 shadow-xs flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={img.caption || 'Attached photo'}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Caption Input & Metadata */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Page {index + 2} Attachment
                    </span>
                    {sizeKb && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => updateAttachedImage(img.id, { caption: e.target.value })}
                    placeholder="Enter image caption (e.g. Full Length Photo, Family Photo, Kundali)"
                    className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  {img.filename && (
                    <p className="text-[10px] text-slate-400 truncate">{img.filename}</p>
                  )}
                </div>

                {/* Move & Delete Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg transition-colors"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === attachedImages.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg transition-colors"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAttachedImage(img.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-rose-400 p-6 rounded-xl text-center bg-slate-50/50 hover:bg-rose-50/20 transition-all space-y-1.5"
        >
          <ImagePlus className="w-6 h-6 text-slate-400 mx-auto mb-1" />
          <p className="text-xs font-bold text-slate-700">No additional photos attached yet</p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Click here to attach full-length pictures, family photos, or kundali charts to the end of the document.
          </p>
        </div>
      )}
    </div>
  );
};
