import React from "react";
import { ResumeDocument, ResumeSectionKey } from "../../../types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import {
  getEffectiveSectionOrder,
  getSectionTitle,
} from "./templateUtils";

interface TemplateProps {
  resume: ResumeDocument;
}

export const DublinTemplate: React.FC<TemplateProps> = ({ resume }) => {
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

  const primaryColor = styling.primaryColor || "#334155";
  const textColor = styling.textColor || "#1E293B";
  const isLetter = styling.paperSize === "letter";
  const docWidth = isLetter ? "816px" : "794px";
  const docMinHeight = isLetter ? "1056px" : "1123px";

  const paddingClass =
    styling.pageMargin === "compact"
      ? "p-6"
      : styling.pageMargin === "spacious"
        ? "p-12"
        : "p-9";

  const fontStyle = {
    fontFamily: `${styling.fontFamily || "Roboto"}, -apple-system, BlinkMacSystemFont, sans-serif`,
    color: textColor,
    width: docWidth,
    minHeight: docMinHeight,
    boxSizing: "border-box" as const,
  };

  const isSinglePage = styling.pageSplitAt === "single-page";
  const splitAt = styling.pageSplitAt || "auto";
  const hasPage2 =
    !isSinglePage &&
    (projects.length > 0 ||
      education.length > 0 ||
      certifications.length > 0 ||
      customSections.length > 0);
  const totalPages = hasPage2 ? 2 : 1;

  // Header Component (Dublin Signature Corporate Banner)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header
          className="p-3 mb-4 rounded-lg flex flex-row items-center justify-between text-xs text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div>
            <span className="font-bold text-sm tracking-wide">
              {contact.fullName || "Candidate Name"}
            </span>
            {contact.jobTitle && (
              <span className="opacity-80 ml-2">— {contact.jobTitle}</span>
            )}
          </div>
          <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded">
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header
        className="p-5 mb-5 rounded-xl text-white shadow-xs flex flex-row items-center justify-between gap-5"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {contact.fullName || "Your Full Name"}
          </h1>
          {contact.jobTitle && (
            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase opacity-90 mt-1">
              {contact.jobTitle}
            </p>
          )}

          {/* Contact Strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs opacity-90 text-white/95">
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 opacity-80" />
                {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 opacity-80" />
                {contact.phone}
              </span>
            )}
            {contact.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 opacity-80" />
                {contact.location}
              </span>
            )}
            {contact.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 opacity-80" />
                {contact.linkedin.replace(
                  /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                  "",
                )}
              </span>
            )}
            {contact.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 opacity-80" />
                {contact.github.replace(
                  /^https?:\/\/(www\.)?github\.com\//,
                  "",
                )}
              </span>
            )}
            {contact.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 opacity-80" />
                {contact.website.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        </div>

        {styling.showPhoto && contact.photoUrl && (
          <img
            src={contact.photoUrl}
            alt={contact.fullName}
            className={`w-20 h-20 object-cover border-2 border-white/40 shadow-xs shrink-0 ${
              styling.photoShape === "circle"
                ? "rounded-full"
                : styling.photoShape === "rounded"
                  ? "rounded-2xl"
                  : "rounded-none"
            }`}
          />
        )}
      </header>
    );
  };

  const renderSectionTitle = (title: string) => (
    <div className="mb-2.5">
      <h2
        className="text-xs font-bold uppercase tracking-wider pb-1 border-b-2"
        style={{ color: primaryColor, borderColor: primaryColor }}
      >
        {title}
      </h2>
    </div>
  );

  const renderSummary = (customTitle?: string) => {
    if (!summary) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "summary", "Executive Summary"))}
        <p className="text-xs text-slate-700 leading-relaxed text-justify">
          {summary}
        </p>
      </section>
    );
  };

  const renderExperience = (customTitle?: string) => {
    if (experience.length === 0) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "experience", "Work Experience"))}
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900 text-[13px]">
                  {exp.position}
                </span>
                <span className="text-slate-400 font-medium text-[11px] shrink-0">
                  {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="text-slate-600 font-semibold text-xs mt-0.5">
                {exp.company}
                {exp.location ? ` | ${exp.location}` : ""}
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

  const renderProjects = (customTitle?: string) => {
    if (projects.length === 0) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "projects", "Projects"))}
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{proj.name}</span>
                {proj.link && (
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: primaryColor }}
                  >
                    {proj.link}
                  </span>
                )}
              </div>
              {proj.roleOrSubtitle && (
                <div className="text-slate-500 text-[11px] italic">
                  {proj.roleOrSubtitle}
                </div>
              )}
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Stack: {proj.techStack.join(", ")}
                </div>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-slate-700">
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

  const renderEducation = (customTitle?: string) => {
    if (education.length === 0) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "education", "Education"))}
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{edu.degree}</span>
                <span className="text-slate-400 font-medium text-[11px] shrink-0">
                  {edu.startDate} – {edu.isCurrent ? "Present" : edu.endDate}
                </span>
              </div>
              <div className="text-slate-600 text-xs mt-0.5">
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ""}
              </div>
              {edu.gradeOrGpa && (
                <div className="text-slate-500 text-[11px] mt-0.5">
                  {edu.gradeOrGpa}
                </div>
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

  const renderSkills = (customTitle?: string) => {
    if (skillCategories.length === 0) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "skills", "Skills & Competencies"))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {skillCategories.map((sc) => (
            <div
              key={sc.id}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="font-bold text-slate-800 text-[11px] mb-1">
                {sc.categoryName}
              </div>
              <div className="text-slate-600 text-[11px]">
                {sc.skills.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = (customTitle?: string) => {
    if (certifications.length === 0) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "certifications", "Certifications"))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {certifications.map((c) => (
            <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="font-semibold text-slate-900">{c.name}</div>
              <div className="text-slate-500 text-[10px]">
                {c.issuer} {c.issueDate ? `(${c.issueDate})` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCustomSectionItem = (customId?: string, customTitle?: string) => {
    const cs = customSections.find((c) => c.id === customId && c.visible);
    if (!cs || cs.items.length === 0) return null;
    return (
      <section key={cs.id}>
        {renderSectionTitle(customTitle || cs.title)}
        <div className="space-y-2 text-xs">
          {cs.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{item.title}</span>
                {item.date && (
                  <span className="text-slate-400 font-normal">
                    {item.date}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <div className="text-slate-500 italic">{item.subtitle}</div>
              )}
              {item.description && (
                <p className="text-slate-700 mt-0.5">{item.description}</p>
              )}
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
    );
  };

  const renderSectionByKey = (
    key: ResumeSectionKey,
    title: string,
    customId?: string,
  ) => {
    switch (key) {
      case "summary":
        return renderSummary(title);
      case "experience":
        return renderExperience(title);
      case "projects":
        return renderProjects(title);
      case "education":
        return renderEducation(title);
      case "skills":
        return renderSkills(title);
      case "certifications":
        return renderCertifications(title);
      case "custom":
        return renderCustomSectionItem(customId, title);
      default:
        return null;
    }
  };

  const renderFooter = (pageNumber: number) => {
    if (!styling.showPageNumbers) return null;
    return (
      <footer className="mt-auto pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <span>{contact.fullName || "Candidate Resume"}</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </footer>
    );
  };

  const effectiveSections = getEffectiveSectionOrder(resume);
  const splitIndex =
    splitAt === "projects"
      ? effectiveSections.findIndex((s) => s.key === "projects")
      : splitAt === "education"
        ? effectiveSections.findIndex((s) => s.key === "education")
        : splitAt === "skills"
          ? effectiveSections.findIndex((s) => s.key === "skills")
          : Math.ceil(effectiveSections.length / 2);

  const actualSplitIndex =
    splitIndex > 0 ? splitIndex : Math.max(1, Math.floor(effectiveSections.length / 2));
  const page1Sections = hasPage2
    ? effectiveSections.slice(0, actualSplitIndex)
    : effectiveSections;
  const page2Sections = hasPage2 ? effectiveSections.slice(actualSplitIndex) : [];

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
          <main className="space-y-4">
            {page1Sections.map((s) => (
              <React.Fragment key={`${s.key}-${s.customId || ""}`}>
                {renderSectionByKey(s.key, s.title, s.customId)}
              </React.Fragment>
            ))}
          </main>
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
            <main className="space-y-4">
              {page2Sections.map((s) => (
                <React.Fragment key={`${s.key}-${s.customId || ""}`}>
                  {renderSectionByKey(s.key, s.title, s.customId)}
                </React.Fragment>
              ))}
            </main>
          </div>
          {renderFooter(2)}
        </div>
      )}
    </div>
  );
};
