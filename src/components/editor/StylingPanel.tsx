import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { FontOption, SpacingOption, BorderStyle } from '../../types/biodata';
import { ColorPicker } from '../common/ColorPicker';
import { PhotoUploader } from './PhotoUploader';
import { BackgroundPicker } from './BackgroundPicker';
import {
  Palette,
  Type,
  LayoutGrid,
  Frame,
} from 'lucide-react';

export const StylingPanel: React.FC = () => {
  const { document, updateStyling } = useBiodata();
  const { styling } = document;

  const fontOptions: FontOption[] = [
    'Inter',
    'Playfair Display',
    'Cinzel',
    'Cormorant Garamond',
    'Merriweather',
    'Montserrat',
  ];

  const spacingOptions: { id: SpacingOption; label: string }[] = [
    { id: 'compact', label: 'Compact' },
    { id: 'normal', label: 'Balanced' },
    { id: 'relaxed', label: 'Spacious' },
  ];

  const borderOptions: { id: BorderStyle; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'simple', label: 'Minimal Box' },
    { id: 'double', label: 'Classic Double' },
    { id: 'ornate', label: 'Royal Ornate' },
    { id: 'decorative', label: 'Floral Corner' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Color Palette */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm font-bold text-slate-900">Color Palette & Highlights</h4>
        </div>

        <ColorPicker
          label="Primary Theme Color (Headings & Emphases)"
          value={styling.primaryColor}
          onChange={(color) => updateStyling({ primaryColor: color })}
        />

        <ColorPicker
          label="Accent Color (Dividers, Badges & Icons)"
          value={styling.accentColor}
          onChange={(color) => updateStyling({ accentColor: color })}
        />
      </div>

      {/* Auspicious Header Emblem */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Auspicious Header Emblem</h4>
            <p className="text-xs text-slate-500">Religious or traditional opening icon (InstantBiodata style)</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'ganesha' as const, label: 'Ganesha', icon: '🐘' },
            { id: 'om' as const, label: 'Om ॐ', icon: 'ॐ' },
            { id: 'swastik' as const, label: 'Swastik', icon: '卐' },
            { id: 'ek-onkar' as const, label: 'Ek Onkar', icon: 'ੴ' },
            { id: 'bismillah' as const, label: 'Bismillah', icon: '☪' },
            { id: 'cross' as const, label: 'Cross', icon: '✝' },
            { id: 'lotus' as const, label: 'Lotus', icon: '🪷' },
            { id: 'none' as const, label: 'None', icon: '✕' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateStyling({ headerSymbol: item.id })}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                (styling.headerSymbol || 'ganesha') === item.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-base mb-0.5">{item.icon}</span>
              <span className="text-[10px] truncate block w-full">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Typography */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Type className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm font-bold text-slate-900">Typography & Hierarchy</h4>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Heading Font Family
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fontOptions.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => updateStyling({ fontFamilyHeading: font })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  styling.fontFamilyHeading === font
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                style={{ fontFamily: font }}
              >
                <span className="text-sm block">{font}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Sample Heading</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Body Text Font
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fontOptions.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => updateStyling({ fontFamilyBody: font })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  styling.fontFamilyBody === font
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                style={{ fontFamily: font }}
              >
                <span className="text-sm block">{font}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Regular body text</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Text Size Scale
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'normal', 'relaxed'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateStyling({ fontSize: size })}
                className={`py-2 rounded-xl border text-xs font-medium capitalize transition-all ${
                  styling.fontSize === size
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Layout, Spacing & Columns */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <LayoutGrid className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm font-bold text-slate-900">Layout & Spacing</h4>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Section Grid Columns
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { col: 1 as const, label: 'Single Column (Linear)' },
              { col: 2 as const, label: 'Two Columns (Compact)' },
            ].map((c) => (
              <button
                key={c.col}
                type="button"
                onClick={() => updateStyling({ columns: c.col })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  styling.columns === c.col
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Document Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {spacingOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateStyling({ spacing: s.id })}
                className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                  styling.spacing === s.id
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Page Borders */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Frame className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm font-bold text-slate-900">Document Frame & Border Style</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {borderOptions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => updateStyling({ borderStyle: b.id })}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                styling.borderStyle === b.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Profile Photo Settings */}
      <PhotoUploader />

      {/* 6. Background & Texture Settings */}
      <BackgroundPicker />
    </div>
  );
};
