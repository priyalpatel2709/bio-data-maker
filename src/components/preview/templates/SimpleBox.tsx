import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { getLocalizedDocText } from '../../../i18n/translations';

interface TemplateProps {
  document: BiodataDocument;
}

export const SimpleBox: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);
  const docLang = styling.language || document.language || 'en';
  const titleText = getLocalizedDocText('documentTitle', docLang);

  return (
    <div className="w-full h-full p-8 sm:p-10 relative flex flex-col justify-between">
      {/* Outer Clean Box Border with Corner Notches (BiodataMaker signature style) */}
      <div
        className="absolute inset-5 pointer-events-none rounded-xl"
        style={{
          border: `2px solid ${styling.primaryColor}`,
        }}
      >
        {/* Subtle decorative inner line */}
        <div
          className="absolute inset-1.5 rounded-lg pointer-events-none"
          style={{
            border: `1px solid ${styling.accentColor}55`,
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-3">
        {/* Top Header */}
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
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest"
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
            <div className="flex items-center justify-center gap-2 mt-2 mb-1">
              <span
                className="h-[2px] w-16 sm:w-24 rounded-full"
                style={{ backgroundColor: styling.primaryColor }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: styling.accentColor }}
              >
                ✦
              </span>
              <span
                className="h-[2px] w-16 sm:w-24 rounded-full"
                style={{ backgroundColor: styling.primaryColor }}
              />
            </div>
          )}
        </div>

        {/* Profile Photo if enabled */}
        {styling.showPhoto && (
          <div className="flex justify-end mb-6 mr-2">
            <DocumentPhoto photoUrl={photoUrl} styling={styling} className="shadow-sm" />
          </div>
        )}

        {/* Sections in Clean Boxed Table Format */}
        <div className="space-y-6">
          {visibleSections.map((section) => {
            const visibleFields = section.fields.filter((f) => f.visible);
            if (visibleFields.length === 0) return null;

            return (
              <div key={section.id} className="space-y-2">
                {/* Section Header with Kumkum Shaded Banner */}
                <div
                  className="px-3 py-1.5 rounded-md flex items-center justify-between"
                  style={{
                    backgroundColor: `${styling.primaryColor}14`,
                    borderLeft: `4px solid ${styling.primaryColor}`,
                  }}
                >
                  <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                    style={{
                      color: styling.primaryColor,
                      fontFamily: styling.fontFamilyHeading,
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Table Fields with Clear Colon Alignment */}
                <div
                  className={`grid ${
                    styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  } gap-x-8 gap-y-1.5 px-2`}
                >
                  {visibleFields.map((field) => {
                    const isDob =
                      field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
                    const calculatedAge = isDob ? calculateAge(field.value) : null;
                    const displayValue = field.type === 'date' ? formatDate(field.value) : field.value;

                    return (
                      <div
                        key={field.id}
                        className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-slate-200 ${
                          field.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <span
                          className="font-semibold text-slate-700 w-2/5 shrink-0 pr-2 flex items-center justify-between"
                          style={{ fontFamily: styling.fontFamilyBody }}
                        >
                          <span>{field.label}</span>
                          <span className="text-slate-400 font-normal">:</span>
                        </span>
                        <span
                          className="text-slate-900 font-medium pl-2 flex-1 leading-relaxed"
                          style={{ fontFamily: styling.fontFamilyBody }}
                        >
                          {displayValue || '—'}
                          {calculatedAge !== null && (
                            <span className="ml-1.5 text-xs text-rose-700 font-bold">
                              ({calculatedAge} Years)
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

      {/* Footer */}
      <div className="relative z-10 text-center pt-6 text-[11px] text-slate-400 border-t border-slate-200/80">
        Biodata Format • Simple & Clean
      </div>
    </div>
  );
};
