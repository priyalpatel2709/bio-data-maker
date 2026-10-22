import React from 'react';
import { ResumeDocument } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeDocument;
}

export const ViennaTemplate: React.FC<TemplateProps> = ({ resume }) => {
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

  const primaryColor = styling.primaryColor || '#7C2D12';
  const textColor = styling.textColor || '#1C1917';
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
    fontFamily: `${styling.fontFamily || 'Playfair Display'}, Georgia, serif`,
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

  // Header Component (Vienna signature airy & chic)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b border-stone-200 pb-2 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-bold text-stone-900 text-sm tracking-wide">
              {contact.fullName || 'Candidate Name'}
            </span>
            {contact.jobTitle && (
              <span className="text-stone-500 ml-2 italic">— {contact.jobTitle}</span>
            )}
          </div>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded border border-stone-200"
            style={{ color: primaryColor }}
          >
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header className="text-center pb-5 mb-5 border-b border-stone-200">
        <div className="flex flex-col items-center">
          {styling.showPhoto && contact.photoUrl && (
            <img
              src={contact.photoUrl}
              alt={contact.fullName}
              className={`w-20 h-20 object-cover mb-3 shadow-xs border shrink-0 ${
                styling.photoShape === 'circle'
                  ? 'rounded-full'
                  : styling.photoShape === 'rounded'
                  ? 'rounded-lg'
                  : 'rounded-none'
              }`}
              style={{ borderColor: `${primaryColor}40` }}
            />
          )}

          <h1
            className="text-3xl sm:text-4xl font-normal tracking-tight"
            style={{ color: primaryColor }}
          >
            {contact.fullName || 'Your Full Name'}
          </h1>

          {contact.jobTitle && (
            <p className="text-xs sm:text-sm italic text-stone-600 mt-1 tracking-wide font-sans">
              {contact.jobTitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs text-stone-600 font-sans">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            {contact.location && <span>• {contact.location}</span>}
            {contact.linkedin && (
              <span>• {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            )}
            {contact.github && (
              <span>• {contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
            )}
            {contact.website && (
              <span>• {contact.website.replace(/^https?:\/\//, '')}</span>
            )}
          </div>
        </div>
      </header>
    );
  };

  const renderSectionTitle = (title: string) => (
    <div className="text-center my-3">
      <h2
        className="text-xs font-semibold tracking-widest uppercase inline-block pb-1 border-b border-stone-300"
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
        {renderSectionTitle('Profile')}
        <p className="text-xs text-stone-800 leading-relaxed text-justify font-sans">{summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        {renderSectionTitle('Experience')}
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-stone-900 text-[13px]">{exp.position}</span>
                <span className="text-stone-400 font-normal font-sans text-[11px] shrink-0">
                  {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-stone-600 italic text-xs mt-0.5">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-xs text-stone-800 font-sans">
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
        {renderSectionTitle('Education')}
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-stone-900">{edu.degree}</span>
                  {edu.fieldOfStudy && (
                    <span className="text-stone-700 italic">, {edu.fieldOfStudy}</span>
                  )}
                  <div className="text-stone-600 text-xs mt-0.5">
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ''}
                  </div>
                </div>
                <div className="text-right shrink-0 font-sans">
                  <span className="text-stone-400 text-[11px]">
                    {edu.startDate} — {edu.isCurrent ? 'Present' : edu.endDate}
                  </span>
                  {edu.gradeOrGpa && (
                    <div className="text-stone-500 text-[11px]">{edu.gradeOrGpa}</div>
                  )}
                </div>
              </div>
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-stone-800 font-sans">
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
        {renderSectionTitle('Areas of Expertise')}
        <div className="space-y-1.5 text-xs text-stone-800 font-sans">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <span className="font-bold text-stone-900 w-36 shrink-0 text-xs">
                {sc.categoryName}:
              </span>
              <span className="flex-1 text-stone-700">{sc.skills.join(' • ')}</span>
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
        {renderSectionTitle('Projects')}
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-stone-900">{proj.name}</span>
                {(proj.startDate || proj.endDate) && (
                  <span className="text-stone-400 text-[11px] font-sans shrink-0">
                    {proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              {proj.roleOrSubtitle && (
                <div className="text-stone-600 text-xs italic">{proj.roleOrSubtitle}</div>
              )}
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="text-[11px] text-stone-500 mt-0.5 font-sans">
                  Focus: {proj.techStack.join(', ')}
                </div>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-stone-800 font-sans">
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
        {renderSectionTitle('Certifications')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
          {certifications.map((cert) => (
            <div key={cert.id} className="border-l-2 pl-2" style={{ borderColor: `${primaryColor}60` }}>
              <div className="font-bold text-stone-900">{cert.name}</div>
              <div className="text-stone-500 text-[11px]">
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
              {renderSectionTitle(cs.title)}
              <div className="space-y-2 text-xs font-sans">
                {cs.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline font-bold text-stone-900">
                      <span>{item.title}</span>
                      {item.date && (
                        <span className="text-stone-400 font-normal text-[11px]">{item.date}</span>
                      )}
                    </div>
                    {item.subtitle && <div className="text-stone-600 italic">{item.subtitle}</div>}
                    {item.description && <p className="text-stone-700 mt-0.5">{item.description}</p>}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-1 list-disc list-outside ml-4 space-y-0.5 text-stone-700">
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
      <footer className="mt-auto pt-3 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400 font-sans">
        <span>{contact.fullName || 'Candidate Resume'}</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </footer>
    );
  };

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
