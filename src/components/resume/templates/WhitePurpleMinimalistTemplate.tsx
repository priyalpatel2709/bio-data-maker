import React from "react";
import { ResumeDocument } from "../../../types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface TemplateProps {
  resume: ResumeDocument;
}

export const WhitePurpleMinimalistTemplate: React.FC<TemplateProps> = ({
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

  const primaryColor = styling.primaryColor || "#7F55DA";
  const secondaryColor = styling.secondaryColor || "#6D28D9";
  const textColor = styling.textColor || "#181E27";
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
    fontFamily: `${styling.fontFamily || "Inter"}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    color: textColor,
    width: docWidth,
    minHeight: docMinHeight,
    boxSizing: "border-box" as const,
  };

  const isSinglePage = styling.pageSplitAt === "single-page";
  const splitAt = styling.pageSplitAt || "auto";

  // Auto split logic
  const hasPage2 =
    !isSinglePage &&
    (experience.length > 3 ||
      projects.length > 2 ||
      education.length > 2 ||
      certifications.length > 2 ||
      customSections.length > 0);

  const totalPages = hasPage2 ? 2 : 1;

  // Header Component (Signature top row: Name/title on left, Summary on right)
  const renderHeader = (isPage2: boolean = false) => {
    if (isPage2) {
      if (!styling.showPage2Header) return null;
      return (
        <header className="border-b border-slate-200 pb-3 mb-6 flex flex-row items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              {contact.fullName || "Candidate Name"}
            </span>
            {contact.jobTitle && (
              <span
                className="ml-2 font-semibold"
                style={{ color: primaryColor }}
              >
                — {contact.jobTitle}
              </span>
            )}
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Page 2 of 2
          </span>
        </header>
      );
    }

    return (
      <header className="mb-6">
        {/* Top Row: Name + Title on Left, Summary on Right */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-4">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#181E27] leading-tight">
              {contact.fullName || "Your Full Name"}
            </h1>
            {contact.jobTitle && (
              <p
                className="text-sm sm:text-base font-semibold mt-1 tracking-wide"
                style={{ color: primaryColor }}
              >
                {contact.jobTitle}
              </p>
            )}
          </div>

          {/* Photo if enabled */}
          {styling.showPhoto && contact.photoUrl && (
            <img
              src={contact.photoUrl}
              alt={contact.fullName}
              className={`w-20 h-20 object-cover shadow-xs border-2 shrink-0 ${
                styling.photoShape === "circle"
                  ? "rounded-full"
                  : styling.photoShape === "rounded"
                    ? "rounded-xl"
                    : "rounded-none"
              }`}
              style={{ borderColor: primaryColor }}
            />
          )}

          {/* Summary / Bio on Right Side */}
          {summary && (
            <div className="sm:max-w-xs text-xs text-[#666A72] leading-relaxed">
              <p>{summary}</p>
            </div>
          )}
        </div>

        {/* Horizontal Contact Row Framed by Subtle Lines */}
        <div className="border-y border-slate-200/80 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-700">
          {contact.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span className="font-medium text-[#181E27]">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{contact.location}</span>
            </div>
          )}
          {contact.linkedin && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <Linkedin
                className="w-3.5 h-3.5"
                style={{ color: primaryColor }}
              />
              <span>
                {contact.linkedin.replace(
                  /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                  "",
                )}
              </span>
            </div>
          )}
          {contact.github && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <Github className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>
                {contact.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
              </span>
            </div>
          )}
          {contact.website && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{contact.website.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
        </div>
      </header>
    );
  };

  const renderSectionHeader = (title: string) => (
    <h2 className="text-xs font-bold uppercase tracking-wider text-[#181E27] mb-3">
      {title}
    </h2>
  );

  // Left Column: Skills (categorized with light purple pill tags), Education, Certifications, Languages
  const renderLeftColumn = (isPage2: boolean = false) => (
    <div className="w-[34%] shrink-0 pr-6 border-r border-slate-200/80 space-y-6">
      {/* Skills Section */}
      {skillCategories.length > 0 && !isPage2 && (
        <section>
          {renderSectionHeader("Skills")}
          <div className="space-y-3.5">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-xs font-semibold text-slate-800 mb-1.5">
                  {cat.categoryName}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F6F6FF] text-[#181E27] border border-[#7F55DA]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section>
          {renderSectionHeader("Education")}
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <p className="font-bold text-[#181E27] leading-snug">
                  {edu.degree}
                  {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                </p>
                <p className="text-[11px] text-[#666A72] mt-0.5 font-medium">
                  {edu.institution}
                </p>
                <p className="text-[11px] text-[#666A72]">
                  {edu.startDate && edu.endDate
                    ? `${edu.startDate} – ${edu.endDate}`
                    : edu.endDate || ""}
                  {edu.gradeOrGpa ? ` • GPA: ${edu.gradeOrGpa}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <section>
          {renderSectionHeader("Certification")}
          <div className="space-y-2.5 text-xs">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <p className="font-bold text-[#181E27] leading-snug">
                  {cert.name}
                </p>
                <p className="text-[11px] text-[#666A72]">
                  {cert.issuer}
                  {cert.issueDate ? ` – ${cert.issueDate}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Left Sections or Languages */}
      {customSections
        .filter((cs) => cs.visible)
        .map((cs) => (
          <section key={cs.id}>
            {renderSectionHeader(cs.title)}
            <div className="space-y-2 text-xs">
              {cs.items.map((item) => (
                <div key={item.id} className="text-slate-800">
                  <span className="font-bold">{item.title}</span>
                  {item.subtitle && (
                    <span className="text-[#666A72] ml-1">
                      ({item.subtitle})
                    </span>
                  )}
                  {item.description && (
                    <p className="text-[11px] text-[#666A72] mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
    </div>
  );

  // Right Column: Work Experience (with Purple Date Pill Badges) + Featured Projects
  const renderRightColumn = (isPage2: boolean = false) => {
    const experienceToRender = isPage2
      ? experience.slice(2)
      : hasPage2
        ? experience.slice(0, 2)
        : experience;

    const projectsToRender = isPage2
      ? projects.slice(2)
      : hasPage2
        ? projects.slice(0, 2)
        : projects;

    return (
      <div className="w-[66%] pl-6 space-y-6">
        {/* Work Experience */}
        {experienceToRender.length > 0 && (
          <section>
            {renderSectionHeader("Work Experience")}
            <div className="space-y-5">
              {experienceToRender.map((exp) => (
                <div key={exp.id}>
                  {/* Position + Solid Purple Date Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#181E27]">
                      {exp.position}
                    </h3>
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shrink-0 tracking-wide"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>

                  {/* Company & Location */}
                  <p className="text-xs text-[#666A72] font-medium mb-2">
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </p>

                  {/* Bullets */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed list-disc list-outside ml-4">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects Grid */}
        {projectsToRender.length > 0 && (
          <section>
            {renderSectionHeader("Featured Projects")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectsToRender.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <h4
                      className="text-xs font-bold leading-snug mb-1"
                      style={{ color: primaryColor }}
                    >
                      {proj.name}
                    </h4>

                    {/* Tech Stack Pills */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {proj.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F6F6FF] border border-[#7F55DA]/20"
                            style={{ color: primaryColor }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description or Bullets */}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-4">
                        {proj.bullets[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  const renderFooter = (pageNumber: number) => {
    if (!styling.showPageNumbers) return null;
    return (
      <footer className="w-full pt-4 mt-auto border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>{contact.fullName || "Candidate"} — Resume</span>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
      </footer>
    );
  };

  // Single Page View
  if (!hasPage2) {
    return (
      <div id="resume-preview-document" className="flex flex-col gap-8">
        <div
          id="resume-page-1"
          style={fontStyle}
          className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-md print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
        >
          <div>
            {renderHeader(false)}
            <div className="flex flex-row">{renderLeftColumn(false)}{renderRightColumn(false)}</div>
          </div>
          {renderFooter(1)}
        </div>
      </div>
    );
  }

  // Multi-Page View
  return (
    <div id="resume-preview-document" className="flex flex-col gap-8">
      {/* PAGE 1 */}
      <div
        id="resume-page-1"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-md print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div>
          {renderHeader(false)}
          <div className="flex flex-row">{renderLeftColumn(false)}{renderRightColumn(false)}</div>
        </div>
        {renderFooter(1)}
      </div>

      {/* PAGE 2 */}
      <div
        id="resume-page-2"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-slate-800 shadow-md print:shadow-none print:p-0 relative mx-auto box-border flex flex-col justify-between`}
      >
        <div>
          {renderHeader(true)}
          <div className="flex flex-row">{renderLeftColumn(true)}{renderRightColumn(true)}</div>
        </div>
        {renderFooter(2)}
      </div>
    </div>
  );
};
