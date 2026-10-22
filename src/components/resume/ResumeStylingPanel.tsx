import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeFontOption } from '../../types/resume';
import { Palette, Type, Layout, Image, ShieldCheck } from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Monochrome (Black & White)', primary: '#000000', secondary: '#525252' },
  { name: 'Charcoal & Slate', primary: '#18181B', secondary: '#52525B' },
  { name: 'Teal Modern', primary: '#0F766E', secondary: '#0284C7' },
  { name: 'Corporate Navy', primary: '#1E3A8A', secondary: '#475569' },
  { name: 'Executive Charcoal', primary: '#334155', secondary: '#64748B' },
  { name: 'Royal Indigo', primary: '#4338CA', secondary: '#6366F1' },
  { name: 'Emerald Forest', primary: '#047857', secondary: '#0D9488' },
  { name: 'Crimson Burgundy', primary: '#991B1B', secondary: '#B91C1C' },
  { name: 'Warm Amber / Rust', primary: '#7C2D12', secondary: '#9A3412' },
];

const FONT_OPTIONS: { id: ResumeFontOption; label: string; type: string }[] = [
  { id: 'Inter', label: 'Inter', type: 'Clean Modern Sans' },
  { id: 'Roboto', label: 'Roboto', type: 'Crisp Standard Sans' },
  { id: 'Montserrat', label: 'Montserrat', type: 'Geometric Editorial' },
  { id: 'Merriweather', label: 'Merriweather', type: 'Corporate Classic Serif' },
  { id: 'Playfair Display', label: 'Playfair Display', type: 'Elegant Formal Serif' },
  { id: 'Lora', label: 'Lora', type: 'Contemporary Book Serif' },
];

export const ResumeStylingPanel: React.FC = () => {
  const { document, updateStyling } = useResume();
  const { styling } = document;

  return (
    <div className="space-y-6 pb-12 text-xs">
      {/* 1. Color Scheme */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">Color Palette</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              updateStyling({
                primaryColor: '#000000',
                secondaryColor: '#525252',
                textColor: '#000000',
              })
            }
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition flex items-center gap-1.5 ${
              styling.primaryColor === '#000000'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-black border border-white" />
            Monochrome B&W
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = styling.primaryColor === preset.primary;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  updateStyling({
                    primaryColor: preset.primary,
                    secondaryColor: preset.secondary,
                  })
                }
                className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 shadow-xs border border-white"
                  style={{ backgroundColor: preset.primary }}
                />
                <span className="font-semibold text-slate-800 truncate">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Color Pickers */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium text-slate-700">Primary Color:</label>
            <input
              type="color"
              value={styling.primaryColor}
              onChange={(e) => updateStyling({ primaryColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
            />
            <span className="font-mono text-slate-500 uppercase">{styling.primaryColor}</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-slate-700">Accent:</label>
            <input
              type="color"
              value={styling.secondaryColor}
              onChange={(e) => updateStyling({ secondaryColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
            />
            <span className="font-mono text-slate-500 uppercase">{styling.secondaryColor}</span>
          </div>
        </div>
      </div>

      {/* 2. Typography */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-bold text-slate-900">Typography</h3>
        </div>

        <div className="space-y-2 mb-4">
          {FONT_OPTIONS.map((f) => {
            const isSelected = styling.fontFamily === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => updateStyling({ fontFamily: f.id })}
                className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 block" style={{ fontFamily: f.id }}>
                    {f.label}
                  </span>
                  <span className="text-[11px] text-slate-500">{f.type}</span>
                </div>
                <span className="text-xs text-slate-400" style={{ fontFamily: f.id }}>
                  Aa Bb Gg 123
                </span>
              </button>
            );
          })}
        </div>

        {/* Font Size & Spacing */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Font Size Scale</label>
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              {(['compact', 'normal', 'relaxed'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => updateStyling({ fontSize: sz })}
                  className={`flex-1 py-1 rounded-md capitalize font-semibold transition ${
                    styling.fontSize === sz ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Paper Format</label>
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              {(['a4', 'letter'] as const).map((paper) => (
                <button
                  key={paper}
                  type="button"
                  onClick={() => updateStyling({ paperSize: paper })}
                  className={`flex-1 py-1 rounded-md uppercase font-semibold transition ${
                    styling.paperSize === paper ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {paper}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Layout & Elements */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-bold text-slate-900">Layout & Visual Elements</h3>
        </div>

        {/* Photo Options */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Show Profile Photo</span>
              <p className="text-[11px] text-slate-500">Enable or disable headshot on resume</p>
            </div>
            <input
              type="checkbox"
              checked={styling.showPhoto}
              onChange={(e) => updateStyling({ showPhoto: e.target.checked })}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>

          {styling.showPhoto && (
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <span className="text-slate-600 font-medium">Shape:</span>
              {(['circle', 'rounded', 'square'] as const).map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => updateStyling({ photoShape: shape })}
                  className={`px-2.5 py-1 rounded border capitalize font-semibold transition ${
                    styling.photoShape === shape
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Skills Display Style */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <label className="font-bold text-slate-800 block mb-1.5">Skills Display Style</label>
          <div className="flex bg-slate-200/70 p-1 rounded-lg">
            {(['chips', 'dots', 'comma'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateStyling({ skillsDisplay: mode })}
                className={`flex-1 py-1 rounded capitalize font-semibold transition ${
                  styling.skillsDisplay === mode ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {mode === 'chips' ? 'Pills / Badges' : mode === 'dots' ? 'Bullet Dots' : 'Comma List'}
              </button>
            ))}
          </div>
        </div>

        {/* Page Margins & Multi-Page Settings */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Page Margins & Padding</label>
            <p className="text-[11px] text-slate-500 mb-2">Applied equally to both Page 1 and Page 2</p>
            <div className="flex bg-slate-200/70 p-1 rounded-lg">
              {(['compact', 'normal', 'spacious'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => updateStyling({ pageMargin: m })}
                  className={`flex-1 py-1 rounded capitalize font-semibold transition ${
                    styling.pageMargin === m ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {m === 'compact' ? 'Compact (24px)' : m === 'normal' ? 'Normal (36px)' : 'Spacious (48px)'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Show Header on Page 2</span>
                <p className="text-[11px] text-slate-500">Name, target title & contact on 2nd page</p>
              </div>
              <input
                type="checkbox"
                checked={styling.showPage2Header ?? true}
                onChange={(e) => updateStyling({ showPage2Header: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Page Numbering Footer</span>
                <p className="text-[11px] text-slate-500">Displays "Page X of Y" at page bottom</p>
              </div>
              <input
                type="checkbox"
                checked={styling.showPageNumbers ?? true}
                onChange={(e) => updateStyling({ showPageNumbers: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-800 block mb-1">Page Break Placement</label>
            <select
              value={styling.pageSplitAt || 'auto'}
              onChange={(e) => updateStyling({ pageSplitAt: e.target.value as any })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="auto">Auto (Projects & Education start Page 2)</option>
              <option value="projects">Start Page 2 at: Key Projects</option>
              <option value="education">Start Page 2 at: Education</option>
              <option value="skills">Start Page 2 at: Skills</option>
              <option value="single-page">Single Page Mode (Fit everything on 1 page)</option>
            </select>
          </div>
        </div>

        {/* ATS Friendly Notice */}
        <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-teal-900">ATS Optimization Engine</span>
            <p className="text-[11px] text-teal-800 leading-relaxed mt-0.5">
              All styles and templates generate clean, standard HTML and native Word (.docx) tags parseable by Taleo, Workday, Greenhouse, and Lever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
