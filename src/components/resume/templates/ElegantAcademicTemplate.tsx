import React from "react";
import { ResumeDocument, ResumeSectionKey } from "../../../types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import {
  getEffectiveSectionOrder,
  getSectionTitle,
} from "./templateUtils";

interface TemplateProps {
  resume: ResumeDocument;
}

export const ElegantAcademicTemplate: React.FC<TemplateProps> = ({
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

  const primaryColor = styling.primaryColor || "#7C2D12";

  const isLetter = styling.paperSize === "letter";
  const docWidth = isLetter ? "816px" : "794px";
  const docMinHeight = isLetter ? "1056px" : "1123px";

  const paddingClass =
    styling.pageMargin === "compact"
      ? "p-6"
      : styling.pageMargin === "spacious"
        ? "p-12"
        : "p-10";

  const fontStyle = {
    fontFamily: `${styling.fontFamily || "Lora"}, Georgia, serif`,
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
        <header className="border-b border-stone-300 pb-2.5 mb-4 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-serif font-semibold text-stone-900 text-sm">
              {contact.fullName}
            </span>
            {contact.jobTitle && (
              <span className="font-serif italic text-stone-600 ml-2">
                — {contact.jobTitle}
              </span>
            )}
          </div>
          <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400">
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header className="border-b-2 border-stone-800 pb-4 mb-4 text-center">
        <h1
          className="text-3xl font-serif font-bold tracking-tight"
          style={{ color: primaryColor }}
        >
          {contact.fullName || "Your Full Name"}
        </h1>
        {contact.jobTitle && (
          <p className="text-sm font-serif italic text-stone-700 mt-1">
            {contact.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2.5 font-sans text-xs text-stone-600">
          {contact.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-500" /> {contact.location}
            </span>
          )}
          {contact.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-500" /> {contact.phone}
            </span>
          )}
          {contact.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-stone-500" /> {contact.email}
            </span>
          )}
          {contact.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-stone-500" /> {contact.linkedin}
            </span>
          )}
          {contact.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-stone-500" />{" "}
              {contact.website.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
      </header>
    );
  };

  const renderEducation = (customTitle?: string) => {
    if (education.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-2"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "education", "Education")}
        </h2>
        <div className="space-y-2.5">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-semibold text-stone-900 text-sm">
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  {edu.startDate} – {edu.isCurrent ? "Present" : edu.endDate}
                </span>
              </div>
              <p className="text-xs text-stone-700 italic">
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ""}
              </p>
              {edu.gradeOrGpa && (
                <p className="text-xs text-stone-600 mt-0.5">
                  {edu.gradeOrGpa}
                </p>
              )}
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
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-2"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "experience", "Appointments & Experience")}
        </h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-semibold text-stone-900 text-sm">
                  {exp.position},{" "}
                  <span className="italic font-normal">{exp.company}</span>
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-outside ml-4 text-xs text-stone-800 leading-relaxed">
                  {exp.bullets.map((b, idx) => (
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

  const renderSummary = (customTitle?: string) => {
    if (!summary) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "summary", "Research & Professional Profile")}
        </h2>
        <p className="text-xs text-stone-800 leading-relaxed text-justify">
          {summary}
        </p>
      </section>
    );
  };

  const renderProjects = (customTitle?: string) => {
    if (projects.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-2"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "projects", "Publications & Projects")}
        </h2>
        <div className="space-y-2">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex flex-row justify-between items-baseline gap-2">
                <span className="font-semibold text-stone-900">
                  {proj.name}
                </span>
                {proj.link && (
                  <span className="text-xs font-sans text-stone-500">
                    {proj.link}
                  </span>
                )}
              </div>
              {proj.roleOrSubtitle && (
                <p className="italic text-xs text-stone-600">
                  {proj.roleOrSubtitle}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-0.5 space-y-0.5 list-disc list-outside ml-4 text-stone-800">
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

  const renderCertifications = (customTitle?: string) => {
    if (certifications.length === 0) return null;
    return (
      <section>
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "certifications", "Honors & Certifications")}
        </h2>
        <div className="space-y-1 text-xs text-stone-800">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="flex flex-row justify-between items-baseline gap-2"
            >
              <span>
                <strong>{c.name}</strong> — {c.issuer}
              </span>
              {c.issueDate && (
                <span className="text-stone-500 font-sans">{c.issueDate}</span>
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
        <h2
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          {customTitle || getSectionTitle(resume, "skills", "Core Expertise")}
        </h2>
        <div className="space-y-1 text-xs text-stone-800">
          {skillCategories.map((sc) => (
            <div key={sc.id} className="flex flex-row items-baseline gap-2">
              <strong className="w-36 shrink-0">{sc.categoryName}: </strong>
              <span className="flex-1">{sc.skills.join(", ")}</span>
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
          className="font-serif text-sm font-semibold tracking-wider uppercase border-b border-stone-300 pb-1 mb-1.5"
          style={{ color: primaryColor }}
        >
          {customTitle || cs.title}
        </h2>
        <div className="space-y-1 text-xs text-stone-800">
          {cs.items.map((it) => (
            <div key={it.id}>
              <strong>{it.title}</strong>
              {it.subtitle && <span> — {it.subtitle}</span>}
              {it.description && (
                <p className="text-stone-600 mt-0.5">{it.description}</p>
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
      case "education":
        return renderEducation(title);
      case "experience":
        return renderExperience(title);
      case "summary":
        return renderSummary(title);
      case "projects":
        return renderProjects(title);
      case "certifications":
        return renderCertifications(title);
      case "skills":
        return renderSkills(title);
      case "custom":
        return renderCustomSectionItem(customId, title);
      default:
        return null;
    }
  };

  const renderFooter = (pageNumber: number) => {
    if (!styling.showPageNumbers) return null;
    return (
      <footer className="mt-auto pt-3 border-t border-stone-200 flex items-center justify-between font-sans text-[10px] text-stone-400">
        <span>{contact.fullName} — Academic Curriculum Vitae</span>
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
          className={`resume-page-sheet bg-[#FDFAF7] ${paddingClass} text-stone-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
        >
          <div className="space-y-4">
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
        className={`resume-page-sheet bg-[#FDFAF7] ${paddingClass} text-stone-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-4">
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
        className={`resume-page-sheet bg-[#FDFAF7] ${paddingClass} text-stone-900 shadow-sm print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div className="space-y-4">
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
