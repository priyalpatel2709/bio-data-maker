import React from 'react';
import { BiodataDocument } from '../../../types/biodata';
import { DocumentPhoto } from '../DocumentPhoto';
import { calculateAge, formatDate } from '../../../utils/calculateAge';

interface TemplateProps {
  document: BiodataDocument;
}

export const Professional: React.FC<TemplateProps> = ({ document }) => {
  const { styling, sections, photoUrl } = document;

  // Split into sidebar sections (contact, vitals) and main sections (education, career, additional)
  const contactSec = sections.find((s) => s.key === 'contact');
  const personalSec = sections.find((s) => s.key === 'personal');
  const mainSections = sections.filter(
    (s) => s.key !== 'contact' && s.key !== 'personal' && s.visible
  );

  const candidateName =
    personalSec?.fields.find((f) => f.id.includes('name'))?.value || document.title;

  return (
    <div className="w-full h-full flex flex-col sm:flex-row min-h-[297mm]">
      {/* Left Sidebar */}
      <div
        className="w-full sm:w-[32%] p-6 sm:p-8 text-white flex flex-col justify-between"
        style={{ backgroundColor: styling.primaryColor }}
      >
        <div className="space-y-6">
          {/* Portrait */}
          {styling.showPhoto && (
            <div className="flex justify-center">
              <DocumentPhoto
                photoUrl={photoUrl}
                styling={{
                  ...styling,
                  photoBorder: true,
                  photoShape: 'square',
                }}
                className="w-32 h-40 border-2 border-white/80 shadow-md"
              />
            </div>
          )}

          {/* Sidebar Personal Vitals */}
          {personalSec && personalSec.visible && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 border-b border-white/20 pb-1">
                Personal Vitals
              </h3>
              <div className="space-y-2 text-xs">
                {personalSec.fields
                  .filter((f) => f.visible)
                  .map((f) => {
                    const isDob = f.id.includes('dob');
                    const age = isDob ? calculateAge(f.value) : null;
                    return (
                      <div key={f.id} className="border-b border-white/10 pb-1">
                        <span className="text-[10px] uppercase font-bold text-white/60 block">
                          {f.label}
                        </span>
                        <span className="font-medium text-white/95">
                          {f.type === 'date' ? formatDate(f.value) : f.value || '—'}
                          {age !== null && ` (${age} yrs)`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Sidebar Contact Info */}
          {contactSec && contactSec.visible && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 border-b border-white/20 pb-1">
                Contact Details
              </h3>
              <div className="space-y-2 text-xs">
                {contactSec.fields
                  .filter((f) => f.visible)
                  .map((f) => (
                    <div key={f.id} className="border-b border-white/10 pb-1">
                      <span className="text-[10px] uppercase font-bold text-white/60 block">
                        {f.label}
                      </span>
                      <span className="font-medium text-white/95 leading-relaxed">
                        {f.value || '—'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 text-[10px] text-white/50 tracking-wider uppercase">
          Confidential Dossier
        </div>
      </div>

      {/* Right Main Body */}
      <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="pb-6 border-b border-slate-200">
            <span
              className="text-xs font-bold uppercase tracking-widest block mb-1"
              style={{ color: styling.accentColor }}
            >
              Professional Biodata
            </span>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900"
              style={{
                fontFamily: styling.fontFamilyHeading,
                color: styling.primaryColor,
              }}
            >
              {candidateName}
            </h1>
          </div>

          {/* Main Sections (Education, Career, Family, Additional) */}
          <div className="space-y-6 mt-6">
            {mainSections.map((sec) => {
              const visibleFields = sec.fields.filter((f) => f.visible);
              if (visibleFields.length === 0) return null;

              return (
                <div key={sec.id} className="space-y-2.5">
                  <div
                    className="pb-1 border-b-2"
                    style={{ borderColor: styling.accentColor }}
                  >
                    <h2
                      className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900"
                      style={{
                        fontFamily: styling.fontFamilyHeading,
                        color: styling.primaryColor,
                      }}
                    >
                      {sec.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {visibleFields.map((f) => (
                      <div
                        key={f.id}
                        className={`text-xs sm:text-sm ${
                          f.type === 'textarea' ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {f.label}
                        </span>
                        <span className="text-slate-900 font-medium leading-relaxed">
                          {f.type === 'date' ? formatDate(f.value) : f.value || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-8 text-right text-[11px] text-slate-400">
          Executive Portfolio
        </div>
      </div>
    </div>
  );
};
