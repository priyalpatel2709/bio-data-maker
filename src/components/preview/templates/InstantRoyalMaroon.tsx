import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { HeaderEmblem } from '../HeaderEmblem';
import { calculateAge, formatDate } from '../../../utils/calculateAge';
import { getLocalizedDocText } from '../../../i18n/translations';

interface TemplateProps {
  document: BiodataDocument;
}

export const InstantRoyalMaroon: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;
  const visibleSections = sections.filter((s) => s.visible);

  const primary = styling.primaryColor || '#7A121D';
  const accent = styling.accentColor || '#D4AF37';
  const docLang = styling.language || document.language || 'en';
  const titleText = getLocalizedDocText('documentTitle', docLang);
  const yearsText = getLocalizedDocText('years', docLang);

  return (
    <div className="w-full h-full p-8 sm:p-11 relative flex flex-col justify-between">
      {/* InstantBiodata Signature Double Frame with Ornate Gold Corners */}
      <div
        className="absolute inset-4 sm:inset-5 pointer-events-none rounded-xl"
        style={{
          border: `2.5px solid ${primary}`,
        }}
      >
        {/* Inner Gold Hairline Frame */}
        <div
          className="absolute inset-1.5 rounded-lg pointer-events-none"
          style={{
            border: `1.5px solid ${accent}`,
          }}
        />

        {/* Top-Left Ornate Corner Filigree */}
        <div className="absolute top-1 left-1 w-6 h-6 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 22V6C2 3.79086 3.79086 2 6 2H22M2 14C5 14 8 11 8 8C8 5 5 2 2 2"
              stroke={accent}
              strokeWidth="1.5"
            />
            <circle cx="5" cy="5" r="2" fill={primary} />
          </svg>
        </div>

        {/* Top-Right Ornate Corner Filigree */}
        <div className="absolute top-1 right-1 w-6 h-6 pointer-events-none -scale-x-100">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 22V6C2 3.79086 3.79086 2 6 2H22M2 14C5 14 8 11 8 8C8 5 5 2 2 2"
              stroke={accent}
              strokeWidth="1.5"
            />
            <circle cx="5" cy="5" r="2" fill={primary} />
          </svg>
        </div>

        {/* Bottom-Left Ornate Corner Filigree */}
        <div className="absolute bottom-1 left-1 w-6 h-6 pointer-events-none -scale-y-100">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 22V6C2 3.79086 3.79086 2 6 2H22M2 14C5 14 8 11 8 8C8 5 5 2 2 2"
              stroke={accent}
              strokeWidth="1.5"
            />
            <circle cx="5" cy="5" r="2" fill={primary} />
          </svg>
        </div>

        {/* Bottom-Right Ornate Corner Filigree */}
        <div className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none rotate-180">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 22V6C2 3.79086 3.79086 2 6 2H22M2 14C5 14 8 11 8 8C8 5 5 2 2 2"
              stroke={accent}
              strokeWidth="1.5"
            />
            <circle cx="5" cy="5" r="2" fill={primary} />
          </svg>
        </div>
      </div>

      <div className="relative z-10 px-3 py-2">
        {/* Religious/Cultural Header Emblem */}
        <HeaderEmblem
          symbol={styling.headerSymbol || 'ganesha'}
          customSymbol={styling.customHeaderSymbol}
          customText={styling.customHeaderText}
          showEmblem={styling.showEmblem !== false}
          language={docLang}
          primaryColor={primary}
          accentColor={accent}
        />

        {/* Main Document Title */}
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
          {/* Gold Gradient Line */}
          <div className="flex items-center justify-center gap-2 mt-1.5 mb-2">
            <div
              className="h-[1.5px] w-20 sm:w-28 bg-gradient-to-r from-transparent to-amber-500"
              style={{ backgroundColor: accent }}
            />
            <span className="text-xs" style={{ color: accent }}>
              ❖
            </span>
            <div
              className="h-[1.5px] w-20 sm:w-28 bg-gradient-to-l from-transparent to-amber-500"
              style={{ backgroundColor: accent }}
            />
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
                  className={`flex items-baseline py-1 text-xs sm:text-sm border-b border-dashed border-amber-900/15 ${isSpanFull || field.type === 'textarea' ? 'sm:col-span-2' : ''
                    }`}
                >
                  <span
                    className="font-bold text-slate-800 w-2/5 shrink-0 pr-2 flex items-center justify-between"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    <span>{field.label}</span>
                    <span className="text-amber-700 font-semibold">:</span>
                  </span>
                  <span
                    className="text-slate-900 font-medium pl-2 flex-1 leading-relaxed"
                    style={{ fontFamily: styling.fontFamilyBody }}
                  >
                    {displayValue || '—'}
                    {calculatedAge !== null && (
                      <span className="ml-1.5 text-xs font-bold text-amber-800">
                        ({calculatedAge} {yearsText})
                      </span>
                    )}
                  </span>
                </div>
              );
            };

            return (
              <div key={section.id} className="space-y-2.5">
                {/* InstantBiodata Ribbon Header */}
                <div className="flex items-center gap-3">
                  <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded text-white shadow-xs"
                    style={{
                      backgroundColor: primary,
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
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
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
                  /* Grid Fields with Perfect Tabular Alignment across 100% full width */
                  <div
                    className={`grid ${styling.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                      } gap-x-8 gap-y-1.5 px-1`}
                  >
                    {visibleFields.map((field) => renderFieldRow(field))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};
