import React from 'react';
import { ResumeDocument } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeDocument;
}

export const MinimalistAtsTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { contact, summary, experience, education, skillCategories, projects, certifications, customSections, styling } = resume;

  const textColor = styling.textColor || '#1E293B';

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
    fontFamily: `${styling.fontFamily || 'Roboto'}, -apple-system, BlinkMacSystemFont, Arial, sans-serif`,
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
        <header className="border-b border-slate-300 pb-2 mb-3.5 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm">{contact.fullName}</span>
            {contact.jobTitle && <span className="text-slate-600 ml-2">— {contact.jobTitle}</span>}
          </div>
          <span className="text-slate-500 font-medium text-[10px]">Page 2 of 2</span>
        </header>
      );
    }

    return (
      <header className="text-center pb-3.5 border-b border-slate-300 mb-3.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {contact.fullName || 'Your Full Name'}
        </h1>
        {contact.jobTitle && (
          <p className="text-xs font-semibold text-slate-600 mt-0.5">{contact.jobTitle}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-600">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {contact.github && <span>• {contact.github}</span>}
          {contact.website && <span>• {contact.website}</span>}
        </div>
      </header>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
          Professional Summary
        </h2>
        <p className="text-xs text-slate-800 leading-relaxed">{summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
          Work Experience
        </h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row justify-between items-baseline text-xs gap-2">
                <div>
                  <span className="font-bold text-slate-900">{exp.position}</span>
                  <span className="text-slate-700">, {exp.company}</span>
                  {exp.location && <span className="text-slate-500"> — {exp.location}</span>}
                </div>
                <span className="text-slate-500 font-medium shrink-0">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-slate-800">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
          Technical & Core Skills
        </h2>
        <div className="space-y-1 text-xs text-slate-800">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <span className="font-bold text-slate-900 w-36 shrink-0">{sc.categoryName}: </span>
              <span className="flex-1">{sc.skills.join(', ')}</span>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
          Key Projects
        </h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">
                  {proj.name} {proj.roleOrSubtitle && `(${proj.roleOrSubtitle})`}
                </span>
                {proj.link && <span className="text-slate-500">{proj.link}</span>}
              </div>
              {proj.techStack && proj.techStack.length > 0 && (
                <p className="text-slate-600 text-[11px]">Technologies: {proj.techStack.join(', ')}</p>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-slate-800">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
          Education
        </h2>
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                  <span className="text-slate-700">, {edu.institution}</span>
                </div>
                <span className="text-slate-500 font-medium shrink-0">
                  {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}
                </span>
              </div>
              {edu.gradeOrGpa && <p className="text-slate-600 italic">{edu.gradeOrGpa}</p>}
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
          Certifications
        </h2>
        <div className="space-y-1 text-xs text-slate-800">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex flex-row justify-between items-baseline gap-2">
              <span>
                <strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}
              </span>
              {cert.issueDate && <span className="text-slate-500">{cert.issueDate}</span>}
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              {cs.title}
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {cs.items.map((it) => (
                <div key={it.id}>
                  <strong>{it.title}</strong>
                  {it.subtitle && <span> — {it.subtitle}</span>}
                  {it.description && <p className="text-slate-600">{it.description}</p>}
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
      <footer className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>{contact.fullName} — ATS Resume</span>
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
          <div className="space-y-3.5">
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
        <div className="space-y-3.5">
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
        <div className="space-y-3.5">
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
