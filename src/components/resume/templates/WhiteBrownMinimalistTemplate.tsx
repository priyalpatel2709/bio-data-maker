import React from "react";
import { ResumeDocument } from "../../../types/resume";
import { getSectionTitle } from "./templateUtils";

interface TemplateProps {
  resume: ResumeDocument;
}

export const WhiteBrownMinimalistTemplate: React.FC<TemplateProps> = ({
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

  const primaryColor = styling.primaryColor || "#9D7660";
  const textColor = styling.textColor || "#1C1917";
  const isLetter = styling.paperSize === "letter";
  const docWidth = isLetter ? "816px" : "794px";
  const docMinHeight = isLetter ? "1056px" : "1123px";

  const paddingClass =
    styling.pageMargin === "compact"
      ? "p-6"
      : styling.pageMargin === "spacious"
        ? "p-10"
        : "p-8";

  const fontStyle = {
    fontFamily: `${styling.fontFamily || "Lora"}, Georgia, 'Times New Roman', serif`,
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
      projects.length > 0 ||
      education.length > 2 ||
      certifications.length > 3 ||
      customSections.length > 0);

  const totalPages = hasPage2 ? 2 : 1;

  // Flattened skills for display
  const allSkills = skillCategories.flatMap((sc) => sc.skills);

  // Section title in left column (Brown uppercase serif)
  const renderLeftSectionTitle = (title: string) => (
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-2.5 font-serif"
      style={{ color: primaryColor }}
    >
      {title}
    </h2>
  );

  // Section title in right column (White uppercase serif)
  const renderRightSectionTitle = (title: string) => (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-3 font-serif text-white border-b border-white/20 pb-1">
      {title}
    </h2>
  );

  // Left Column Content: Profile, Contact, Skills, Education, Languages/Custom
  const renderLeftColumn = (isPage2: boolean = false) => {
    if (isPage2) {
      return (
        <div className="w-[42%] shrink-0 pr-6 space-y-6">
          {education.length > 0 && (
            <section>
              {renderLeftSectionTitle("Education")}
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-stone-900 leading-snug">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </p>
                    <p className="text-[11px] text-stone-600 mt-0.5 font-sans">
                      {edu.institution}
                      {edu.startDate && edu.endDate
                        ? ` | ${edu.startDate}–${edu.endDate}`
                        : edu.endDate
                          ? ` | ${edu.endDate}`
                          : ""}
                    </p>
                    {edu.gradeOrGpa && (
                      <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                        GPA: {edu.gradeOrGpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections assigned to left column */}
          {customSections
            .filter((cs) => cs.visible)
            .map((cs) => (
              <section key={cs.id}>
                {renderLeftSectionTitle(cs.title)}
                <ul className="space-y-1.5 text-xs text-stone-700 font-sans">
                  {cs.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div>
                        <span className="font-semibold text-stone-900">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-stone-500 ml-1">
                            ({item.subtitle})
                          </span>
                        )}
                        {item.description && (
                          <p className="text-[11px] text-stone-600 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      );
    }

    return (
      <div className="w-[42%] shrink-0 pr-6 flex flex-col justify-between space-y-5">
        <div>
          {/* Header Name & Job Title */}
          <header className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-stone-900 font-serif leading-tight">
              {contact.fullName || "Candidate Name"}
            </h1>
            {contact.jobTitle && (
              <p className="text-xs sm:text-sm font-medium tracking-wide text-stone-600 mt-1 font-sans">
                {contact.jobTitle}
              </p>
            )}
            {/* Brown decorative bar */}
            <div
              className="h-[3.5px] w-28 mt-3 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
          </header>

          {/* Profile / Summary */}
          {summary && (
            <section className="mb-5">
              {renderLeftSectionTitle(getSectionTitle(resume, "summary", "Profile"))}
              <p className="text-xs text-stone-700 leading-relaxed font-sans text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Contact Details */}
          <section className="mb-5">
            {renderLeftSectionTitle("Contact")}
            <div className="space-y-1 text-xs text-stone-700 font-sans">
              {contact.location && <div>{contact.location}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.email && (
                <div className="break-words font-medium">{contact.email}</div>
              )}
              {contact.website && (
                <div className="break-words">
                  {contact.website.replace(/^https?:\/\//, "")}
                </div>
              )}
              {contact.linkedin && (
                <div className="break-words text-[11px]">
                  {contact.linkedin.replace(
                    /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                    "linkedin.com/in/",
                  )}
                </div>
              )}
              {contact.github && (
                <div className="break-words text-[11px]">
                  {contact.github.replace(
                    /^https?:\/\/(www\.)?github\.com\//,
                    "github.com/",
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {skillCategories.length > 0 && (
            <section className="mb-5">
              {renderLeftSectionTitle(getSectionTitle(resume, "skills", "Skills"))}
              {styling.skillsDisplay === "chips" ? (
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {allSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded border border-stone-200 bg-stone-50 text-stone-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1 text-xs text-stone-700 font-sans">
                  {allSkills.slice(0, 10).map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Education on Page 1 if no page 2 or space permits */}
          {education.length > 0 && (!hasPage2 || education.length <= 2) && (
            <section className="mb-5">
              {renderLeftSectionTitle(getSectionTitle(resume, "education", "Education"))}
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-stone-900 leading-snug">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </p>
                    <p className="text-[11px] text-stone-600 mt-0.5 font-sans">
                      {edu.institution}
                      {edu.startDate && edu.endDate
                        ? ` | ${edu.startDate}–${edu.endDate}`
                        : edu.endDate
                          ? ` | ${edu.endDate}`
                          : ""}
                    </p>
                    {edu.gradeOrGpa && (
                      <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                        GPA: {edu.gradeOrGpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  // Right Column Content: Photo at Top, Solid Brown Panel below with White text
  const renderRightColumn = (isPage2: boolean = false) => {
    const experienceToRender = isPage2
      ? experience.slice(3)
      : hasPage2
        ? experience.slice(0, 3)
        : experience;

    return (
      <div className="w-[58%] flex flex-col -my-8 -mr-8 min-h-full">
        {/* Top Photo Area (Page 1 only) */}
        {!isPage2 && (
          <div className="w-full h-64 overflow-hidden bg-stone-200 shrink-0 relative">
            {styling.showPhoto && contact.photoUrl ? (
              <img
                src={contact.photoUrl}
                alt={contact.fullName}
                className="w-full h-full object-cover object-top"
              />
            ) : styling.showPhoto ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-300/80 text-stone-600">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center font-serif text-2xl font-bold text-white shadow-inner mb-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(contact.fullName || "CE")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <span className="text-xs font-sans tracking-wider uppercase font-semibold text-stone-500">
                  {contact.jobTitle || "Professional Profile"}
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* Brown Solid Background Panel with Crisp White Text */}
        <div
          className="flex-1 p-8 text-white space-y-6"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Page 2 Header marker if page 2 */}
          {isPage2 && styling.showPage2Header && (
            <div className="border-b border-white/20 pb-2 mb-4 flex items-center justify-between text-xs font-sans">
              <span className="font-bold tracking-wide">
                {contact.fullName}
              </span>
              <span className="text-white/80">Page 2 of 2</span>
            </div>
          )}

          {/* Work Experience */}
          {experienceToRender.length > 0 && (
            <section>
              {renderRightSectionTitle(getSectionTitle(resume, "experience", "Experience"))}
              <div className="space-y-4">
                {experienceToRender.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <p className="font-bold text-sm tracking-wide text-white">
                      {exp.position}
                    </p>
                    <p className="text-[11px] text-white/90 italic font-sans mt-0.5">
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ""} | {exp.startDate}
                      –{exp.isCurrent ? "Present" : exp.endDate}
                    </p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-1.5 space-y-1 text-[11px] text-white/85 font-sans leading-relaxed list-disc list-inside">
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

          {/* Certifications */}
          {certifications.length > 0 && (!isPage2 || experience.length <= 3) && (
            <section>
              {renderRightSectionTitle(getSectionTitle(resume, "certifications", "Certification"))}
              <ul className="space-y-1.5 text-xs text-white/90 font-sans">
                {certifications.map((cert) => (
                  <li key={cert.id} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">
                        {cert.name}
                      </span>
                      {(cert.issuer || cert.issueDate) && (
                        <span className="text-white/75 text-[11px] ml-1">
                          | {cert.issuer} {cert.issueDate && `(${cert.issueDate})`}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Projects (if any) */}
          {projects.length > 0 && (
            <section>
              {renderRightSectionTitle(getSectionTitle(resume, "projects", "Projects"))}
              <div className="space-y-3">
                {projects.slice(0, 3).map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <p className="font-bold text-white tracking-wide">
                      {proj.name}
                    </p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 font-sans">
                        {proj.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/15 text-white"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <p className="text-[11px] text-white/85 font-sans mt-1 leading-snug">
                        {proj.bullets[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  // Footer
  const renderFooter = (pageNumber: number) => {
    if (!styling.showPageNumbers) return null;
    return (
      <footer className="w-full pt-4 mt-auto flex items-center justify-between text-[11px] text-stone-400 font-sans">
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
          className={`resume-page-sheet bg-white ${paddingClass} text-stone-800 shadow-md print:shadow-none print:p-0 relative mx-auto box-border flex flex-row overflow-hidden`}
        >
          {renderLeftColumn(false)}
          {renderRightColumn(false)}
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
        className={`resume-page-sheet bg-white ${paddingClass} text-stone-800 shadow-md print:shadow-none print:p-0 relative mx-auto box-border flex flex-row overflow-hidden`}
      >
        {renderLeftColumn(false)}
        {renderRightColumn(false)}
      </div>

      {/* PAGE 2 */}
      <div
        id="resume-page-2"
        style={fontStyle}
        className={`resume-page-sheet bg-white ${paddingClass} text-stone-800 shadow-md print:shadow-none print:p-0 relative mx-auto box-border flex flex-row overflow-hidden`}
      >
        {renderLeftColumn(true)}
        {renderRightColumn(true)}
      </div>
    </div>
  );
};
