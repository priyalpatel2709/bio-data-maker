import React, { useState, useRef, useEffect } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { Language } from '../../types/biodata';
import { Languages, Check, ChevronDown, Sparkles } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  compact = false,
}) => {
  const { language, setLanguage, translateBiodata } = useBiodata();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { id: Language; label: string; nativeName: string; flag: string }[] = [
    { id: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
    { id: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { id: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  const currentLang = languages.find((l) => l.id === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langId: Language, alsoTranslateBiodata = true) => {
    if (alsoTranslateBiodata) {
      translateBiodata(langId);
    } else {
      setLanguage(langId);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs active:scale-95"
        title="Select Language / ભાષા / भाषा"
      >
        <Languages className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span className="font-bold">{currentLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/10 z-50 p-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Language / भाषा / ભાષા
          </div>

          <div className="py-1 space-y-0.5">
            {languages.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectLanguage(item.id, true)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  language === item.id
                    ? 'bg-rose-50 text-rose-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.flag}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold leading-tight">{item.nativeName}</div>
                    <div className="text-[10px] text-slate-400 font-normal leading-tight">
                      {item.label}
                    </div>
                  </div>
                </div>

                {language === item.id && (
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 px-2 pb-1 text-[10px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Auto-translates document section titles & field labels</span>
          </div>
        </div>
      )}
    </div>
  );
};
