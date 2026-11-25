import React from "react";
import { ResumeDocument, ResumeSectionKey } from "../../../types/resume";
import {
  getEffectiveSectionOrder,
  getSectionTitle,
} from "./templateUtils";

interface TemplateProps {
  resume: ResumeDocument;
}

export const CompactEngineeringTemplate: React.FC<TemplateProps> = ({
  resume,
}) => {
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

  const primaryColor = styling.primaryColor || "#047857";

  const isLetter = styling.paperSize === "letter";
  const docWidth = isLetter ? "816px" : "794px";
  const docMinHeight = isLetter ? "1056px" : "1123px";

  const paddingClass =
    styling.pageMargin === "compact"
      ? "p-5"
      : styling.pageMargin === "spacious"
        ? "p-10"
        : "p-7";

  const fontStyle = {
    fontFamily: `${styling.fontFamily || "Inter"}, system-ui, sans-serif`,
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

  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header
          className="border-b pb-2 mb-3 flex flex-row items-center justify-between text-xs"
          style={{ borderColor: primaryColor }}
        >
          <div>
            <span className="font-bold text-slate-900 text-sm">
              {contact.fullName}
            </span>
            {contact.jobTitle && (
              <span className="text-emerald-800 font-semibold ml-2">
                [{contact.jobTitle}]
              </span>
            )}
          </div>
          <span className="font-mono text-slate-500 text-[10px]">
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header
        className="border-b pb-3 mb-3"
        style={{ borderColor: primaryColor }}
      >
        <div className="flex flex-row items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {contact.fullName || "Your Full Name"}
            </h1>
            {contact.jobTitle && (
              <p className="text-xs font-semibold text-emerald-800 tracking-wide mt-0.5">
                {contact.jobTitle}
              </p>
            )}
          </div>
          <div className="text-right text-[11px] text-slate-600 flex flex-col items-end gap-0.5">
            <span>
              {contact.email} • {contact.phone}
            </span>
            <span>
              {contact.location}{" "}
              {contact.github && (
                <>
                  •{" "}
                  <span className="font-mono">
                    {contact.github.replace(/^https?:\/\//, "")}
                  </span>
                </>
              )}
            </span>
            {contact.website && (
              <span className="font-mono text-[10px] text-emerald-700">
                {contact.website.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        </div>
      </header>
    );
  };

  const renderSummary = (customTitle?: string) => {
    if (!summary) return null;
    return (
      <section>
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "summary", "Summary")}
        </h2>
        <p className="text-slate-700 leading-snug">{summary}</p>
      </section>
    );
  };

  const renderSkills = (customTitle?: string) => {
    if (skillCategories.length === 0) return null;
    return (
      <section>
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "skills", "Technical Proficiencies")}
        </h2>
        <div className="bg-slate-50 p-2 rounded border border-slate-200/80 space-y-1">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <span className="font-bold text-slate-900 w-32 shrink-0">
                {sc.categoryName}:
              </span>
              <span className="text-slate-700 flex-1">
                {sc.skills.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderExperience = (customTitle?: string) => {
    if (experience.length === 0) return null;
    return (
      <section>
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "experience", "Experience")}
        </h2>
        <div className="space-y-2.5">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">
                  {exp.position}{" "}
                  <span className="text-slate-600 font-medium">
                    @ {exp.company}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-slate-700">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">
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
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "projects", "Key Projects")}
        </h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex flex-row justify-between items-baseline gap-2">
                <div>
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.techStack && (
                    <span className="text-[11px] text-slate-500 font-mono ml-2">
                      [{proj.techStack.join(", ")}]
                    </span>
                  )}
                </div>
                {proj.link && (
                  <span className="text-[10px] text-emerald-700 font-mono">
                    {proj.link}
                  </span>
                )}
              </div>
              {proj.bullets.length > 0 && (
                <ul className="mt-0.5 space-y-0.5 list-disc list-outside ml-4 text-slate-700">
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
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "education", "Education")}
        </h2>
        {education.map((edu) => (
          <div key={edu.id} className="text-slate-800">
            <p className="font-bold">
              {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
            </p>
            <p className="text-slate-600 text-[11px]">
              {edu.institution} ({edu.startDate}-
              {edu.isCurrent ? "Present" : edu.endDate})
            </p>
            {edu.gradeOrGpa && (
              <p className="text-[10px] italic text-slate-500">
                {edu.gradeOrGpa}
              </p>
            )}
          </div>
        ))}
      </section>
    );
  };

  const renderCertifications = (customTitle?: string) => {
    if (certifications.length === 0) return null;
    return (
      <section>
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "certifications", "Certifications")}
        </h2>
        <div className="space-y-1">
          {certifications.map((c) => (
            <div key={c.id}>
              <p className="font-bold text-slate-800 leading-tight">{c.name}</p>
              <p className="text-[10px] text-slate-500">
                {c.issuer} {c.issueDate ? `• ${c.issueDate}` : ""}
              </p>
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
        <h2
          className="text-[11px] font-bold uppercase tracking-wider mb-1"
          style={{ color: primaryColor }}
        >
          {customTitle || cs.title}
        </h2>
        <div className="space-y-1 text-slate-700">
          {cs.items.map((it) => (
            <div key={it.id}>
              <strong>{it.title}</strong>
              {it.subtitle && <span> — {it.subtitle}</span>}
              {it.description && (
                <p className="text-slate-600">{it.description}</p>
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
      case "skills":
        return renderSkills(title);
      case "experience":
        return renderExperience(title);
      case "projects":
        return renderProjects(title);
      case "education":
        return renderEducation(title);
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
      <footer className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>{contact.fullName} — Engineering Resume</span>
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

  if (!hasPage2) {
    return (
      <div id="resume-preview-document" className="flex flex-col gap-8">
        <div
          id="resume-page-1"
          style={fontStyle}
          className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
        >
          <div className="space-y-3">
            {renderHeader(false)}
            {effectiveSections.map((s) => (
              <React.Fragment key={`${s.key}-${s.customId || ""}`}>
                {renderSectionByKey(s.key, s.title, s.customId)}
              </React.Fragment>
            ))}
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
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-3">
          {renderHeader(false)}
          {page1Sections.map((s) => (
            <React.Fragment key={`${s.key}-${s.customId || ""}`}>
              {renderSectionByKey(s.key, s.title, s.customId)}
            </React.Fragment>
          ))}
        </div>
        {renderFooter(1)}
      </div>

      {/* PAGE 2 */}
      <div
        id="resume-page-2"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-3">
          {renderHeader(true)}
          {page2Sections.map((s) => (
            <React.Fragment key={`${s.key}-${s.customId || ""}`}>
              {renderSectionByKey(s.key, s.title, s.customId)}
            </React.Fragment>
          ))}
        </div>
        {renderFooter(2)}
      </div>
    </div>
  );
};
