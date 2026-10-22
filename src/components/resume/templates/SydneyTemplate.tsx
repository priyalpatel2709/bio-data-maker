import React from 'react';
import { ResumeDocument } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeDocument;
}

export const SydneyTemplate: React.FC<TemplateProps> = ({ resume }) => {
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

  const primaryColor = styling.primaryColor || '#1E3A8A';
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
    fontFamily: `${styling.fontFamily || 'Montserrat'}, -apple-system, BlinkMacSystemFont, sans-serif`,
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

  // Header Component (Sydney signature)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b-2 pb-2 mb-4 flex flex-row items-center justify-between text-xs" style={{ borderColor: `${primaryColor}30` }}>
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              {contact.fullName || 'Candidate Name'}
            </span>
            {contact.jobTitle && (
              <span className="text-slate-500 ml-2">— {contact.jobTitle}</span>
            )}
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header className="pb-4 mb-4 border-b-2 flex flex-row items-center justify-between gap-5" style={{ borderColor: `${primaryColor}20` }}>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
            {contact.fullName || 'Your Full Name'}
          </h1>
          {contact.jobTitle && (
            <p className="text-sm font-semibold text-slate-700 tracking-wider uppercase mt-1">
              {contact.jobTitle}
            </p>
          )}
        </div>

        {styling.showPhoto && contact.photoUrl && (
          <img
            src={contact.photoUrl}
            alt={contact.fullName}
            className="w-20 h-20 object-cover shadow-sm border-2 rounded-full shrink-0"
            style={{ borderColor: primaryColor }}
          />
        )}
      </header>
    );
  };

  const renderSectionTitle = (title: string) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">{title}</h2>
      <div className="flex-1 h-[1px] bg-slate-200" />
    </div>
  );

  // Left Sidebar
  const renderSidebar = () => (
    <aside className="w-[200px] shrink-0 space-y-4 text-xs pr-4 border-r border-slate-200">
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2">
          Contact Info
        </h3>
        <div className="space-y-1.5 text-slate-600 text-[11px]">
          {contact.location && <div>{contact.location}</div>}
          {contact.phone && <div>{contact.phone}</div>}
          {contact.email && <div className="break-words font-medium text-slate-800">{contact.email}</div>}
          {contact.linkedin && (
            <div className="break-words text-[10px]">
              {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </div>
          )}
          {contact.github && (
            <div className="break-words text-[10px]">
              {contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </div>
          )}
          {contact.website && (
            <div className="break-words text-[10px]">{contact.website.replace(/^https?:\/\//, '')}</div>
          )}
        </div>
      </div>

      {skillCategories.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2">
            Key Skills
          </h3>
          <div className="space-y-2">
            {skillCategories.map((sc) => (
              <div key={sc.id}>
                <div className="font-semibold text-slate-800 text-[11px] mb-1">{sc.categoryName}</div>
                <div className="space-y-1">
                  {sc.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2">
            Certifications
          </h3>
          <div className="space-y-2 text-[11px]">
            {certifications.map((c) => (
              <div key={c.id}>
                <div className="font-semibold text-slate-900">{c.name}</div>
                <div className="text-slate-500 text-[10px]">
                  {c.issuer} {c.issueDate ? `(${c.issueDate})` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );

  // Main Column Content
  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        {renderSectionTitle('Profile')}
        <p className="text-xs text-slate-700 leading-relaxed text-justify">{summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        {renderSectionTitle('Work Experience')}
        <div className="border-l-2 pl-3 space-y-4" style={{ borderColor: `${primaryColor}30` }}>
          {experience.map((exp) => (
            <div key={exp.id} className="relative text-xs">
              {/* Dot marker on timeline */}
              <div
                className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs"
                style={{ backgroundColor: primaryColor }}
              />
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900 text-[13px]">{exp.position}</span>
                <span className="text-slate-400 font-medium text-[11px] shrink-0">
                  {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-slate-600 font-medium text-xs">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-slate-700">
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
        <div className="border-l-2 pl-3 space-y-3" style={{ borderColor: `${primaryColor}30` }}>
          {education.map((edu) => (
            <div key={edu.id} className="relative text-xs">
              <div
                className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs"
                style={{ backgroundColor: primaryColor }}
              />
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{edu.degree}</span>
                <span className="text-slate-400 font-medium text-[11px] shrink-0">
                  {edu.startDate} — {edu.isCurrent ? 'Present' : edu.endDate}
                </span>
              </div>
              <div className="text-slate-600 text-xs">
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ''}
              </div>
              {edu.gradeOrGpa && (
                <div className="text-slate-500 text-[11px] mt-0.5">{edu.gradeOrGpa}</div>
              )}
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-slate-700">
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

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <section>
        {renderSectionTitle('Projects')}
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{proj.name}</span>
                {(proj.startDate || proj.endDate) && (
                  <span className="text-slate-400 font-medium text-[11px] shrink-0">
                    {proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              {proj.roleOrSubtitle && (
                <div className="text-slate-600 text-xs italic">{proj.roleOrSubtitle}</div>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-slate-700">
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

  const renderCustomSections = () => {
    if (customSections.length === 0) return null;
    return (
      <>
        {customSections
          .filter((cs) => cs.visible)
          .map((cs) => (
            <section key={cs.id}>
              {renderSectionTitle(cs.title)}
              <div className="space-y-2 text-xs">
                {cs.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{item.title}</span>
                      {item.date && (
                        <span className="text-slate-400 font-normal text-[11px]">{item.date}</span>
                      )}
                    </div>
                    {item.subtitle && <div className="text-slate-600 italic">{item.subtitle}</div>}
                    {item.description && <p className="text-slate-700 mt-0.5">{item.description}</p>}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-1 list-disc list-outside ml-4 space-y-0.5 text-slate-700">
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
      <footer className="mt-auto pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium">
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
          {renderCustomSections()}
        </div>
      );
    }

    if (splitAt === 'education') {
      return (
        <div className="space-y-4">
          {renderEducation()}
          {renderCustomSections()}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {experience.length > 2 && renderProjects()}
        {renderEducation()}
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
          <div className="flex flex-row gap-5">
            {renderSidebar()}
            <main className="flex-1">{renderPage1Sections()}</main>
          </div>
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
            <div className="flex flex-row gap-5">
              <aside className="w-[200px] shrink-0 pr-4 border-r border-slate-200 text-xs space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Continued
                </div>
                <div className="text-[11px] text-slate-500">
                  {contact.fullName}
                  {contact.phone && <div className="mt-1">{contact.phone}</div>}
                  {contact.email && <div className="mt-0.5 break-words">{contact.email}</div>}
                </div>
              </aside>
              <main className="flex-1">{renderPage2Sections()}</main>
            </div>
          </div>
          {renderFooter(2)}
        </div>
      )}
    </div>
  );
};
