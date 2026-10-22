import React from 'react';
import { ResumeDocument } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resume: ResumeDocument;
}

export const CreativeTwoColumnTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { contact, summary, experience, education, skillCategories, projects, certifications, customSections, styling } = resume;

  const primaryColor = styling.primaryColor || '#4338CA';
  const isCompact = styling.fontSize === 'compact';

  const isLetter = styling.paperSize === 'letter';
  const docWidth = isLetter ? '816px' : '794px';
  const docMinHeight = isLetter ? '1056px' : '1123px';

  const fontStyle = {
    fontFamily: `${styling.fontFamily || 'Montserrat'}, -apple-system, BlinkMacSystemFont, sans-serif`,
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

  const renderSidebar = (isPage2: boolean = false) => {
    return (
      <aside className="w-[260px] shrink-0 bg-slate-50 border-r border-slate-200/80 p-6 flex flex-col justify-between gap-5 box-border">
        <div className="space-y-5">
          {/* Photo & Name on Page 1, or compact banner on Page 2 */}
          {!isPage2 ? (
            <div className="flex flex-col items-center text-center">
              {styling.showPhoto && contact.photoUrl ? (
                <img
                  src={contact.photoUrl}
                  alt={contact.fullName}
                  className={`w-24 h-24 object-cover mb-3 border-4 shadow-sm ${
                    styling.photoShape === 'circle'
                      ? 'rounded-full'
                      : styling.photoShape === 'rounded'
                      ? 'rounded-2xl'
                      : 'rounded-none'
                  }`}
                  style={{ borderColor: primaryColor }}
                />
              ) : null}
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {contact.fullName}
              </h2>
              {contact.jobTitle && (
                <p className="text-xs font-semibold mt-1" style={{ color: primaryColor }}>
                  {contact.jobTitle}
                </p>
              )}
            </div>
          ) : (
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900">{contact.fullName}</h3>
              <p className="text-[11px] font-semibold" style={{ color: primaryColor }}>{contact.jobTitle}</p>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: primaryColor, borderColor: '#E2E8F0' }}
            >
              Contact
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              {contact.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{contact.location}</span>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span className="truncate">{contact.linkedin.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {contact.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span className="truncate">{contact.github.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Skills */}
          {!isPage2 && skillCategories.length > 0 && (
            <div>
              <h3
                className="text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ color: primaryColor, borderColor: '#E2E8F0' }}
              >
                Skills & Tools
              </h3>
              <div className="space-y-2.5">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-[11px] font-bold text-slate-800 mb-1">{cat.categoryName}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-white text-slate-700 border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {certifications.length > 0 && (
            <div>
              <h3
                className="text-[11px] font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                style={{ color: primaryColor, borderColor: '#E2E8F0' }}
              >
                Certifications
              </h3>
              <div className="space-y-1.5 text-xs">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-bold text-slate-800 leading-tight">{c.name}</p>
                    <p className="text-[11px] text-slate-500">{c.issuer} {c.issueDate ? `(${c.issueDate})` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {styling.showPageNumbers && (
          <div className="pt-2 text-[10px] text-slate-400 font-medium">
            Page {isPage2 ? 2 : 1} of {totalPages}
          </div>
        )}
      </aside>
    );
  };

  const renderMainHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <div className="border-b pb-2 mb-3 flex flex-row items-center justify-between text-xs" style={{ borderColor: primaryColor }}>
          <span className="font-bold text-slate-900 text-sm">{contact.fullName} — Professional Resume</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Page 2 of 2</span>
        </div>
      );
    }
    return null;
  };

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <section>
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: '#E2E8F0' }}
        >
          About Me
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
          className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: '#E2E8F0' }}
        >
          Professional Experience
        </h2>
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{exp.position}</h4>
                  <p className="text-xs font-semibold" style={{ color: primaryColor }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400 shrink-0">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className={`mt-1.5 space-y-1 list-disc list-outside ml-4 text-slate-700 ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
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

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <section>
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: '#E2E8F0' }}
        >
          Featured Projects
        </h2>
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-slate-900">{proj.name}</span>
                  {proj.roleOrSubtitle && (
                    <span className="text-xs text-slate-500 italic ml-1.5">
                      — {proj.roleOrSubtitle}
                    </span>
                  )}
                </div>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs hover:underline font-medium"
                    style={{ color: primaryColor }}
                  >
                    Visit Project
                  </a>
                )}
              </div>
              {proj.techStack && proj.techStack.length > 0 && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Stack: {proj.techStack.join(', ')}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <ul className={`mt-1 space-y-1 list-disc list-outside ml-4 text-slate-700 ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
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
          className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: '#E2E8F0' }}
        >
          Education
        </h2>
        <div className="space-y-2 text-xs">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-row items-baseline justify-between gap-2">
                <span className="font-bold text-slate-800">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </span>
                <span className="text-[10px] text-slate-400">
                  {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">{edu.institution}</p>
              {edu.gradeOrGpa && (
                <p className="text-[10px] italic text-indigo-700 mt-0.5">{edu.gradeOrGpa}</p>
              )}
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
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: primaryColor, borderColor: '#E2E8F0' }}
            >
              {cs.title}
            </h2>
            <div className="space-y-2 text-xs text-slate-700">
              {cs.items.map((it) => (
                <div key={it.id}>
                  <strong>{it.title}</strong>
                  {it.subtitle && <span> — {it.subtitle}</span>}
                  {it.description && <p className="text-slate-600 mt-0.5">{it.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  };

  if (!hasPage2) {
    return (
      <div id="resume-preview-document" className="flex flex-col gap-8">
        <div
          id="resume-page-1"
          style={fontStyle}
          className="resume-page-sheet bg-white flex flex-row shadow-sm print:shadow-none relative mx-auto box-border"
        >
          {renderSidebar(false)}
          <main className="flex-1 p-7 flex flex-col justify-between gap-4 box-border">
            <div className="space-y-4">
              {renderSummary()}
              {renderExperience()}
              {renderProjects()}
              {renderEducation()}
              {renderCustomSections()}
            </div>
          </main>
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
        className="resume-page-sheet bg-white flex flex-row shadow-sm print:shadow-none relative mx-auto box-border"
      >
        {renderSidebar(false)}
        <main className="flex-1 p-7 flex flex-col justify-between gap-4 box-border">
          <div className="space-y-4">
            {renderSummary()}
            {renderExperience()}
          </div>
        </main>
      </div>

      {/* PAGE 2 */}
      <div
        id="resume-page-2"
        style={fontStyle}
        className="resume-page-sheet bg-white flex flex-row shadow-sm print:shadow-none relative mx-auto box-border"
      >
        {renderSidebar(true)}
        <main className="flex-1 p-7 flex flex-col justify-between gap-4 box-border">
          <div className="space-y-4">
            {renderMainHeader(true)}
            {renderProjects()}
            {renderEducation()}
            {renderCustomSections()}
          </div>
        </main>
      </div>
    </div>
  );
};
