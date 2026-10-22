import React from 'react';
import { ResumeDocument } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface TemplateProps {
  resume: ResumeDocument;
}

export const ExecutiveCorporateTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { contact, summary, experience, education, skillCategories, projects, certifications, customSections, styling } = resume;

  const primaryColor = styling.primaryColor || '#1E3A8A';
  const textColor = styling.textColor || '#1E293B';
  const isCompact = styling.fontSize === 'compact';

  const isLetter = styling.paperSize === 'letter';
  const docWidth = isLetter ? '816px' : '794px';
  const docMinHeight = isLetter ? '1056px' : '1123px';

  const paddingClass =
    styling.pageMargin === 'compact'
      ? 'p-6'
      : styling.pageMargin === 'spacious'
      ? 'p-12'
      : 'p-9';

  const fontStyle = {
    fontFamily: `${styling.fontFamily || 'Merriweather'}, Georgia, serif`,
    color: textColor,
    width: docWidth,
    minHeight: docMinHeight,
    boxSizing: 'border-box' as const,
  };

  const isSinglePage = styling.pageSplitAt === 'single-page';
  const splitAt = styling.pageSplitAt || 'auto';
  const hasPage2 =
    !isSinglePage &&
    (projects.length > 0 || education.length > 0 || certifications.length > 0 || customSections.length > 0);
  const totalPages = hasPage2 ? 2 : 1;

  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b pb-2.5 mb-4 flex flex-row items-center justify-between" style={{ borderColor: primaryColor }}>
          <div>
            <span className="font-serif font-bold text-lg uppercase text-slate-900">{contact.fullName}</span>
            {contact.jobTitle && (
              <span className="font-sans text-xs text-slate-600 ml-2 font-semibold">| {contact.jobTitle}</span>
            )}
          </div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header className="text-center border-b pb-4 mb-4" style={{ borderColor: primaryColor }}>
        <h1
          className="text-3xl font-serif font-bold tracking-normal uppercase"
          style={{ color: primaryColor }}
        >
          {contact.fullName || 'Your Full Name'}
        </h1>
        {contact.jobTitle && (
          <p className="text-sm font-sans font-semibold tracking-wider uppercase text-slate-600 mt-0.5">
            {contact.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 font-sans text-xs text-slate-600">
          {contact.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {contact.location}</span>}
          {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>}
          {contact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>}
          {contact.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {contact.linkedin}</span>}
          {contact.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {contact.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        <h2
          className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-1.5"
          style={{ color: primaryColor, borderColor: '#CBD5E1' }}
        >
          Executive Summary
        </h2>
        <p className={`font-serif text-slate-700 leading-relaxed text-justify ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {summary}
        </p>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        <h2
          className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
          style={{ color: primaryColor, borderColor: '#CBD5E1' }}
        >
          Professional Experience
        </h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div>
                  <span className="font-serif font-bold text-sm text-slate-900">{exp.position}</span>
                  <span className="font-serif italic text-sm text-slate-700 ml-1.5">| {exp.company}</span>
                </div>
                <span className="font-sans text-xs font-medium text-slate-500 shrink-0">
                  {exp.location ? `${exp.location} | ` : ''}
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 font-serif text-slate-700 text-xs sm:text-sm">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (skillCategories.length === 0) return null;
    return (
      <section>
        <h2
          className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-1.5"
          style={{ color: primaryColor, borderColor: '#CBD5E1' }}
        >
          Core Competencies & Expertise
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="text-xs">
              <span className="font-serif font-bold text-slate-900">{cat.categoryName}: </span>
              <span className="font-serif text-slate-700">{cat.skills.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <section>
        <h2
          className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
          style={{ color: primaryColor, borderColor: '#CBD5E1' }}
        >
          Key Initiatives & Projects
        </h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <span className="font-serif font-bold text-sm text-slate-900">{proj.name}</span>
                {proj.roleOrSubtitle && (
                  <span className="font-serif italic text-xs text-slate-600">{proj.roleOrSubtitle}</span>
                )}
              </div>
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 font-serif text-slate-700 text-xs">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <section>
        <h2
          className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
          style={{ color: primaryColor, borderColor: '#CBD5E1' }}
        >
          Education & Academic Credentials
        </h2>
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div>
                  <span className="font-serif font-bold text-sm text-slate-900">
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="font-serif text-sm text-slate-700 ml-1.5">— {edu.institution}</span>
                </div>
                <span className="font-sans text-xs font-medium text-slate-500 shrink-0">
                  {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                </span>
              </div>
              {edu.gradeOrGpa && (
                <p className="font-serif text-xs italic text-slate-600 mt-0.5">{edu.gradeOrGpa}</p>
              )}
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 font-serif text-xs text-slate-700">
                  {edu.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <section>
        <h2
          className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-1.5"
          style={{ color: primaryColor, borderColor: '#CBD5E1' }}
        >
          Certifications & Affiliations
        </h2>
        <div className="space-y-1 text-xs font-serif text-slate-700">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex flex-row items-baseline justify-between gap-2">
              <span>
                <strong>{cert.name}</strong> — {cert.issuer}
              </span>
              {cert.issueDate && <span className="font-sans text-slate-500">{cert.issueDate}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomSections = () => {
    const visibleCustom = customSections.filter((cs) => cs.visible);
    if (visibleCustom.length === 0) return null;
    return (
      <>
        {visibleCustom.map((cs) => (
          <section key={cs.id}>
            <h2
              className="font-sans text-xs font-bold uppercase tracking-widest border-b pb-1 mb-1.5"
              style={{ color: primaryColor, borderColor: '#CBD5E1' }}
            >
              {cs.title}
            </h2>
            <div className="space-y-1 text-xs font-serif text-slate-700">
              {cs.items.map((item) => (
                <div key={item.id}>
                  <strong>{item.title}</strong>
                  {item.subtitle && <span> — {item.subtitle}</span>}
                  {item.description && <p className="mt-0.5 text-slate-600">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  };

  const renderFooter = (pageNumber: number) => {
    if (!styling.showPageNumbers) return null;
    return (
      <footer className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between font-sans text-[11px] text-slate-400 font-medium">
        <span>{contact.fullName} — Executive Resume</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </footer>
    );
  };

  if (!hasPage2) {
    return (
      <div id="resume-preview-document" className="flex flex-col gap-8">
        <div
          id="resume-page-1"
          style={fontStyle}
          className={`resume-page-sheet bg-white ${paddingClass} text-slate-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
        >
          <div className="space-y-4">
            {renderHeader(false)}
            {renderSummary()}
            {renderExperience()}
            {renderSkills()}
            {renderProjects()}
            {renderEducation()}
            {renderCertifications()}
            {renderCustomSections()}
          </div>
          {renderFooter(1)}
        </div>
      </div>
    );
  }

  return (
    <div id="resume-preview-document" className="flex flex-col gap-8">
      {/* PAGE 1 */}
      <div
        id="resume-page-1"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-4">
          {renderHeader(false)}
          {renderSummary()}
          {renderExperience()}
          {splitAt !== 'skills' && renderSkills()}
        </div>
        {renderFooter(1)}
      </div>

      {/* PAGE 2 */}
      <div
        id="resume-page-2"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-4">
          {renderHeader(true)}
          {splitAt === 'skills' && renderSkills()}
          {renderProjects()}
          {renderEducation()}
          {renderCertifications()}
          {renderCustomSections()}
        </div>
        {renderFooter(2)}
      </div>
    </div>
  );
};
