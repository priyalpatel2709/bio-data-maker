import React from "react";
import { ResumeDocument, ResumeSectionKey } from "../../../types/resume";
import {
  getEffectiveSectionOrder,
  getSectionTitle,
} from "./templateUtils";

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

  const primaryColor = styling.primaryColor || "#7C2D12";
  const textColor = styling.textColor || "#1C1917";
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
    fontFamily: `${styling.fontFamily || "Playfair Display"}, Georgia, serif`,
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

  // Header Component (Vienna signature airy & chic)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b border-stone-200 pb-2 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-bold text-stone-900 text-sm tracking-wide">
              {contact.fullName || "Candidate Name"}
            </span>
            {contact.jobTitle && (
              <span className="text-stone-500 ml-2 italic">
                — {contact.jobTitle}
              </span>
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
                styling.photoShape === "circle"
                  ? "rounded-full"
                  : styling.photoShape === "rounded"
                    ? "rounded-lg"
                    : "rounded-none"
              }`}
              style={{ borderColor: `${primaryColor}40` }}
            />
          )}

          <h1
            className="text-3xl sm:text-4xl font-normal tracking-tight"
            style={{ color: primaryColor }}
          >
            {contact.fullName || "Your Full Name"}
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
              <span>
                •{" "}
                {contact.linkedin.replace(
                  /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                  "",
                )}
              </span>
            )}
            {contact.github && (
              <span>
                •{" "}
                {contact.github.replace(
                  /^https?:\/\/(www\.)?github\.com\//,
                  "",
                )}
              </span>
            )}
            {contact.website && (
              <span>• {contact.website.replace(/^https?:\/\//, "")}</span>
            )}
          </div>
        </div>
      </header>
    );
  };

  const renderSectionTitle = (title: string) => (
    <div className="mb-2.5">
      <h2
        className="text-xs font-semibold uppercase tracking-widest pb-1 border-b"
        style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
      >
        {title}
      </h2>
    </div>
  );

  const renderSummary = (customTitle?: string) => {
    if (!summary) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "summary", "Profile"))}
        <p className="text-xs text-stone-700 leading-relaxed text-justify font-sans">
          {summary}
        </p>
      </section>
    );
  };

  const renderExperience = (customTitle?: string) => {
    if (experience.length === 0) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "experience", "Experience"))}
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs font-sans">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-stone-900 text-[13px] font-serif">
                  {exp.position}
                </span>
                <span className="text-stone-400 font-medium text-[11px] shrink-0">
                  {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="text-stone-600 italic text-xs mt-0.5">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-stone-700">
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
            <div key={proj.id} className="text-xs font-sans">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-stone-900 font-serif">
                  {proj.name}
                </span>
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
                <div className="text-stone-500 text-[11px] italic">
                  {proj.roleOrSubtitle}
                </div>
              )}
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Stack: {proj.techStack.join(", ")}
                </div>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-stone-700">
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
            <div key={edu.id} className="text-xs font-sans">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-stone-900 font-serif">
                  {edu.degree}
                </span>
                <span className="text-stone-400 font-medium text-[11px] shrink-0">
                  {edu.startDate} – {edu.isCurrent ? "Present" : edu.endDate}
                </span>
              </div>
              <div className="text-stone-600 text-xs mt-0.5">
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ""}
              </div>
              {edu.gradeOrGpa && (
                <div className="text-stone-500 text-[11px] mt-0.5 italic">
                  {edu.gradeOrGpa}
                </div>
              )}
              {edu.bullets && edu.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-xs text-stone-700">
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
        {renderSectionTitle(customTitle || getSectionTitle(resume, "skills", "Skills & Abilities"))}
        <div className="space-y-2 text-xs font-sans">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <span className="font-bold text-stone-900 w-32 shrink-0">
                {sc.categoryName}:
              </span>
              <span className="text-stone-700 flex-1">
                {sc.skills.join(", ")}
              </span>
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
        <div className="space-y-1.5 text-xs font-sans">
          {certifications.map((c) => (
            <div key={c.id}>
              <span className="font-semibold text-stone-900">{c.name}</span>
              <span className="text-stone-500 text-[11px] ml-1.5">
                — {c.issuer} {c.issueDate ? `(${c.issueDate})` : ""}
              </span>
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
        <div className="space-y-2 text-xs font-sans">
          {cs.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-baseline font-bold text-stone-900 font-serif">
                <span>{item.title}</span>
                {item.date && (
                  <span className="text-stone-400 font-normal text-[11px] font-sans">
                    {item.date}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <div className="text-stone-500 italic text-[11px]">
                  {item.subtitle}
                </div>
              )}
              {item.description && (
                <p className="text-stone-700 mt-0.5">{item.description}</p>
              )}
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
      <footer className="mt-auto pt-3 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400 font-sans">
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
