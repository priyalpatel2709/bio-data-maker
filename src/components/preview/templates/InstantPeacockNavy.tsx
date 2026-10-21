import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';

interface TemplateProps {
  document: BiodataDocument;
}

export const InstantPeacockNavy: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  const primary = styling.primaryColor || '#0F2C59';
  const accent = styling.accentColor || '#D4AF37';

  return (
    <div className="w-full h-full p-8 sm:p-11 relative flex flex-col justify-between">
      {/* Symmetrical Royal Navy & Gold Arch Frame */}
      <div
        className="absolute inset-4 sm:inset-5 pointer-events-none rounded-xl"
        style={{
          border: `2px solid ${primary}`,
        }}
      >
        <div
          className="absolute inset-1 rounded-lg pointer-events-none"
          style={{
            border: `1px solid ${accent}`,
          }}
        />

        {/* Top Center Arch Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-white flex items-center gap-1.5">
          <span style={{ color: accent }}>✦</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>
            ROYAL HERITAGE
          </span>
          <span style={{ color: accent }}>✦</span>
        </div>
      </div>

      <div className="relative z-10 px-3 py-2">
        {/* Header Emblem */}
        <HeaderEmblem
          symbol={styling.headerSymbol || 'ganesha'}
          primaryColor={primary}
          accentColor={accent}
        />

        {/* Main Document Title */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest"
            style={{
              color: primary,
              fontFamily: styling.fontFamilyHeading,
            }}
          >
            MARRIAGE BIODATA
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1.5 mb-2">
            <span className="h-[1.5px] w-16 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-xs font-bold" style={{ color: primary }}>
              ❖
            </span>
            <span className="h-[1.5px] w-16 rounded-full" style={{ backgroundColor: accent }} />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {visibleSections.map((section, sectionIdx) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            // Determine if this section houses the photo
            const personalIdx = visibleSections.findIndex(
              (s) => s.key === 'personal' || s.title.toLowerCase().includes('personal')
            );
            const isPhotoSection = styling.showPhoto && sectionIdx === (personalIdx !== -1 ? personalIdx : 0);

            const renderFieldRow = (field: typeof visibleFields[0], isSpanFull = false) => {
              const isDob =
                field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
              const calculatedAge = isDob ? calculateAge(field.value) : null;
              const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

              return (
                <div
                  key={field.id}
                  className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-slate-200 ${
                    isSpanFull || field.type === 'textarea' ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span
                    className="font-bold text-slate-800 w-2/5 shrink-0 pr-2 flex items-center justify-between"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    <span>{field.label}</span>
                    <span className="text-blue-900 font-bold">:</span>
                  </span>
                  <span
                    className="text-slate-900 font-medium pl-2 flex-1 leading-relaxed"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    {displayValue || '—'}
                    {calculatedAge !== null && (
                      <span className="ml-1.5 text-xs font-bold text-blue-900">
                        ({calculatedAge} Years)
                      </span>
                    )}
                  </span>
                </div>
              );
            };

            return (
              <div key={section.id} className="space-y-2.5">
                {/* Header Banner */}
                <div
                  className="px-3.5 py-1.5 rounded-lg flex items-center justify-between shadow-xs"
                  style={{
                    backgroundColor: primary,
                  }}
                >
                  <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white"
                    style={{ fontFamily: styling.fontFamilyHeading }}
                  >
                    {section.title}
                  </h2>
                  <span className="text-xs" style={{ color: accent }}>
                    ✦
                  </span>
                </div>

                {/* Section Content: Side-by-side if photo section, otherwise full width */}
                {isPhotoSection ? (
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start px-2">
                    {/* Fields taking up the remaining space */}
                    <div className="flex-1 min-w-0 space-y-1 w-full">
                      {visibleFields.map((field) => renderFieldRow(field))}
                    </div>

                    {/* Profile Photo on the side */}
                    <div className="shrink-0 self-start mt-0.5">
                      <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-md" />
                    </div>
                  </div>
                ) : (
                  /* Table Fields across 100% full width */
                  <div
                    className={`grid ${
                      styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                    } gap-x-8 gap-y-1.5 px-2 w-full`}
                  >
                    {visibleFields.map((field) => renderFieldRow(field))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pt-6 text-[11px] text-slate-400 border-t border-slate-200">
        Heritage Matrimonial Dossier
      </div>
    </div>
  );
};
