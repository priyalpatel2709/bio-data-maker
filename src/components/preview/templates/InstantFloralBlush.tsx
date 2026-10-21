import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { getLocalizedDocText } from '../../../i18n/translations';

interface TemplateProps {
  document: BiodataDocument;
}

export const InstantFloralBlush: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  const primary = styling.primaryColor || '#9B4A5A';
  const accent = styling.accentColor || '#D48B96';
  const docLang = styling.language || document.language || 'en';
  const titleText = getLocalizedDocText('documentTitle', docLang);

  return (
    <div className="w-full h-full p-8 sm:p-11 relative flex flex-col justify-between">
      {/* Delicate Botanical Vine Border */}
      <div
        className="absolute inset-4 sm:inset-5 pointer-events-none rounded-2xl"
        style={{
          border: `1.5px solid ${accent}`,
        }}
      >
        {/* Soft botanical corner accents */}
        <div className="absolute top-2 left-2 text-rose-300">🌿</div>
        <div className="absolute top-2 right-2 text-rose-300 -scale-x-100">🌿</div>
        <div className="absolute bottom-2 left-2 text-rose-300 -scale-y-100">🌿</div>
        <div className="absolute bottom-2 right-2 text-rose-300 rotate-180">🌿</div>
      </div>

      <div className="relative z-10 px-3 py-2">
        {/* Header Emblem */}
        <HeaderEmblem
          symbol={styling.headerSymbol || 'ganesha'}
          customSymbol={styling.customHeaderSymbol}
          customText={styling.customHeaderText}
          showEmblem={styling.showEmblem !== false}
          language={docLang}
          primaryColor={primary}
          accentColor={accent}
        />

        {/* Title */}
        <div className="text-center mb-6">
          {styling.showDocumentTitle !== false && (styling.customDocumentTitle || titleText) && (
            <h1
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest"
              style={{
                color: primary,
                fontFamily: styling.fontFamilyHeading,
              }}
            >
              {styling.customDocumentTitle !== undefined && styling.customDocumentTitle !== ''
                ? styling.customDocumentTitle
                : titleText}
            </h1>
          )}
          {(styling.showDocumentTitle !== false || styling.showEmblem !== false) && (
            <div className="flex items-center justify-center gap-2 mt-1 mb-2">
              <span className="h-[1px] w-16" style={{ backgroundColor: accent }} />
              <span className="text-xs">🌸</span>
              <span className="h-[1px] w-16" style={{ backgroundColor: accent }} />
            </div>
          )}
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
                  className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-rose-200/80 ${
                    isSpanFull || field.type === 'textarea' ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span
                    className="font-bold text-slate-700 w-2/5 shrink-0 pr-2 flex items-center justify-between"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    <span>{field.label}</span>
                    <span className="text-rose-400 font-semibold">:</span>
                  </span>
                  <span
                    className="text-slate-900 font-medium pl-2 flex-1 leading-relaxed"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    {displayValue || '—'}
                    {calculatedAge !== null && (
                      <span className="ml-1.5 text-xs font-bold text-rose-700">
                        ({calculatedAge} Years)
                      </span>
                    )}
                  </span>
                </div>
              );
            };

            return (
              <div key={section.id} className="space-y-2.5">
                {/* Header */}
                <div
                  className="pb-1 border-b flex items-center justify-between"
                  style={{ borderColor: accent }}
                >
                  <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                    style={{
                      color: primary,
                      fontFamily: styling.fontFamilyHeading,
                    }}
                  >
                    {section.title}
                  </h2>
                  <span className="text-[10px]" style={{ color: accent }}>
                    ✦
                  </span>
                </div>

                {/* Section Content: Side-by-side if photo section, otherwise full width */}
                {isPhotoSection ? (
                  styling.photoPosition === 'top-center' ? (
                    <div className="space-y-4 px-2">
                      <div className="flex justify-center">
                        <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
                      </div>
                      <div
                        className={`grid ${
                          styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                        } gap-x-8 gap-y-1.5 w-full`}
                      >
                        {visibleFields.map((field) => renderFieldRow(field))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col ${
                        styling.photoPosition === 'top-left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
                      } gap-4 sm:gap-6 items-start px-2`}
                    >
                      {/* Fields taking up the remaining space */}
                      <div className="flex-1 min-w-0 space-y-1 w-full">
                        {visibleFields.map((field) => renderFieldRow(field))}
                      </div>

                      {/* Profile Photo on the side */}
                      <div className="shrink-0 self-start mt-0.5">
                        <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
                      </div>
                    </div>
                  )
                ) : (
                  /* Fields Table across 100% full width */
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
      <div className="relative z-10 text-center pt-6 text-[11px] text-slate-400 border-t border-rose-200/60">
        Graceful Matrimonial Biodata
      </div>
    </div>
  );
};
