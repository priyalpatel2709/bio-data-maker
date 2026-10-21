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
  Sparkles,
} from 'lucide-react';

export const PhotoUploader: React.FC = () => {
  const { document, setPhotoUrl, updateStyling } = useBiodata();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { styling, photoUrl } = document;

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
    { id: 'sidebar', label: 'Sidebar' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Profile Photograph</h4>
          <p className="text-xs text-slate-500">Add a formal portrait or casual photo</p>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
