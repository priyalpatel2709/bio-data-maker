import React from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { TEMPLATES } from '../../data/templateCatalog';
import { Check, Sparkles } from 'lucide-react';

export const TemplateSelector: React.FC = () => {
  const { document, setTemplate } = useBiodata();
  const currentTemplateId = document.styling.templateId;

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900">Switch Template Layout</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose a design. All your fields, custom data, and edits are 100% preserved.
        </p>
      </div>

      <div className="space-y-4">
        {TEMPLATES.map((tpl) => {
          const isSelected = currentTemplateId === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex items-start gap-4 ${
                isSelected
                  ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Miniature visual thumbnail */}
              <div
                className="w-20 h-28 rounded-xl border border-slate-200 shrink-0 p-2 flex flex-col justify-between shadow-inner"
                style={{ backgroundColor: tpl.defaultStyling.backgroundColor || '#FFFDF9' }}
              >
                <div
                  className="h-2 w-full rounded"
                  style={{ backgroundColor: tpl.previewColor }}
                />
                <div className="space-y-1">
                  <div className="h-1 w-3/4 bg-slate-300 rounded" />
                  <div className="h-1 w-full bg-slate-200 rounded" />
                  <div className="h-1 w-2/3 bg-slate-200 rounded" />
                </div>
                <div
                  className="h-1.5 w-1/2 rounded self-end"
                  style={{ backgroundColor: tpl.previewColor }}
                />
              </div>

              {/* Template Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {tpl.name}
                    {isSelected && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </h5>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: tpl.previewColor }}
                  >
                    {tpl.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="mt-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Best for:</span> {tpl.bestFor}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
