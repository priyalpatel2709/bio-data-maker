import React from 'react';
import { ResumeDocument } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resume: ResumeDocument;
}

export const MonochromeClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
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
    fontFamily: `${styling.fontFamily || 'Merriweather'}, Georgia, 'Times New Roman', serif`,
    color: '#000000',
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

  // Header Component (Page 1 Full Branding, Page 2 Continued Header)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b-2 border-black pb-2 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-bold text-black text-sm tracking-wide uppercase">
              {contact.fullName || 'Candidate Name'}
            </span>
            {contact.jobTitle && (
              <span className="text-zinc-700 ml-2 italic">— {contact.jobTitle}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-zinc-600 text-[11px]">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>• {contact.phone}</span>}
            <span className="font-semibold text-black bg-zinc-100 px-2 py-0.5 border border-black rounded text-[10px]">
              Page 2 of 2
            </span>
          </div>
        </header>
      );
    }

    return (
      <header className="text-center pb-4 mb-4 border-b-2 border-black">
        <div className="flex flex-col items-center">
          {styling.showPhoto && contact.photoUrl && (
            <img
              src={contact.photoUrl}
              alt={contact.fullName}
              className={`w-20 h-20 object-cover mb-3 grayscale contrast-125 border-2 border-black shadow-xs ${
                styling.photoShape === 'circle'
                  ? 'rounded-full'
                  : styling.photoShape === 'rounded'
                  ? 'rounded-lg'
                  : 'rounded-none'
              }`}
            />
          )}

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
            {contact.fullName || 'Your Full Name'}
          </h1>

          {contact.jobTitle && (
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-zinc-800 mt-1">
              {contact.jobTitle}
            </p>
          )}

          {/* Contact Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-zinc-800">
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-black" />
                {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-black" />
                {contact.phone}
              </span>
            )}
            {contact.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-black" />
                {contact.location}
              </span>
            )}
            {contact.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-black" />
                {contact.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {contact.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-black" />
                {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </span>
            )}
            {contact.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-black" />
                {contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </span>
            )}
          </div>
        </div>
      </header>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2 flex items-center justify-between">
          <span>Professional Summary</span>
        </h2>
        <p className="text-xs text-zinc-900 leading-relaxed text-justify">{summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2.5">
          Work Experience
        </h2>
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row justify-between items-baseline gap-2 text-xs">
                <div>
                  <span className="font-bold text-black text-sm">{exp.position}</span>
                  <span className="font-semibold text-zinc-800">, {exp.company}</span>
                  {exp.location && <span className="text-zinc-600 italic"> — {exp.location}</span>}
                </div>
                <span className="font-semibold text-black tracking-tight shrink-0">
                  {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-xs text-zinc-900">
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
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2.5">
          Education & Credentials
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-black">{edu.degree}</span>
                  {edu.fieldOfStudy && (
                    <span className="text-zinc-800"> in {edu.fieldOfStudy}</span>
                  )}
                  <div className="text-zinc-700 italic">
                    {edu.institution}
                    {edu.location ? ` — ${edu.location}` : ''}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-black">
                    {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}
                  </div>
                  {edu.gradeOrGpa && (
                    <div className="text-zinc-600 text-[11px] font-medium">{edu.gradeOrGpa}</div>
                  )}
                </div>
              </div>
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-zinc-800">
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
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
          Technical & Professional Skills
        </h2>
        <div className="space-y-1.5 text-xs text-zinc-900">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <span className="font-bold text-black uppercase tracking-wider w-36 shrink-0 text-[11px]">
                {sc.categoryName}:
              </span>
              <span className="flex-1 font-normal text-zinc-900">{sc.skills.join(' • ')}</span>
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
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2.5">
          Key Projects & Initiatives
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-black">{proj.name}</span>
                  {proj.roleOrSubtitle && (
                    <span className="text-zinc-700 italic"> — {proj.roleOrSubtitle}</span>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <span className="font-semibold text-black shrink-0">
                    {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="text-[11px] text-zinc-700 mt-0.5 font-medium">
                  Technologies: {proj.techStack.join(', ')}
                </div>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-zinc-900">
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
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
          Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="border-l-2 border-black pl-2">
              <div className="font-bold text-black">{cert.name}</div>
              <div className="text-zinc-700 text-[11px]">
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
              <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
                {cs.title}
              </h2>
              <div className="space-y-2 text-xs">
                {cs.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline font-bold text-black">
                      <span>{item.title}</span>
                      {item.date && <span className="text-zinc-700 font-normal">{item.date}</span>}
                    </div>
                    {item.subtitle && <div className="text-zinc-700 italic">{item.subtitle}</div>}
                    {item.description && <p className="text-zinc-800 mt-0.5">{item.description}</p>}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-1 list-disc list-outside ml-4 space-y-0.5 text-zinc-900">
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
      <footer className="mt-auto pt-3 border-t border-black flex justify-between items-center text-[10px] text-zinc-700 font-medium">
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
    <div className="flex flex-col items-center gap-8 print:gap-0" style={{ color: '#000000' }}>
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
