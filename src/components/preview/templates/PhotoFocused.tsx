import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { Sparkles, Heart } from 'lucide-react';

interface TemplateProps {
  document: BiodataDocument;
}

export const PhotoFocused: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  const personalSec = sections.find((s) => s.key === 'personal');
  const nameField = personalSec?.fields.find(
    (f) => f.id.includes('name') || f.label.toLowerCase().includes('name')
  );
  const candidateName = nameField?.value || document.title;

  return (
    <div className="w-full h-full relative flex flex-col justify-between overflow-hidden">
      <div>
        {/* Hero Top Visual Banner */}
        <div
          className="p-8 sm:p-10 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${styling.primaryColor}, ${styling.primaryColor}dd)`,
          }}
        >
          {/* Subtle Decorative Elements */}
          <div className="absolute top-2 left-4 text-white/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-2 right-4 text-white/20">
            <Heart className="w-8 h-8" />
          </div>

          {/* Central Portrait */}
          {styling.showPhoto && (
            <div className="flex justify-center mb-4">
              <DocumentPhoto
                photoUrl={photoUrl}
                styling={{
                  ...styling,
                  photoBorder: true,
                  photoShape: 'circle',
                }}
                className="w-36 h-36 border-4 border-white shadow-xl"
              />
            </div>
          )}

          <h1
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: styling.fontFamilyHeading }}
          >
            {candidateName}
          </h1>
          <p className="text-xs uppercase tracking-widest text-white/80 mt-1 font-medium">
            Personal & Matrimonial Biodata
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-10 space-y-6">
          {visibleSections.map((section) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: styling.accentColor }}
                  />
                  <h2
                    className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900"
                    style={{
                      fontFamily: styling.fontFamilyHeading,
                      color: styling.primaryColor,
                    }}
                  >
                    {section.title}
                  </h2>
                  <div className="flex-1 h-[1px] bg-slate-200" />
                </div>

                <div
                  className={`grid ${
                    styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  } gap-3`}
                >
                  {visibleFields.map((field) => {
                    const isDob =
                      field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
                    const calculatedAge = isDob ? calculateAge(field.value) : null;
                    const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

                    return (
                      <div
                        key={field.id}
                        className={`bg-white/80 p-3 rounded-xl border border-slate-200/80 shadow-sm ${
                          field.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                          {field.label}
                        </span>
                        <span
                          className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed block"
                          style={{ fontFamily: styling.fontFamilyBody }}
                        >
                          {displayValue || '—'}
                          {calculatedAge !== null && (
                            <span className="ml-1 text-xs text-rose-600 font-bold">
                              ({calculatedAge} yrs)
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 text-center text-[11px] text-slate-400 border-t border-slate-100">
        Personal Biodata Dossier
      </div>
    </div>
  );
};
