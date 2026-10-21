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
  Languages,
  Sparkles,
  Heading,
} from 'lucide-react';

export const StylingPanel: React.FC = () => {
  const { document, updateStyling, translateBiodata } = useBiodata();
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
      {/* 0. Document Language & Script */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-rose-600" />
            <h4 className="text-sm font-bold text-slate-900">Document Language / ભાષા / भाषा</h4>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/50">
            Multilingual
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'en' as const, label: 'English', native: 'English', flag: '🇬🇧' },
            { id: 'hi' as const, label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
            { id: 'gu' as const, label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
          ].map((langItem) => {
            const isSelected = (styling.language || document.language || 'en') === langItem.id;
            return (
              <button
                key={langItem.id}
                type="button"
                onClick={() => translateBiodata(langItem.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/80 text-rose-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg mb-1">{langItem.flag}</div>
                <div className="text-xs font-bold">{langItem.native}</div>
                <div className="text-[10px] text-slate-400 font-normal">{langItem.label}</div>
              </button>
            );
          })}
        </div>
      </div>

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

      {/* Auspicious Header Emblem & Customization */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Auspicious Header Emblem</h4>
              <p className="text-xs text-slate-500">Sacred opening symbol & invocation mantra</p>
            </div>
          </div>
          {/* Toggle Emblem Visibility */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={styling.showEmblem !== false}
              onChange={(e) => updateStyling({ showEmblem: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 relative"></div>
            <span className="text-xs font-semibold text-slate-700">
              {styling.showEmblem !== false ? 'Shown' : 'Hidden'}
            </span>
          </label>
        </div>

        {styling.showEmblem !== false && (
          <div className="space-y-4 pt-1">
            {/* Symbol Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Choose Symbol or Icon
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'ganesha' as const, label: 'Ganesha', icon: '🐘' },
                  { id: 'om' as const, label: 'Om ॐ', icon: 'ॐ' },
                  { id: 'swastik' as const, label: 'Swastik', icon: '卐' },
                  { id: 'ek-onkar' as const, label: 'Ek Onkar', icon: 'ੴ' },
                  { id: 'bismillah' as const, label: 'Bismillah', icon: '☪' },
                  { id: 'cross' as const, label: 'Cross', icon: '✝' },
                  { id: 'lotus' as const, label: 'Lotus', icon: '🪷' },
                  { id: 'custom' as const, label: 'Custom', icon: '✏️' },
                  { id: 'none' as const, label: 'None', icon: '✕' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateStyling({ headerSymbol: item.id })}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      (styling.headerSymbol || 'ganesha') === item.id
                        ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base mb-0.5">{item.icon}</span>
                    <span className="text-[10px] truncate block w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Icon/Emoji Field if custom is chosen */}
            {styling.headerSymbol === 'custom' && (
              <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200/60 space-y-2">
                <label className="block text-xs font-bold text-rose-950">
                  Custom Icon / Emoji
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={styling.customHeaderSymbol || ''}
                    onChange={(e) => updateStyling({ customHeaderSymbol: e.target.value })}
                    placeholder="e.g. 🌺, 🪔, 🔱, 🚩, ✨"
                    className="flex-1 px-3 py-2 text-sm bg-white border border-rose-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-center text-lg"
                    maxLength={10}
                  />
                  {styling.customHeaderSymbol && (
                    <button
                      type="button"
                      onClick={() => updateStyling({ customHeaderSymbol: '' })}
                      className="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-100 rounded-lg font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {/* Quick suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-500 font-medium">Quick suggestions:</span>
                  {['🌺', '🪔', '🔱', '🚩', '✨', '🕊️', '💐', '🔔', '🌿', '❤️'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => updateStyling({ customHeaderSymbol: emoji })}
                      className="w-7 h-7 flex items-center justify-center text-sm bg-white hover:bg-rose-100 border border-slate-200 rounded-md transition-all active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Mantra / Sacred Opening Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Custom Mantra / Inscription Text
                </label>
                {styling.customHeaderText && (
                  <button
                    type="button"
                    onClick={() => updateStyling({ customHeaderText: '' })}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
              <input
                type="text"
                value={styling.customHeaderText || ''}
                onChange={(e) => updateStyling({ customHeaderText: e.target.value })}
                placeholder="e.g. || Jai Shri Krishna || or || Shree Ganeshaya Namah ||"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800"
              />
              <p className="text-[11px] text-slate-400">
                Leave empty for automatic deity mantra in the document's language, or enter your preferred prayer/slogan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Document Title ("BIODATA") Customization & Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Heading className="w-4 h-4 text-rose-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Document Title ("BIODATA")</h4>
              <p className="text-xs text-slate-500">Rename or remove the main top title</p>
            </div>
          </div>
          {/* Toggle Title Visibility */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={styling.showDocumentTitle !== false}
              onChange={(e) => updateStyling({ showDocumentTitle: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 relative"></div>
            <span className="text-xs font-semibold text-slate-700">
              {styling.showDocumentTitle !== false ? 'Shown' : 'Hidden'}
            </span>
          </label>
        </div>

        {styling.showDocumentTitle !== false && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Custom Title Heading
              </label>
              {styling.customDocumentTitle && (
                <button
                  type="button"
                  onClick={() => updateStyling({ customDocumentTitle: '' })}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Reset to Default
                </button>
              )}
            </div>
            <input
              type="text"
              value={styling.customDocumentTitle || ''}
              onChange={(e) => updateStyling({ customDocumentTitle: e.target.value })}
              placeholder="e.g. BIODATA, MARRIAGE BIODATA, BIO-DATA"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800"
            />

            {/* Quick title presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-500 font-medium">Quick presets:</span>
              {[
                'BIODATA',
                'MARRIAGE BIODATA',
                'BIO-DATA',
                'MATRIMONIAL BIODATA',
                'MATRIMONIAL RESUME',
              ].map((titlePreset) => (
                <button
                  key={titlePreset}
                  type="button"
                  onClick={() => updateStyling({ customDocumentTitle: titlePreset })}
                  className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                    (styling.customDocumentTitle || '') === titlePreset
                      ? 'border-rose-500 bg-rose-50 text-rose-700 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {titlePreset}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              You can rename this to whatever you prefer, or toggle the switch above to remove the title completely.
            </p>
          </div>
        )}
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
