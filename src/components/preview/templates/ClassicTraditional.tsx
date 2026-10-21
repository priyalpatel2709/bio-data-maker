import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { getLocalizedDocText } from '../../../i18n/translations';

interface TemplateProps {
  document: BiodataDocument;
}

export const ClassicTraditional: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);
  const docLang = styling.language || document.language || 'en';
  const titleText = getLocalizedDocText('documentTitle', docLang);
  const mantraText = getLocalizedDocText('mantra', docLang);
  const yearsText = getLocalizedDocText('years', docLang);

  return (
    <div className="w-full h-full p-8 sm:p-10 relative flex flex-col justify-between">
      {/* Decorative Ornate Double Border */}
      {styling.borderStyle !== 'none' && (
        <div
          className="absolute inset-4 sm:inset-5 pointer-events-none"
          style={{
            border: `3px solid ${styling.primaryColor}`,
            boxShadow: `inset 0 0 0 3px ${styling.accentColor}`,
          }}
        >
          {/* Ornate corner squares */}
          <div
            className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45"
            style={{ backgroundColor: styling.accentColor }}
          />
          <div
            className="absolute -top-1.5 -right-1.5 w-3 h-3 rotate-45"
            style={{ backgroundColor: styling.accentColor }}
          />
          <div
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rotate-45"
            style={{ backgroundColor: styling.accentColor }}
          />
          <div
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45"
            style={{ backgroundColor: styling.accentColor }}
          />
        </div>
      )}

      <div>
        {/* Traditional Auspicious Header */}
        <div className="text-center mb-6">
          <HeaderEmblem
            symbol={styling.headerSymbol || 'om'}
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
            <div className="flex items-center justify-center gap-3 my-2">
              <span
                className="h-[1.5px] w-12 sm:w-20"
                style={{ backgroundColor: styling.accentColor }}
              />
              <span
                className="w-2 h-2 rotate-45"
                style={{ backgroundColor: styling.primaryColor }}
              />
              <span
                className="h-[1.5px] w-12 sm:w-20"
                style={{ backgroundColor: styling.accentColor }}
              />
            </div>
          )}
        </div>

        {/* Sections Content */}
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
              const isDob = field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
              const calculatedAge = isDob ? calculateAge(field.value) : null;
              const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

              return (
                <div
                  key={field.id}
                  className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-slate-200/80 ${
                    isSpanFull || field.type === 'textarea' ? 'md:col-span-2' : ''
                  }`}
                >
                  <span
                    className="font-semibold w-2/5 shrink-0 pr-2"
                    style={{
                      color: styling.primaryColor,
                      fontFamily: styling.fontFamilyBody,
                    }}
                  >
                    {field.label}:
                  </span>
                  <span
                    className="text-slate-800 flex-1 leading-relaxed"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    {displayValue || '—'}
                    {calculatedAge !== null && (
                      <span className="ml-1.5 text-xs text-slate-500 font-medium">
                        ({calculatedAge} {yearsText})
                      </span>
                    )}
                  </span>
                </div>
              );
            };

            return (
              <div key={section.id} className="space-y-3">
                {/* Section Title Banner */}
                <div
                  className="flex items-center justify-between pb-1 border-b-2"
                  style={{ borderColor: styling.accentColor }}
                >
                  <h2
                    className="text-base sm:text-lg font-bold uppercase tracking-wide"
                    style={{
                      color: styling.primaryColor,
                      fontFamily: styling.fontFamilyHeading,
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Section Content: Side-by-side if photo section, otherwise full width */}
                {isPhotoSection ? (
                  styling.photoPosition === 'top-center' ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <DocumentPhoto photoUrl={photoUrl} styling={styling} />
                      </div>
                      <div
                        className={`grid ${
                          styling.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                        } gap-x-6 gap-y-2 w-full`}
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
                        <DocumentPhoto photoUrl={photoUrl} styling={styling} />
                      </div>
                    </div>
                  )
                ) : (
                  /* Fields Table Grid across 100% full width */
                  <div
                    className={`grid ${
                      styling.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                    } gap-x-6 gap-y-2 w-full`}
                  >
                    {visibleFields.map((field) => renderFieldRow(field))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer subtle blessing / note */}
      {/* <div className="text-center pt-8 text-[11px] text-slate-500 italic border-t border-slate-200/60 mt-8">
        Crafted with dignity and respect.
      </div> */}
    </div>
  );
};
