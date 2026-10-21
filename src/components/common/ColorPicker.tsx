import React from 'react';
import { Check } from 'lucide-react';

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: { name: string; hex: string }[];
}

const DEFAULT_PRESETS = [
  { name: 'Maroon', hex: '#881337' },
  { name: 'Royal Gold', hex: '#D97706' },
  { name: 'Imperial Navy', hex: '#0F2C59' },
  { name: 'Classic Slate', hex: '#0F172A' },
  { name: 'Emerald', hex: '#047857' },
  { name: 'Bronze', hex: '#78350F' },
  { name: 'Royal Purple', hex: '#6D28D9' },
  { name: 'Rosewood', hex: '#9F1239' },
  { name: 'Warm Amber', hex: '#B45309' },
  { name: 'Charcoal', hex: '#334155' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
          <span className="text-xs font-mono text-slate-500 uppercase">{value}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        {presets.map((preset) => {
          const isSelected = value.toLowerCase() === preset.hex.toLowerCase();
          return (
            <button
              key={preset.hex}
              type="button"
              title={preset.name}
              onClick={() => onChange(preset.hex)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-slate-200"
              style={{ backgroundColor: preset.hex }}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />}
            </button>
          );
        })}
        {/* Custom Color Input */}
        <div className="relative flex items-center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-7 h-7 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10"
            title="Custom Color"
          />
          <div 
            className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 hover:border-slate-500 transition-colors"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Choose custom color</span>
          </div>
        </div>
      </div>
    </div>
  );
};
