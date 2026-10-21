import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { calculateAge, formatDate } from '../../../utils/calculateAge';

interface TemplateProps {
  document: BiodataDocument;
}

export const ElegantPremium: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  const personalSec = sections.find((s) => s.key === 'personal');
  const nameField = personalSec?.fields.find(
    (f) => f.id.includes('name') || f.label.toLowerCase().includes('name')
  );
  const candidateName = nameField?.value || document.title;

  return (
    <div className="w-full h-full p-8 sm:p-12 relative flex flex-col justify-between">
      {/* Outer Fine Double Border */}
      {styling.borderStyle !== 'none' && (
        <div
          className="absolute inset-4 pointer-events-none"
          style={{
            border: `1.5px solid ${styling.accentColor}`,
            outline: `1px solid ${styling.primaryColor}`,
            outlineOffset: '-5px',
          }}
        />
      )}

      <div>
        {/* Elegant Top Header with Monogram / Frame */}
        <div className="text-center pb-6 border-b border-slate-200">
          <div
            className="w-10 h-10 mx-auto rounded-full border border-amber-600/40 flex items-center justify-center text-xs font-bold mb-2 shadow-sm"
            style={{
              color: styling.accentColor,
              backgroundColor: styling.backgroundColor,
            }}
          >
            ✦
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase"
            style={{
              fontFamily: styling.fontFamilyHeading,
              color: styling.primaryColor,
            }}
          >
            {candidateName}
          </h1>
          <p
            className="text-xs tracking-widest uppercase mt-1 italic"
            style={{ color: styling.accentColor }}
          >
            Personal Profile & Matrimonial Biodata
          </p>
        </div>

        {/* Center / Right Photo if present */}
        {styling.showPhoto && (
          <div className="flex justify-center my-6">
            <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-md" />
          </div>
        )}

        {/* Sections */}
        <div className="space-y-6 mt-6">
          {visibleSections.map((section) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} className="space-y-2.5">
                {/* Refined Section Header */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold tracking-widest uppercase"
                    style={{
                      fontFamily: styling.fontFamilyHeading,
                      color: styling.primaryColor,
                    }}
                  >
                    {section.title}
                  </span>
                  <div
                    className="flex-1 h-[1px]"
                    style={{ backgroundColor: styling.accentColor }}
                  />
                </div>

                {/* Grid */}
                <div
                  className={`grid ${
                    styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  } gap-x-8 gap-y-2`}
                >
                  {visibleFields.map((field) => {
                    const isDob =
                      field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
                    const calculatedAge = isDob ? calculateAge(field.value) : null;
                    const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

                    return (
                      <div
                        key={field.id}
                        className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-slate-100 ${
                          field.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <span
                          className="font-bold w-2/5 shrink-0 pr-2 text-slate-700"
                          style={{ fontFamily: styling.fontFamilyBody }}
                        >
                          {field.label}:
                        </span>
                        <span
                          className="text-slate-800 flex-1 leading-relaxed"
                          style={{ fontFamily: styling.fontFamilyBody }}
                        >
                          {displayValue || '—'}
                          {calculatedAge !== null && (
                            <span className="ml-1 text-slate-500 font-normal">
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

      <div className="text-center pt-8 text-[10px] text-slate-400 tracking-widest uppercase">
        ❖ Dignified Family Record ❖
      </div>
    </div>
  );
};
