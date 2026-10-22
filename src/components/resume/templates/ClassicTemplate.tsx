import React from 'react';
import { ResumeDocument } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeDocument;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const {
    contact,
    summary,
    experience,
    education,
    skillCategories,
    projects,
    certifications,
    customSections,
    styling,
  } = resume;

  const primaryColor = styling.primaryColor || '#1A365D';
  const textColor = styling.textColor || '#111827';
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

  // Header Component
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b border-slate-300 pb-2 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-wide">
              {contact.fullName || 'Candidate Name'}
            </span>
            {contact.jobTitle && (
              <span className="text-slate-600 ml-2 italic">— {contact.jobTitle}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            <span
              className="font-semibold px-2 py-0.5 rounded text-[10px]"
              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
            >
              Page 2 of 2
            </span>
          </div>
        </header>
      );
    }

    return (
      <header className="text-center pb-4 mb-4 border-b border-slate-300">
        <div className="flex flex-col items-center">
          {styling.showPhoto && contact.photoUrl && (
            <img
              src={contact.photoUrl}
              alt={contact.fullName}
              className={`w-20 h-20 object-cover mb-3 border-2 shadow-xs ${
                styling.photoShape === 'circle'
                  ? 'rounded-full'
                  : styling.photoShape === 'rounded'
                  ? 'rounded-lg'
                  : 'rounded-none'
              }`}
              style={{ borderColor: primaryColor }}
            />
          )}

          {/* Candidate Name */}
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: primaryColor }}
          >
            {contact.fullName || 'Your Full Name'}
          </h1>

          {/* Job Title / Headline */}
          {contact.jobTitle && (
            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-600 mt-1">
              {contact.jobTitle}
            </p>
          )}

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-2 text-xs text-slate-600">
            {contact.location && <span>{contact.location}</span>}
            {contact.location && contact.phone && <span>•</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.phone && contact.email && <span>•</span>}
            {contact.email && (
              <span className="font-medium text-slate-700">{contact.email}</span>
            )}
            {contact.linkedin && (
              <>
                <span>•</span>
                <span>{contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</span>
              </>
            )}
            {contact.github && (
              <>
                <span>•</span>
                <span>{contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/')}</span>
              </>
            )}
            {contact.website && (
              <>
                <span>•</span>
                <span>{contact.website.replace(/^https?:\/\//, '')}</span>
              </>
            )}
          </div>
        </div>
      </header>
    );
  };

  const renderSectionHeading = (title: string) => (
    <div className="border-b border-slate-300 pb-1 mb-2.5 flex items-center justify-between">
      <h2
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: primaryColor }}
      >
        {title}
      </h2>
    </div>
  );

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        {renderSectionHeading('Profile')}
        <p className="text-xs text-slate-800 leading-relaxed text-justify">{summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        {renderSectionHeading('Employment History')}
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id}>
              {/* Top line: Job Title (left) & Date Period (right) */}
              <div className="flex flex-row justify-between items-baseline gap-2 text-xs">
                <span className="font-bold text-slate-900 text-[13px]">{exp.position}</span>
                <span className="text-slate-500 font-medium text-[11px] shrink-0">
                  {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>

              {/* Sub line: Employer & Location */}
              <div className="text-xs text-slate-700 font-medium mt-0.5">
                <span>{exp.company}</span>
                {exp.location && <span className="text-slate-500 italic">, {exp.location}</span>}
              </div>

              {/* Bullet list */}
              {exp.bullets.length > 0 && (
                <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-xs text-slate-800">
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

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <section>
        {renderSectionHeading('Education')}
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  {edu.fieldOfStudy && (
                    <span className="text-slate-800 font-medium">, {edu.fieldOfStudy}</span>
                  )}
                  <div className="text-slate-700 text-xs mt-0.5">
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ''}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-500 font-medium text-[11px]">
                    {edu.startDate} — {edu.isCurrent ? 'Present' : edu.endDate}
                  </span>
                  {edu.gradeOrGpa && (
                    <div className="text-slate-600 text-[11px]">{edu.gradeOrGpa}</div>
                  )}
                </div>
              </div>
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-slate-800">
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

  const renderSkills = () => {
    if (skillCategories.length === 0) return null;
    return (
      <section>
        {renderSectionHeading('Skills')}
        <div className="space-y-1.5 text-xs text-slate-800">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <span className="font-bold text-slate-900 w-36 shrink-0 text-xs">
                {sc.categoryName}:
              </span>
              <span className="flex-1 text-slate-800">{sc.skills.join(', ')}</span>
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
        {renderSectionHeading('Key Projects')}
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.roleOrSubtitle && (
                    <span className="text-slate-700 font-medium"> — {proj.roleOrSubtitle}</span>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <span className="text-slate-500 font-medium text-[11px] shrink-0">
                    {proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="text-[11px] text-slate-600 mt-0.5">
                  <span className="font-medium text-slate-700">Tech: </span>
                  {proj.techStack.join(', ')}
                </div>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-slate-800">
                  {proj.bullets.map((b, idx) => (
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

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <section>
        {renderSectionHeading('Certifications')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="border-l-2 pl-2" style={{ borderColor: primaryColor }}>
              <div className="font-bold text-slate-900">{cert.name}</div>
              <div className="text-slate-600 text-[11px]">
                {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomSections = () => {
    if (customSections.length === 0) return null;
    return (
      <>
        {customSections
          .filter((cs) => cs.visible)
          .map((cs) => (
            <section key={cs.id}>
              {renderSectionHeading(cs.title)}
              <div className="space-y-2 text-xs">
                {cs.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{item.title}</span>
                      {item.date && (
                        <span className="text-slate-500 font-normal text-[11px]">{item.date}</span>
                      )}
                    </div>
                    {item.subtitle && <div className="text-slate-700 italic">{item.subtitle}</div>}
                    {item.description && <p className="text-slate-800 mt-0.5">{item.description}</p>}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-1 list-disc list-outside ml-4 space-y-0.5 text-slate-800">
                        {item.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    )}
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
      <footer className="mt-auto pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-medium">
        <span>{contact.fullName || 'Candidate Resume'}</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </footer>
    );
  };

  // Split logic
  const renderPage1Sections = () => {
    if (isSinglePage) {
      return (
        <div className="space-y-4">
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
          {renderSkills()}
          {renderCertifications()}
          {renderCustomSections()}
        </div>
      );
    }

    if (splitAt === 'projects') {
      return (
        <div className="space-y-4">
          {renderSummary()}
          {renderExperience()}
        </div>
      );
    }

    if (splitAt === 'education') {
      return (
        <div className="space-y-4">
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
        </div>
      );
    }

    if (splitAt === 'skills') {
      return (
        <div className="space-y-4">
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
        </div>
      );
    }

    // Auto split
    return (
      <div className="space-y-4">
        {renderSummary()}
        {renderExperience()}
        {experience.length <= 2 && renderProjects()}
      </div>
    );
  };

  const renderPage2Sections = () => {
    if (splitAt === 'projects') {
      return (
        <div className="space-y-4">
          {renderProjects()}
          {renderEducation()}
          {renderSkills()}
          {renderCertifications()}
          {renderCustomSections()}
        </div>
      );
    }

    if (splitAt === 'education') {
      return (
        <div className="space-y-4">
          {renderEducation()}
          {renderSkills()}
          {renderCertifications()}
          {renderCustomSections()}
        </div>
      );
    }

    if (splitAt === 'skills') {
      return (
        <div className="space-y-4">
          {renderSkills()}
          {renderCertifications()}
          {renderCustomSections()}
        </div>
      );
    }

    // Auto split
    return (
      <div className="space-y-4">
        {experience.length > 2 && renderProjects()}
        {renderEducation()}
        {renderSkills()}
        {renderCertifications()}
        {renderCustomSections()}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 print:gap-0">
      {/* Page 1 */}
      <div
        id="resume-page-1"
        data-page-number="1"
        className={`resume-page-sheet bg-white shadow-lg print:shadow-none flex flex-col justify-between ${paddingClass}`}
        style={fontStyle}
      >
        <div>
          {renderHeader(false)}
          <main>{renderPage1Sections()}</main>
        </div>
        {renderFooter(1)}
      </div>

      {/* Page 2 */}
      {hasPage2 && (
        <div
          id="resume-page-2"
          data-page-number="2"
          className={`resume-page-sheet bg-white shadow-lg print:shadow-none flex flex-col justify-between ${paddingClass}`}
          style={fontStyle}
        >
          <div>
            {renderHeader(true)}
            <main>{renderPage2Sections()}</main>
          </div>
          {renderFooter(2)}
        </div>
      )}
    </div>
  );
};
