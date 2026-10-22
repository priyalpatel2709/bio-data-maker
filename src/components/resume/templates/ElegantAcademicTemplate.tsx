import React from 'react';
import { ResumeDocument } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeDocument;
}

export const ElegantAcademicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { contact, summary, experience, education, skillCategories, projects, certifications, customSections, styling } = resume;

  const primaryColor = styling.primaryColor || '#7C2D12';

  const isLetter = styling.paperSize === 'letter';
  const docWidth = isLetter ? '816px' : '794px';
  const docMinHeight = isLetter ? '1056px' : '1123px';

  const paddingClass =
    styling.pageMargin === 'compact'
      ? 'p-6'
      : styling.pageMargin === 'spacious'
      ? 'p-12'
      : 'p-10';

  const fontStyle = {
    fontFamily: `${styling.fontFamily || 'Lora'}, Georgia, serif`,
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
        <header className="border-b border-stone-300 pb-2.5 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-serif font-semibold text-stone-900 text-sm">{contact.fullName}</span>
            {contact.jobTitle && <span className="text-stone-600 italic ml-2">— {contact.jobTitle}</span>}
          </div>
          <span className="font-sans text-[10px] uppercase tracking-wider text-stone-500 font-medium">Page 2 of 2</span>
        </header>
      );
    }

    return (
      <header className="text-center pb-4 border-b border-stone-300 mb-4">
        <h1
          className="text-3xl font-serif font-medium tracking-wide text-stone-900"
          style={{ color: primaryColor }}
        >
          {contact.fullName || 'Your Full Name'}
        </h1>
        {contact.jobTitle && (
          <p className="text-xs tracking-wider uppercase text-stone-600 mt-0.5 italic">
            {contact.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 text-xs text-stone-600 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
          {contact.website && <span>• {contact.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-2"
          style={{ color: primaryColor }}
        >
          Academic Background
        </h2>
        <div className="space-y-2.5">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-semibold text-stone-900 text-sm">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}
                </span>
              </div>
              <p className="text-xs text-stone-700 italic">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
              {edu.gradeOrGpa && <p className="text-xs text-stone-600 mt-0.5">{edu.gradeOrGpa}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-2"
          style={{ color: primaryColor }}
        >
          Appointments & Experience
        </h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-semibold text-stone-900 text-sm">
                  {exp.position}, <span className="italic font-normal">{exp.company}</span>
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-stone-800 leading-relaxed">
                  {exp.bullets.map((b, idx) => (
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

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          Research & Professional Profile
        </h2>
        <p className="text-xs text-stone-800 leading-relaxed text-justify">
          {summary}
        </p>
      </section>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-2"
          style={{ color: primaryColor }}
        >
          Publications & Projects
        </h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-semibold text-stone-900">{proj.name}</span>
                {proj.link && <span className="text-xs font-sans text-stone-500">{proj.link}</span>}
              </div>
              {proj.roleOrSubtitle && <p className="italic text-xs text-stone-600">{proj.roleOrSubtitle}</p>}
              {proj.bullets.length > 0 && (
                <ul className="mt-0.5 space-y-0.5 list-disc list-outside ml-4 text-stone-800">
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

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          Honors & Certifications
        </h2>
        <div className="space-y-1 text-xs text-stone-800">
          {certifications.map((c) => (
            <div key={c.id} className="flex flex-row justify-between items-baseline gap-2">
              <span><strong>{c.name}</strong> — {c.issuer}</span>
              {c.issueDate && <span className="text-stone-500 font-sans">{c.issueDate}</span>}
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
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          Core Expertise
        </h2>
        <div className="space-y-1 text-xs text-stone-800">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <strong className="w-36 shrink-0">{sc.categoryName}: </strong>
              <span className="flex-1">{sc.skills.join(', ')}</span>
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
              className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
              style={{ color: primaryColor }}
            >
              {cs.title}
            </h2>
            <div className="space-y-1 text-xs text-stone-800">
              {cs.items.map((it) => (
                <div key={it.id}>
                  <strong>{it.title}</strong>
                  {it.subtitle && <span> — {it.subtitle}</span>}
                  {it.description && <p className="text-stone-600 mt-0.5">{it.description}</p>}
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
      <footer className="mt-auto pt-3 border-t border-stone-200 flex items-center justify-between font-sans text-[10px] text-stone-400">
        <span>{contact.fullName} — Academic Curriculum Vitae</span>
        <span>Page {pageNumber} of {totalPages}</span>
      </footer>
    );
  };

  if (!hasPage2) {
    return (
      <div id="resume-preview-document" className="flex flex-col gap-8">
        <div
          id="resume-page-1"
          style={fontStyle}
          className={`resume-page-sheet bg-[#FDFAF7] ${paddingClass} text-stone-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
        >
          <div className="space-y-4">
            {renderHeader(false)}
            {renderEducation()}
            {renderExperience()}
            {renderSummary()}
            {renderProjects()}
            {renderCertifications()}
            {renderSkills()}
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
        className={`resume-page-sheet bg-[#FDFAF7] ${paddingClass} text-stone-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-4">
          {renderHeader(false)}
          {renderEducation()}
          {renderExperience()}
          {renderSummary()}
        </div>
        {renderFooter(1)}
      </div>

      {/* PAGE 2 */}
      <div
        id="resume-page-2"
        style={fontStyle}
        className={`resume-page-sheet bg-[#FDFAF7] ${paddingClass} text-stone-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-4">
          {renderHeader(true)}
          {renderProjects()}
          {renderCertifications()}
          {renderSkills()}
          {renderCustomSections()}
        </div>
        {renderFooter(2)}
      </div>
    </div>
  );
};
