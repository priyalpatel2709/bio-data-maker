import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { getLocalizedDocText } from '../../../i18n/translations';
import toranBg from '../../../assets/templates/marigold-toran-bg.png';

interface TemplateProps {
  document: BiodataDocument;
}

export const MarigoldToran: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  const primary = styling.primaryColor || '#963806';
  const accent = styling.accentColor || '#D97706';
  const docLang = styling.language || document.language || 'en';
  const titleText = getLocalizedDocText('documentTitle', docLang);
  const yearsText = getLocalizedDocText('years', docLang);
  const blessingsText = getLocalizedDocText('blessings', docLang);

  const personalSection = sections.find(
    (s) => s.key === 'personal' || s.title.toLowerCase().includes('personal')
  );
  const fullNameField = personalSection?.fields.find(
    (f) => f.id === 'fullName' || f.label.toLowerCase().includes('name')
  );
  const candidateName = fullNameField?.value;

  return (
    <div className="w-full h-full p-6 sm:p-9 pt-12 sm:pt-14 relative flex flex-col justify-between overflow-hidden bg-[#FAF3E0]">
      {/* High-fidelity Marigold Toran & Haldi Texture Artwork */}
      <img
        src={toranBg}
        alt="Marigold Toran Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
      />

      <div className="relative z-10">
        {/* Clean, unboxed header directly below the authentic marigold toran artwork */}
        <div className="max-w-md mx-auto text-center pt-1 pb-2 px-4 mb-4">
          <HeaderEmblem
            symbol={styling.headerSymbol || 'ganesha'}
            customSymbol={styling.customHeaderSymbol}
            customText={styling.customHeaderText}
            showEmblem={styling.showEmblem !== false}
            language={docLang}
            primaryColor={primary}
            accentColor={accent}
          />

          {styling.showDocumentTitle !== false && (styling.customDocumentTitle || titleText) && (
            <h1
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest mt-1"
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

          {candidateName && (
            <div
              className="text-base sm:text-lg font-bold tracking-wide mt-0.5"
              style={{ color: primary, fontFamily: styling.fontFamilyHeading }}
            >
              {candidateName}
            </div>
          )}

          {(styling.showDocumentTitle !== false || styling.showEmblem !== false || candidateName) && (
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <div
                className="h-[1.5px] w-20 bg-gradient-to-r from-transparent to-amber-500"
                style={{ backgroundColor: accent }}
              />
              <span className="text-xs">🌼</span>
              <div
                className="h-[1.5px] w-20 bg-gradient-to-l from-transparent to-amber-500"
                style={{ backgroundColor: accent }}
              />
            </div>
          )}
        </div>

        {/* Sections Card with Haldi Warm Ivory Backing */}
        <div className="bg-[#FFFDF6]/90 backdrop-blur-xs p-4 sm:p-6 rounded-xl shadow-xs border border-amber-600/15 space-y-5">
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
                  className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-amber-700/15 ${
                    isSpanFull || field.type === 'textarea' ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span
                    className="font-bold text-stone-800 w-2/5 shrink-0 pr-2 flex items-center justify-between"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    <span>{field.label}</span>
                    <span className="text-amber-700 font-semibold">:</span>
                  </span>
                  <span
                    className="text-stone-900 font-medium pl-2 flex-1 leading-relaxed"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    {displayValue || '—'}
                    {calculatedAge !== null && (
                      <span className="ml-1.5 text-xs font-bold text-amber-700">
                        ({calculatedAge} {yearsText})
                      </span>
                    )}
                  </span>
                </div>
              );
            };

            return (
              <div key={section.id} className="space-y-2">
                {/* Marigold Festivity Section Header */}
                <div className="flex items-center gap-2.5 pb-1 border-b border-amber-600/15">
                  <span className="text-xs">🏵️</span>
                  <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950"
                    style={{
                      fontFamily: styling.fontFamilyHeading,
                    }}
                  >
                    {section.title}
                  </h2>
                  <div
                    className="flex-1 h-[1.5px]"
                    style={{
                      background: `linear-gradient(to right, ${accent}, transparent)`,
                    }}
                  />
                </div>

                {/* Section Content: Side-by-side if photo section, otherwise full width */}
                {isPhotoSection ? (
                  styling.photoPosition === 'top-center' ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div
                          className="p-1 rounded-2xl shadow-md bg-white shrink-0"
                          style={{ border: `2px solid ${accent}` }}
                        >
                          <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-xs" />
                        </div>
                      </div>
                      <div
                        className={`grid ${
                          styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                        } gap-x-8 gap-y-1 px-1 w-full`}
                      >
                        {visibleFields.map((field) => renderFieldRow(field))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col ${
                        styling.photoPosition === 'top-left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
                      } gap-4 sm:gap-6 items-start`}
                    >
                      {/* Fields taking up the remaining space */}
                      <div className="flex-1 min-w-0 space-y-1 w-full">
                        {visibleFields.map((field) => renderFieldRow(field))}
                      </div>

                      {/* Profile Photo on the side */}
                      <div className="shrink-0 self-start mt-0.5">
                        <div
                          className="p-1 rounded-2xl shadow-md bg-white"
                          style={{ border: `2px solid ${accent}` }}
                        >
                          <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-xs" />
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Subsequent sections expand to 100% full width */
                  <div
                    className={`grid ${
                      styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                    } gap-x-8 gap-y-1 px-1 w-full`}
                  >
                    {visibleFields.map((field) => renderFieldRow(field))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Traditional Footer */}
      <div className="relative z-10 text-center pt-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-[1px] w-12 bg-amber-600/30" />
          <span className="text-[10px] tracking-widest text-amber-900/60 uppercase">
            {blessingsText}
          </span>
          <div className="h-[1px] w-12 bg-amber-600/30" />
        </div>
      </div>
    </div>
  );
};
