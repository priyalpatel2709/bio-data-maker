import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { calculateAge, formatDate } from '../../../utils/calculateAge';

interface TemplateProps {
  document: BiodataDocument;
}

export const ModernMinimal: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  // Extract name for prominent modern header
  const personalSec = sections.find((s) => s.key === 'personal');
  const nameField = personalSec?.fields.find(
    (f) => f.id.includes('name') || f.label.toLowerCase().includes('name')
  );
  const candidateName = nameField?.value || document.title;

  return (
    <div className="w-full h-full p-8 sm:p-12 relative flex flex-col justify-between">
      <div>
        {/* Modern Minimal Header */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest block mb-1"
              style={{ color: styling.accentColor }}
            >
              Curriculum Vitae / Biodata
            </span>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
              style={{
                fontFamily: styling.fontFamilyHeading,
                color: styling.primaryColor,
              }}
            >
              {candidateName}
            </h1>
          </div>

          {styling.showPhoto && (
            <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
          )}
        </div>

        {/* Section List */}
        <div className="space-y-7 mt-8">
          {visibleSections.map((section) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} className="space-y-3">
                {/* Section Title with modern vertical accent bar */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-1.5 h-4 rounded-full"
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
                </div>

                {/* Field Grid */}
                <div
                  className={`grid ${
                    styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  } gap-3 sm:gap-4`}
                >
                  {visibleFields.map((field) => {
                    const isDob =
                      field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
                    const calculatedAge = isDob ? calculateAge(field.value) : null;
                    const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

                    return (
                      <div
                        key={field.id}
                        className={`bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 ${
                          field.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                          {field.label}
                        </div>
                        <div
                          className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed"
                          style={{ fontFamily: styling.fontFamilyBody }}
                        >
                          {displayValue || '—'}
                          {calculatedAge !== null && (
                            <span className="ml-1.5 text-xs text-rose-600 font-semibold">
                              ({calculatedAge} yrs)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Confidential Profile</span>
        <span>A4 Format</span>
      </div>
    </div>
  );
};
