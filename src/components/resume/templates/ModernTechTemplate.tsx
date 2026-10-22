import React from 'react';
import { ResumeDocument } from '../../../types/resume';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Award,
} from 'lucide-react';

interface TemplateProps {
  resume: ResumeDocument;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { contact, summary, experience, education, skillCategories, projects, certifications, customSections, styling } = resume;

  const primaryColor = styling.primaryColor || '#0F766E';
  const secondaryColor = styling.secondaryColor || '#0284C7';
  const textColor = styling.textColor || '#1E293B';
  const isCompact = styling.fontSize === 'compact';
  const isRelaxed = styling.fontSize === 'relaxed';

  const isLetter = styling.paperSize === 'letter';
  const docWidth = isLetter ? '816px' : '794px';
  const docMinHeight = isLetter ? '1056px' : '1123px';

  // Padding options
  const paddingClass =
    styling.pageMargin === 'compact'
      ? 'p-6'
      : styling.pageMargin === 'spacious'
      ? 'p-12'
      : 'p-9';

  const fontStyle = {
    fontFamily: `${styling.fontFamily || 'Inter'}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    color: textColor,
    width: docWidth,
    minHeight: docMinHeight,
    boxSizing: 'border-box' as const,
  };

  // Determine pagination split
  const isSinglePage = styling.pageSplitAt === 'single-page';
  const splitAt = styling.pageSplitAt || 'auto';

  // If not single page, decide if we have page 2
  // Auto split: Page 1 = Summary, Experience, Skills. Page 2 = Projects, Education, Certifications, Custom.
  const hasPage2 =
    !isSinglePage &&
    (projects.length > 0 || education.length > 0 || certifications.length > 0 || customSections.length > 0);

  const totalPages = hasPage2 ? 2 : 1;

  // --- Render Sections ---
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b-2 pb-3 mb-5 flex flex-row items-center justify-between" style={{ borderColor: primaryColor }}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{contact.fullName}</h2>
              {contact.jobTitle && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">{contact.jobTitle}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
              {contact.email && <span>{contact.email}</span>}
              {contact.phone && <span>• {contact.phone}</span>}
              {contact.location && <span>• {contact.location}</span>}
              {contact.linkedin && <span>• {contact.linkedin.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>
          <div className="text-right">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              Page 2 of 2
            </span>
          </div>
        </header>
      );
    }

    return (
      <header className="border-b-2 pb-5" style={{ borderColor: primaryColor }}>
        <div className="flex flex-row items-start justify-between gap-5">
          <div className="flex-1">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: primaryColor }}
            >
              {contact.fullName || 'Your Full Name'}
            </h1>
            {contact.jobTitle && (
              <p className="text-base font-semibold tracking-wide text-slate-600 mt-1">
                {contact.jobTitle}
              </p>
            )}

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-2.5 text-xs text-slate-600">
              {contact.email && (
                <span className="flex items-center gap-1.5 hover:text-slate-900">
                  <Mail className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                  {contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                  {contact.phone}
                </span>
              )}
              {contact.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                  {contact.location}
                </span>
              )}
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={`https://${contact.linkedin.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Linkedin className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                  {contact.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                </a>
              )}
              {contact.github && (
                <a
                  href={`https://${contact.github.replace(/^https?:\/\//, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Github className="w-3.5 h-3.5" style={{ color: secondaryColor }} />
                  {contact.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                </a>
              )}
            </div>
          </div>

          {/* Optional Profile Photo */}
          {styling.showPhoto && contact.photoUrl && (
            <div className="shrink-0">
              <img
                src={contact.photoUrl}
                alt={contact.fullName}
                className={`w-20 h-20 object-cover border-2 shadow-sm ${
                  styling.photoShape === 'circle'
                    ? 'rounded-full'
                    : styling.photoShape === 'rounded'
                    ? 'rounded-xl'
                    : 'rounded-none'
                }`}
                style={{ borderColor: primaryColor }}
              />
            </div>
          )}
        </div>
      </header>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          Professional Summary
        </h2>
        <p className={`text-slate-700 leading-relaxed ${isCompact ? 'text-xs' : 'text-sm'}`}>
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
          className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          Work Experience
        </h2>
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-slate-900">{exp.position}</span>
                  <span className="text-sm font-semibold ml-1.5" style={{ color: primaryColor }}>
                    @ {exp.company}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 shrink-0">
                  {exp.location && <span>{exp.location} •</span>}
                  <span>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
              </div>

              {exp.bullets.length > 0 && (
                <ul className={`mt-1.5 space-y-1 list-disc list-outside ml-4 text-slate-700 ${isCompact ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>
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
          className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          Skills & Proficiencies
        </h2>
        <div className="space-y-2">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="flex flex-row items-baseline gap-2">
              <span className="text-xs font-bold text-slate-800 w-36 shrink-0">
                {cat.categoryName}:
              </span>
              {styling.skillsDisplay === 'chips' ? (
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {cat.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : styling.skillsDisplay === 'dots' ? (
                <div className="text-xs text-slate-700 flex flex-wrap items-center gap-1.5">
                  {cat.skills.map((s, idx) => (
                    <React.Fragment key={idx}>
                      <span>{s}</span>
                      {idx < cat.skills.length - 1 && <span className="text-slate-300">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-700 flex-1">{cat.skills.join(', ')}</p>
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
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          Key Projects
        </h2>
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{proj.name}</span>
                  {proj.roleOrSubtitle && (
                    <span className="text-xs text-slate-500 font-medium italic">
                      ({proj.roleOrSubtitle})
                    </span>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs flex items-center gap-1 hover:underline font-medium"
                      style={{ color: secondaryColor }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Link
                    </a>
                  )}
                </div>
                {proj.startDate && (
                  <span className="text-xs text-slate-400">
                    {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ''}
                  </span>
                )}
              </div>

              {proj.techStack && proj.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.2 bg-teal-50 text-teal-700 rounded border border-teal-200/60 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {proj.bullets.length > 0 && (
                <ul className={`mt-1 space-y-1 list-disc list-outside ml-4 text-slate-700 ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
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

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <section>
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          Education
        </h2>
        <div className="space-y-2.5">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-xs font-semibold ml-2 text-slate-600">
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ''}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 shrink-0">
                  {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                </span>
              </div>
              {edu.gradeOrGpa && (
                <p className="text-xs text-slate-500 italic mt-0.5">{edu.gradeOrGpa}</p>
              )}
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-slate-600">
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
          className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
          style={{ color: primaryColor }}
        >
          <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          Certifications & Credentials
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2"
            >
              <Award className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
              <div>
                <span className="font-bold text-slate-800">{cert.name}</span>
                <p className="text-[11px] text-slate-500">
                  {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
                </p>
                {cert.credentialId && (
                  <p className="text-[10px] text-slate-400 font-mono">ID: {cert.credentialId}</p>
                )}
              </div>
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
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
              {cs.title}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {cs.items.map((item) => (
                <div key={item.id} className="p-2 bg-slate-50/80 rounded border border-slate-200/60">
                  <span className="font-bold text-slate-800">{item.title}</span>
                  {item.subtitle && <span className="text-slate-500 ml-1.5">— {item.subtitle}</span>}
                  {item.description && <p className="text-[11px] text-slate-600 mt-1">{item.description}</p>}
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
      <footer className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>{contact.fullName} — Professional Resume</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </footer>
    );
  };

  // Single page layout
  if (!hasPage2) {
    return (
      <div id="resume-preview-document" className="flex flex-col gap-8">
        <div
          id="resume-page-1"
          style={fontStyle}
          className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
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

  // Multi-page layout (Page 1 + Page 2)
  return (
    <div id="resume-preview-document" className="flex flex-col gap-8">
      {/* PAGE 1 */}
      <div
        id="resume-page-1"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
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
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
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
