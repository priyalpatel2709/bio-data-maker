import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeDocument, ResumeSectionMeta } from "../../types/resume";

export async function exportResumeToDocx(
  resume: ResumeDocument,
  filename: string = "Resume.docx",
  onProgress?: (progress: number, stage: string) => void,
): Promise<void> {
  onProgress?.(10, "Compiling resume structure...");

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

  const primaryHex = (styling.primaryColor || "#0F766E").replace("#", "");
  const textHex = "1E293B";
  const mutedHex = "64748B";

  const docChildren: any[] = [];

  // Title / Full Name
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: contact.fullName,
          bold: true,
          size: 40, // 20pt
          color: primaryHex,
          font: "Calibri",
        }),
      ],
    }),
  );

  // Job Title
  if (contact.jobTitle) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: contact.jobTitle,
            bold: true,
            size: 24, // 12pt
            color: mutedHex,
            font: "Calibri",
          }),
        ],
      }),
    );
  }

  // Contact line
  const contacts: string[] = [];
  if (contact.email) contacts.push(contact.email);
  if (contact.phone) contacts.push(contact.phone);
  if (contact.location) contacts.push(contact.location);
  if (contact.linkedin) contacts.push(contact.linkedin);
  if (contact.github) contacts.push(contact.github);
  if (contact.website) contacts.push(contact.website);

  if (contacts.length > 0) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contacts.join("   |   "),
            size: 18,
            color: mutedHex,
            font: "Calibri",
          }),
        ],
      }),
    );
  }

  // Helper for Section Headings
  const addSectionHeading = (title: string) => {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: primaryHex,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            color: primaryHex,
            font: "Calibri",
          }),
        ],
      }),
    );
  };

  onProgress?.(30, "Formatting sections in custom order & headers...");

  const effectiveSections: ResumeSectionMeta[] =
    resume.sectionOrder && resume.sectionOrder.length > 0
      ? resume.sectionOrder.filter((s) => s.visible !== false)
      : [
          { key: "summary", title: "Professional Summary", visible: true },
          { key: "experience", title: "Work Experience", visible: true },
          { key: "education", title: "Education", visible: true },
          { key: "skills", title: "Skills & Proficiencies", visible: true },
          { key: "projects", title: "Projects", visible: true },
          { key: "certifications", title: "Certifications", visible: true },
        ];

  effectiveSections.forEach((section) => {
    const heading = section.title || section.key;

    if (section.key === "summary" && summary.trim()) {
      addSectionHeading(heading);
      docChildren.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: summary,
              size: 20,
              color: textHex,
              font: "Calibri",
            }),
          ],
        }),
      );
    } else if (section.key === "experience" && experience.length > 0) {
      addSectionHeading(heading);
      experience.forEach((exp) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 22,
                color: textHex,
                font: "Calibri",
              }),
              new TextRun({
                text: `  |  ${exp.company}${exp.location ? ` (${exp.location})` : ""}`,
                size: 20,
                color: textHex,
                font: "Calibri",
              }),
              new TextRun({
                text: `   (${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate})`,
                italics: true,
                size: 18,
                color: mutedHex,
                font: "Calibri",
              }),
            ],
          }),
        );

        exp.bullets.forEach((bullet) => {
          if (!bullet.trim()) return;
          docChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 20,
                  color: textHex,
                  font: "Calibri",
                }),
              ],
            }),
          );
        });
      });
    } else if (section.key === "education" && education.length > 0) {
      addSectionHeading(heading);
      education.forEach((edu) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text:
                  edu.degree +
                  (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""),
                bold: true,
                size: 22,
                color: textHex,
                font: "Calibri",
              }),
              new TextRun({
                text: ` — ${edu.institution}${edu.location ? `, ${edu.location}` : ""}`,
                size: 20,
                color: primaryHex,
                font: "Calibri",
              }),
              new TextRun({
                text: ` (${edu.startDate} - ${edu.isCurrent ? "Present" : edu.endDate})`,
                italics: true,
                size: 18,
                color: mutedHex,
                font: "Calibri",
              }),
            ],
          }),
        );

        if (edu.gradeOrGpa) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: edu.gradeOrGpa,
                  italics: true,
                  size: 18,
                  color: mutedHex,
                  font: "Calibri",
                }),
              ],
            }),
          );
        }

        edu.bullets?.forEach((bullet) => {
          if (!bullet.trim()) return;
          docChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 20,
                  color: textHex,
                  font: "Calibri",
                }),
              ],
            }),
          );
        });
      });
    } else if (section.key === "skills" && skillCategories.length > 0) {
      addSectionHeading(heading);
      skillCategories.forEach((sc) => {
        docChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${sc.categoryName}: `,
                bold: true,
                size: 20,
                color: textHex,
                font: "Calibri",
              }),
              new TextRun({
                text: sc.skills.join(", "),
                size: 20,
                color: textHex,
                font: "Calibri",
              }),
            ],
          }),
        );
      });
    } else if (section.key === "projects" && projects.length > 0) {
      addSectionHeading(heading);
      projects.forEach((proj) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: proj.name,
                bold: true,
                size: 22,
                color: textHex,
                font: "Calibri",
              }),
              new TextRun({
                text: proj.roleOrSubtitle ? ` (${proj.roleOrSubtitle})` : "",
                italics: true,
                size: 18,
                color: mutedHex,
                font: "Calibri",
              }),
              new TextRun({
                text: proj.link ? ` [${proj.link}]` : "",
                size: 18,
                color: primaryHex,
                font: "Calibri",
              }),
            ],
          }),
        );
        if (proj.techStack && proj.techStack.length > 0) {
          docChildren.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `Tech Stack: ${proj.techStack.join(", ")}`,
                  italics: true,
                  size: 18,
                  color: mutedHex,
                  font: "Calibri",
                }),
              ],
            }),
          );
        }
        proj.bullets.forEach((b) => {
          if (!b.trim()) return;
          docChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: b.trim(),
                  size: 20,
                  color: textHex,
                  font: "Calibri",
                }),
              ],
            }),
          );
        });
      });
    } else if (section.key === "certifications" && certifications.length > 0) {
      addSectionHeading(heading);
      certifications.forEach((cert) => {
        docChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
                size: 20,
                color: textHex,
                font: "Calibri",
              }),
              new TextRun({
                text: ` — ${cert.issuer}${cert.issueDate ? ` (${cert.issueDate})` : ""}`,
                size: 20,
                color: mutedHex,
                font: "Calibri",
              }),
            ],
          }),
        );
      });
    } else if (section.key === "custom" && section.customId) {
      const cs = customSections.find((c) => c.id === section.customId && c.visible);
      if (cs && cs.items.length > 0) {
        addSectionHeading(heading);
        cs.items.forEach((item) => {
          docChildren.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: item.title,
                  bold: true,
                  size: 20,
                  color: textHex,
                  font: "Calibri",
                }),
                new TextRun({
                  text: item.subtitle ? ` — ${item.subtitle}` : "",
                  size: 18,
                  color: mutedHex,
                  font: "Calibri",
                }),
              ],
            }),
          );
          if (item.description) {
            docChildren.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: item.description,
                    size: 20,
                    color: textHex,
                    font: "Calibri",
                  }),
                ],
              }),
            );
          }
          item.bullets?.forEach((b) => {
            if (!b.trim()) return;
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: b.trim(),
                    size: 20,
                    color: textHex,
                    font: "Calibri",
                  }),
                ],
              }),
            );
          });
        });
      }
    }
  });

  onProgress?.(85, "Packaging Word .docx binary...");

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  onProgress?.(100, "Saving file...");
  saveAs(blob, filename.endsWith(".docx") ? filename : `${filename}.docx`);
}
