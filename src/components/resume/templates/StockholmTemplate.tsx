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

export const StockholmTemplate: React.FC<TemplateProps> = ({ resume }) => {
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

  const primaryColor = styling.primaryColor || "#0F766E";
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
    fontFamily: `${styling.fontFamily || "Inter"}, -apple-system, BlinkMacSystemFont, sans-serif`,
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

  // Header Component (Stockholm signature header banner)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b border-slate-200 pb-2 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              {contact.fullName || "Candidate"}
            </span>
            {contact.jobTitle && (
              <span className="text-slate-500 ml-2 font-medium">
                | {contact.jobTitle}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header className="border-b-2 border-slate-900 pb-4 mb-5">
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">
              {contact.fullName || "Your Full Name"}
            </h1>
            {contact.jobTitle && (
              <p
                className="text-xs font-bold uppercase tracking-wider mt-1"
                style={{ color: primaryColor }}
              >
                {contact.jobTitle}
              </p>
            )}
          </div>

          {styling.showPhoto && contact.photoUrl && (
            <img
              src={contact.photoUrl}
              alt={contact.fullName}
              className={`w-16 h-16 object-cover border-2 shadow-xs shrink-0 ${
                styling.photoShape === "circle"
                  ? "rounded-full"
                  : styling.photoShape === "rounded"
                    ? "rounded-xl"
                    : "rounded-none"
              }`}
              style={{ borderColor: primaryColor }}
            />
          )}
        </div>
      </header>
    );
  };

  const renderSectionTitle = (title: string) => (
    <div className="mb-2.5">
      <h2
        className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
      >
        {title}
      </h2>
    </div>
  );

  // Left Column Details & Skills (Stockholm signature)
  const renderLeftColumn = () => (
    <div className="w-[210px] shrink-0 space-y-5 text-xs pr-4 border-r border-slate-200">
      {/* Details */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-100 pb-1">
          Personal Details
        </h3>
        <div className="space-y-2 text-slate-600 text-[11px]">
          {contact.email && (
            <div className="break-words">
              <span className="font-semibold block text-slate-800">Email</span>
              {contact.email}
            </div>
          )}
          {contact.phone && (
            <div>
              <span className="font-semibold block text-slate-800">Phone</span>
              {contact.phone}
            </div>
          )}
          {contact.location && (
            <div>
              <span className="font-semibold block text-slate-800">
                Location
              </span>
              {contact.location}
            </div>
          )}
          {contact.linkedin && (
            <div className="break-words">
              <span className="font-semibold block text-slate-800">
                LinkedIn
              </span>
              {contact.linkedin.replace(
                /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                "",
              )}
            </div>
          )}
          {contact.github && (
            <div className="break-words">
              <span className="font-semibold block text-slate-800">GitHub</span>
              {contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
            </div>
          )}
          {contact.website && (
            <div className="break-words">
              <span className="font-semibold block text-slate-800">
                Portfolio
              </span>
              {contact.website.replace(/^https?:\/\//, "")}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {skillCategories.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-100 pb-1">
            {getSectionTitle(resume, "skills", "Skills")}
          </h3>
          <div className="space-y-2.5">
            {skillCategories.map((sc) => (
              <div key={sc.id}>
                <div className="font-semibold text-slate-800 text-[11px] mb-1">
                  {sc.categoryName}
                </div>
                <div className="flex flex-wrap gap-1">
                  {sc.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications in sidebar */}
      {certifications.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-100 pb-1">
            {getSectionTitle(resume, "certifications", "Certifications")}
          </h3>
          <div className="space-y-2 text-[11px]">
            {certifications.map((c) => (
              <div key={c.id}>
                <div className="font-semibold text-slate-900">{c.name}</div>
                <div className="text-slate-500 text-[10px]">
                  {c.issuer} {c.issueDate ? `(${c.issueDate})` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Right Column Content
  const renderSummary = (customTitle?: string) => {
    if (!summary) return null;
    return (
      <section>
        {renderSectionTitle(customTitle || getSectionTitle(resume, "summary", "Profile"))}
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
        {renderSectionTitle(customTitle || getSectionTitle(resume, "experience", "Employment History"))}
        <div className="space-y-3.5">
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900 text-[13px]">
                  {exp.position}
                </span>
                <span className="text-slate-400 font-medium text-[11px] shrink-0">
                  {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              <div className="text-slate-600 font-medium text-xs mt-0.5">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
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
                  {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
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

  const renderRightSectionByKey = (
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
  const mainSections = effectiveSections.filter(
    (s) => s.key !== "skills" && s.key !== "certifications" && s.key !== "contact",
  );

  const splitIndex =
    splitAt === "projects"
      ? mainSections.findIndex((s) => s.key === "projects")
      : splitAt === "education"
        ? mainSections.findIndex((s) => s.key === "education")
        : Math.ceil(mainSections.length / 2);

  const actualSplitIndex =
    splitIndex > 0 ? splitIndex : Math.max(1, Math.floor(mainSections.length / 2));
  const page1Sections = hasPage2
    ? mainSections.slice(0, actualSplitIndex)
    : mainSections;
  const page2Sections = hasPage2 ? mainSections.slice(actualSplitIndex) : [];

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
            {renderLeftColumn()}
            <main className="flex-1 space-y-4">
              {page1Sections.map((s) => (
                <React.Fragment key={`${s.key}-${s.customId || ""}`}>
                  {renderRightSectionByKey(s.key, s.title, s.customId)}
                </React.Fragment>
              ))}
            </main>
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
              {/* Continued sidebar details placeholder for visual balance */}
              <div className="w-[210px] shrink-0 pr-4 border-r border-slate-200 text-xs space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Continued
                </div>
                <div className="text-[11px] text-slate-500">
                  {contact.fullName}
                  {contact.phone && <div className="mt-1">{contact.phone}</div>}
                  {contact.email && (
                    <div className="mt-0.5 break-words">{contact.email}</div>
                  )}
                </div>
              </div>
              <main className="flex-1 space-y-4">
                {page2Sections.map((s) => (
                  <React.Fragment key={`${s.key}-${s.customId || ""}`}>
                    {renderRightSectionByKey(s.key, s.title, s.customId)}
                  </React.Fragment>
                ))}
              </main>
            </div>
          </div>
          {renderFooter(2)}
        </div>
      )}
    </div>
  );
};
