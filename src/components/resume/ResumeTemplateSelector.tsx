import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { RESUME_TEMPLATES } from '../../data/defaultResume';
import { ResumeTemplateThumbnail } from './ResumeTemplateThumbnail';
import { Check, Sparkles } from 'lucide-react';

export const ResumeTemplateSelector: React.FC = () => {
  const { document, setTemplate } = useResume();
  const currentTemplateId = document.styling.templateId;

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-gradient-to-r from-teal-50 to-sky-50 p-4 rounded-xl border border-teal-200/80">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Curated Professional Templates</span>
        </div>
        <p className="text-xs text-teal-700 leading-relaxed">
          Switch templates anytime. Your content, experiences, skills, and projects adapt to the new design instantly without losing data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {RESUME_TEMPLATES.map((tpl) => {
          const isSelected = currentTemplateId === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={`group cursor-pointer rounded-xl border-2 overflow-hidden transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/20 shadow-md ring-2 ring-teal-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
              }`}
            >
              {/* Visual Miniature Template Thumbnail */}
              <div className="relative h-36 bg-slate-100 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                <ResumeTemplateThumbnail
                  templateId={tpl.id}
                  docOverride={document}
                  scale={0.20}
                  height={144}
                  className="transition-transform group-hover:scale-105 duration-200"
                />

                {tpl.badge && (
                  <span
                    className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full text-white shadow-xs z-10"
                    style={{ backgroundColor: tpl.previewColor }}
                  >
                    {tpl.badge}
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0"
                        style={{ backgroundColor: tpl.previewColor }}
                      />
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{tpl.name}</h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mb-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 text-[10px]">
                    {tpl.bestFor.split(',')[0]}
                  </span>

                  <div
                    className={`flex items-center gap-1 font-semibold text-xs transition ${
                      isSelected ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      'Apply'
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
