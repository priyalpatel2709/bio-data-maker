import React, { useRef } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { PhotoShape, PhotoPosition } from '../../types/biodata';
import { Button } from '../common/Button';
import { Switch } from '../common/Switch';
import {
  Upload,
  Trash2,
  User,
  Circle,
  Square,
  Sliders,
  Lock,
  Unlock,
  RotateCcw,
} from 'lucide-react';

export const PhotoUploader: React.FC = () => {
  const { document, setPhotoUrl, updateStyling } = useBiodata();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { styling, photoUrl } = document;

  const defaultSizeMap: Record<'small' | 'medium' | 'large', { width: number; height: number }> = {
    small: { width: 100, height: 130 },
    medium: { width: 130, height: 170 },
    large: { width: 160, height: 210 },
  };

  const base = defaultSizeMap[styling.photoSize || 'medium'] || defaultSizeMap.medium;
  const currentWidth = styling.photoWidth && styling.photoWidth > 0 ? styling.photoWidth : base.width;
  const currentHeight = styling.photoShape === 'circle'
    ? currentWidth
    : (styling.photoHeight && styling.photoHeight > 0 ? styling.photoHeight : base.height);
  const isAspectLocked = styling.photoAspectRatioLocked !== false; // default to locked

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    const clampedWidth = Math.max(70, Math.min(300, newWidth));
    if (styling.photoShape === 'circle') {
      updateStyling({
        photoWidth: clampedWidth,
        photoHeight: clampedWidth,
      });
      return;
    }

    if (isAspectLocked) {
      const ratio = currentHeight / (currentWidth || 1);
      const newHeight = Math.round(clampedWidth * (ratio || 1.3));
      updateStyling({
        photoWidth: clampedWidth,
        photoHeight: Math.max(80, Math.min(400, newHeight)),
      });
    } else {
      updateStyling({ photoWidth: clampedWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    const clampedHeight = Math.max(80, Math.min(400, newHeight));
    if (styling.photoShape === 'circle') {
      updateStyling({
        photoWidth: clampedHeight,
        photoHeight: clampedHeight,
      });
      return;
    }

    if (isAspectLocked) {
      const ratio = currentWidth / (currentHeight || 1);
      const newWidth = Math.round(clampedHeight * (ratio || 0.77));
      updateStyling({
        photoWidth: Math.max(70, Math.min(300, newWidth)),
        photoHeight: clampedHeight,
      });
    } else {
      updateStyling({ photoHeight: clampedHeight });
    }
  };

  const shapes: { id: PhotoShape; label: string; icon: React.ReactNode }[] = [
    { id: 'circle', label: 'Circle', icon: <Circle className="w-4 h-4" /> },
    { id: 'rounded', label: 'Rounded', icon: <Square className="w-4 h-4 rounded-md" /> },
    { id: 'square', label: 'Square', icon: <Square className="w-4 h-4" /> },
    { id: 'oval', label: 'Oval', icon: <Circle className="w-4 h-4 scale-y-125" /> },
  ];

  const positions: { id: PhotoPosition; label: string }[] = [
    { id: 'top-right', label: 'Top Right' },
    { id: 'top-left', label: 'Top Left' },
    { id: 'top-center', label: 'Top Center' },
  ];

  const sizePresets = [
    { id: 'small' as const, label: 'Small', w: 100, h: 130 },
    { id: 'medium' as const, label: 'Medium', w: 130, h: 170 },
    { id: 'large' as const, label: 'Large', w: 160, h: 210 },
    { id: 'xl' as const, label: 'Extra Large', w: 195, h: 255 },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Profile Photograph</h4>
          <p className="text-xs text-slate-500">Dimensions, framing & candidate details alignment</p>
        </div>
        <Switch
          checked={styling.showPhoto}
          onChange={(checked) => updateStyling({ showPhoto: checked })}
          label=""
        />
      </div>

      {styling.showPhoto && (
        <>
          {/* Photo Preview & Upload Controls */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <User className="w-8 h-8 text-slate-300" />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Upload className="w-3.5 h-3.5 text-slate-600" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoUrl ? 'Replace Photo' : 'Upload Photo'}
                </Button>
                {photoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                    onClick={() => setPhotoUrl(undefined)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">JPG, PNG or WebP. Max 5MB.</p>
            </div>
          </div>

          {/* Photo Size & Dimension Controls */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Image Width & Height Controls
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateStyling({ photoAspectRatioLocked: !isAspectLocked })}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                    isAspectLocked
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                  title={isAspectLocked ? 'Aspect Ratio Locked (Proportional scaling)' : 'Aspect Ratio Unlocked (Free height/width)'}
                >
                  {isAspectLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{isAspectLocked ? 'Ratio Locked' : 'Free Resize'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateStyling({
                      photoSize: 'medium',
                      photoWidth: 130,
                      photoHeight: 170,
                      photoAspectRatioLocked: true,
                    });
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1"
                  title="Reset to default dimensions"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Quick Size Presets */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Quick Size Presets
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {sizePresets.map((preset) => {
                  const isSelected =
                    Math.abs(currentWidth - preset.w) <= 6 &&
                    Math.abs(currentHeight - preset.h) <= 6;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        updateStyling({
                          photoSize: preset.id === 'xl' ? 'large' : preset.id,
                          photoWidth: preset.w,
                          photoHeight: styling.photoShape === 'circle' ? preset.w : preset.h,
                        });
                      }}
                      className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-semibold">{preset.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {preset.w}×{styling.photoShape === 'circle' ? preset.w : preset.h}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Width Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <span>Photo Width</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Details automatically adjust)</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleWidthChange(currentWidth - 4)}
                    className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-rose-700 font-bold">
                    {currentWidth} px
                  </span>
                  <button
                    type="button"
                    onClick={() => handleWidthChange(currentWidth + 4)}
                    className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={70}
                max={300}
                step={2}
                value={currentWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
            </div>

            {/* Height Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <span>Photo Height</span>
                  {styling.photoShape === 'circle' && (
                    <span className="text-[10px] text-slate-400 font-normal">(Locked to width for circle)</span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={styling.photoShape === 'circle'}
                    onClick={() => handleHeightChange(currentHeight - 4)}
                    className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-rose-700 font-bold">
                    {currentHeight} px
                  </span>
                  <button
                    type="button"
                    disabled={styling.photoShape === 'circle'}
                    onClick={() => handleHeightChange(currentHeight + 4)}
                    className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={80}
                max={380}
                step={2}
                disabled={styling.photoShape === 'circle'}
                value={currentHeight}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className={`w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none ${
                  styling.photoShape === 'circle' ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Tip: As you increase photo width and height, the candidate details will automatically expand and adjust to fill the remaining space.
            </p>
          </div>

          {/* Photo Shape Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Frame Shape
            </label>
            <div className="grid grid-cols-4 gap-2">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => updateStyling({ photoShape: s.id })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${
                    styling.photoShape === s.id
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.icon}
                  <span className="mt-1 text-[11px]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Position Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Photo Placement
            </label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateStyling({ photoPosition: p.id })}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    styling.photoPosition === p.id
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Border & Size */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <Switch
              label="Decorative Border"
              description="Add subtle accent border around portrait"
              checked={styling.photoBorder}
              onChange={(checked) => updateStyling({ photoBorder: checked })}
            />
          </div>
        </>
      )}
    </div>
  );
};
