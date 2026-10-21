import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { Users } from 'lucide-react';

interface TemplateProps {
  document: BiodataDocument;
}

export const FamilyFocused: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;

  // Separate family section from other sections
  const familySection = sections.find((s) => s.key === 'family');
  const otherSections = sections.filter((s) => s.key !== 'family' && s.visible);

  return (
    <div className="w-full h-full p-8 sm:p-10 relative flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-200">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider block mb-1"
              style={{ color: styling.accentColor }}
            >
              Matrimonial Profile
            </span>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900"
              style={{
                fontFamily: styling.fontFamilyHeading,
                color: styling.primaryColor,
              }}
            >
              {document.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Family & Personal Background Dossier
            </p>
          </div>

          {styling.showPhoto && (
            <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
          )}
        </div>

        {/* Featured Family Heritage Card */}
        {familySection && familySection.visible && (
          <div
            className="my-6 p-4 sm:p-5 rounded-2xl border-2 shadow-sm"
            style={{
              backgroundColor: `${styling.primaryColor}08`,
              borderColor: styling.primaryColor,
            }}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: styling.primaryColor }}
              >
                <Users className="w-4 h-4" />
              </div>
              <h2
                className="text-base font-bold uppercase tracking-wide"
                style={{
                  color: styling.primaryColor,
                  fontFamily: styling.fontFamilyHeading,
                }}
              >
                {familySection.title} (Family Pedigree)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {familySection.fields
                .filter((f) => f.visible)
                .map((field) => (
                  <div key={field.id} className="text-xs sm:text-sm">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                      {field.label}
                    </span>
                    <span className="text-slate-900 font-medium">{field.value || '—'}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Other Sections */}
        <div className="space-y-6">
          {otherSections.map((section) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} className="space-y-2.5">
                <div
                  className="pb-1 border-b"
                  style={{ borderColor: styling.accentColor }}
                >
                  <h3
                    className="text-sm sm:text-base font-bold uppercase tracking-wide"
                    style={{
                      color: styling.primaryColor,
                      fontFamily: styling.fontFamilyHeading,
                    }}
                  >
                    {section.title}
                  </h3>
                </div>

                <div
                  className={`grid ${
                    styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  } gap-x-6 gap-y-2`}
                >
                  {visibleFields.map((field) => {
                    const isDob =
                      field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
                    const calculatedAge = isDob ? calculateAge(field.value) : null;
                    const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

                    return (
                      <div
                        key={field.id}
                        className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-slate-200/80 ${
                          field.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <span className="font-semibold w-2/5 shrink-0 pr-2 text-slate-700">
                          {field.label}:
                        </span>
                        <span className="text-slate-900 flex-1">
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

      <div className="pt-8 text-center text-[11px] text-slate-400">
        Prepared with sincere family values.
      </div>
    </div>
  );
};
