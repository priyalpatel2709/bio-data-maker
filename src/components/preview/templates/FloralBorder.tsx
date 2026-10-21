import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { getLocalizedDocText } from '../../../i18n/translations';

interface TemplateProps {
  document: BiodataDocument;
}

export const FloralBorder: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);
  const docLang = styling.language || document.language || 'en';
  const titleText = getLocalizedDocText('documentTitle', docLang);
  const yearsText = getLocalizedDocText('years', docLang);

  return (
    <div className="w-full h-full p-8 sm:p-10 relative flex flex-col justify-between">
      {/* Decorative Floral Corner Frame */}
      <div
        className="absolute inset-4 sm:inset-5 pointer-events-none rounded-2xl"
        style={{
          border: `1.5px solid ${styling.primaryColor}88`,
        }}
      >
        {/* Top-Left Corner Floral Flourish */}
        <svg
          className="absolute -top-3 -left-3 w-10 h-10"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 25C5 13.9543 13.9543 5 25 5C18 7 12 12 10 19C9 22 7 24 5 25Z"
            fill={styling.primaryColor}
          />
          <circle cx="8" cy="8" r="3" fill={styling.accentColor} />
          <circle cx="16" cy="6" r="2" fill={styling.primaryColor} />
          <circle cx="6" cy="16" r="2" fill={styling.primaryColor} />
        </svg>

        {/* Top-Right Corner Floral Flourish */}
        <svg
          className="absolute -top-3 -right-3 w-10 h-10 -scale-x-100"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 25C5 13.9543 13.9543 5 25 5C18 7 12 12 10 19C9 22 7 24 5 25Z"
            fill={styling.primaryColor}
          />
          <circle cx="8" cy="8" r="3" fill={styling.accentColor} />
          <circle cx="16" cy="6" r="2" fill={styling.primaryColor} />
          <circle cx="6" cy="16" r="2" fill={styling.primaryColor} />
        </svg>

        {/* Bottom-Left Corner Floral Flourish */}
        <svg
          className="absolute -bottom-3 -left-3 w-10 h-10 -scale-y-100"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 25C5 13.9543 13.9543 5 25 5C18 7 12 12 10 19C9 22 7 24 5 25Z"
            fill={styling.primaryColor}
          />
          <circle cx="8" cy="8" r="3" fill={styling.accentColor} />
          <circle cx="16" cy="6" r="2" fill={styling.primaryColor} />
          <circle cx="6" cy="16" r="2" fill={styling.primaryColor} />
        </svg>

        {/* Bottom-Right Corner Floral Flourish */}
        <svg
          className="absolute -bottom-3 -right-3 w-10 h-10 rotate-180"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 25C5 13.9543 13.9543 5 25 5C18 7 12 12 10 19C9 22 7 24 5 25Z"
            fill={styling.primaryColor}
          />
          <circle cx="8" cy="8" r="3" fill={styling.accentColor} />
          <circle cx="16" cy="6" r="2" fill={styling.primaryColor} />
          <circle cx="6" cy="16" r="2" fill={styling.primaryColor} />
        </svg>
      </div>

      <div className="relative z-10 px-3 py-2">
        {/* Header with Floral Motif */}
        <div className="text-center mb-6">
          <HeaderEmblem
            symbol={styling.headerSymbol || 'ganesha'}
            customSymbol={styling.customHeaderSymbol}
            customText={styling.customHeaderText}
            showEmblem={styling.showEmblem !== false}
            language={docLang}
            primaryColor={styling.primaryColor}
            accentColor={styling.accentColor}
          />
          {styling.showDocumentTitle !== false && (styling.customDocumentTitle || titleText) && (
            <h1
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wider"
              style={{
                color: styling.primaryColor,
                fontFamily: styling.fontFamilyHeading,
              }}
            >
              {styling.customDocumentTitle !== undefined && styling.customDocumentTitle !== ''
                ? styling.customDocumentTitle
                : titleText}
            </h1>
          )}
          {(styling.showDocumentTitle !== false || styling.showEmblem !== false) && (
            <div className="flex items-center justify-center gap-3 mt-1.5 mb-3">
              <span
                className="h-[1px] w-14 sm:w-20"
                style={{ backgroundColor: styling.accentColor }}
              />
              <span className="text-sm" style={{ color: styling.primaryColor }}>
                🌸
              </span>
              <span
                className="h-[1px] w-14 sm:w-20"
                style={{ backgroundColor: styling.accentColor }}
              />
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {visibleSections.map((section, sectionIdx) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            const personalIdx = visibleSections.findIndex(
              (s) => s.key === 'personal' || s.title.toLowerCase().includes('personal')
            );
            const isPhotoSection = styling.showPhoto && sectionIdx === (personalIdx !== -1 ? personalIdx : 0);

            const renderFieldRow = (field: typeof visibleFields[0]) => {
              const isDob =
                field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
              const calculatedAge = isDob ? calculateAge(field.value) : null;
              const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

              return (
                <div
                  key={field.id}
                  className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-rose-100 ${
                    field.type === 'textarea' ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span
                    className="font-medium text-slate-700 w-2/5 shrink-0 pr-2 flex items-center justify-between"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    <span>{field.label}</span>
                    <span className="text-slate-300">:</span>
                  </span>
                  <span
                    className="text-slate-900 font-medium pl-2 flex-1 leading-relaxed"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    {displayValue || '—'}
                    {calculatedAge !== null && (
                      <span className="ml-1 text-xs text-rose-700 font-semibold">
                        ({calculatedAge} {yearsText})
                      </span>
                    )}
                  </span>
                </div>
              );
            };

            return (
              <div key={section.id} className="space-y-2.5">
                {/* Title */}
                <div
                  className="pb-1 border-b flex items-center justify-between"
                  style={{ borderColor: styling.accentColor }}
                >
                  <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-wide"
                    style={{
                      color: styling.primaryColor,
                      fontFamily: styling.fontFamilyHeading,
                    }}
                  >
                    {section.title}
                  </h2>
                  <span className="text-[10px]" style={{ color: styling.accentColor }}>
                    ❖
                  </span>
                </div>

                {/* Section Content: Side-by-side if photo section, otherwise full width */}
                {isPhotoSection ? (
                  styling.photoPosition === 'top-center' ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
                      </div>
                      <div
                        className={`grid ${
                          styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                        } gap-x-8 gap-y-1.5`}
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
                        <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
                      </div>
                    </div>
                  )
                ) : (
                  /* Table across 100% full width */
                  <div
                    className={`grid ${
                      styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                    } gap-x-8 gap-y-1.5`}
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
      <div className="relative z-10 text-center pt-6 text-[11px] text-slate-400 border-t border-rose-100/60">
        Biodata Format • Floral Elegance
      </div>
    </div>
  );
};
