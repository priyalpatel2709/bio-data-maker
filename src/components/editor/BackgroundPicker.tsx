import React, { useRef } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { PATTERNS } from '../../assets/patterns';
import { Button } from '../common/Button';
import { Upload, Trash2, RotateCcw } from 'lucide-react';

export const BackgroundPicker: React.FC = () => {
  const { document, updateStyling } = useBiodata();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { styling } = document;

  const bgColors = [
    { name: 'Warm Ivory', hex: '#FFFDF9' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Soft Cream', hex: '#FCFBF7' },
    { name: 'Pearl Gray', hex: '#F8FAFC' },
    { name: 'Blush Sand', hex: '#FFF5F5' },
    { name: 'Champagne Linen', hex: '#FDFCF7' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Background image size should be less than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateStyling({ backgroundImageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div>
        <h4 className="text-sm font-bold text-slate-900">Background & Texture</h4>
        <p className="text-xs text-slate-500">Customize canvas paper tone and watermark texture</p>
      </div>

      {/* Canvas Color Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Paper Tone
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {bgColors.map((color) => {
            const isSelected = styling.backgroundColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => updateStyling({ backgroundColor: color.hex })}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className="w-full h-7 rounded-md border border-slate-200 shadow-inner mb-1"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[10px] font-medium text-slate-600 truncate block">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Subtle Motif / Pattern
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PATTERNS).map(([key, pat]) => {
            const isSelected = styling.backgroundPattern === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => updateStyling({ backgroundPattern: key as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 text-rose-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs block truncate">{pat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opacity Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Pattern / Watermark Opacity
          </label>
          <span className="text-xs font-mono text-slate-600">
            {Math.round(styling.backgroundOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.02"
          max="0.4"
          step="0.02"
          value={styling.backgroundOpacity}
          onChange={(e) => updateStyling({ backgroundOpacity: parseFloat(e.target.value) })}
          className="w-full accent-rose-600 cursor-pointer"
        />
      </div>

      {/* Upload Custom Background Image */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Custom Background Image (Optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Upload className="w-3.5 h-3.5" />}
            onClick={() => fileInputRef.current?.click()}
          >
            {styling.backgroundImageUrl ? 'Change Image' : 'Upload Image'}
          </Button>

          {styling.backgroundImageUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
              onClick={() => updateStyling({ backgroundImageUrl: undefined })}
            >
              Remove
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            onClick={() =>
              updateStyling({
                backgroundColor: '#FFFDF9',
                backgroundPattern: 'none',
                backgroundOpacity: 0.1,
                backgroundImageUrl: undefined,
              })
            }
            title="Reset background"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
