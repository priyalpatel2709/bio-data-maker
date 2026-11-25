import { ResumeDocument, ResumeSectionMeta } from "../types/resume";
import { defaultResume } from "../data/defaultResume";

const STORAGE_KEY_CURRENT_RESUME = "resume_current_doc";
const STORAGE_KEY_SAVED_RESUMES = "resume_saved_list";

export function ensureSectionOrder(doc: ResumeDocument): ResumeDocument {
  const defaultSections: ResumeSectionMeta[] = [
    { key: "summary", title: "Professional Summary", visible: true },
    { key: "experience", title: "Work Experience", visible: true },
    { key: "education", title: "Education", visible: true },
    { key: "skills", title: "Skills & Proficiencies", visible: true },
    { key: "projects", title: "Featured Projects", visible: true },
    { key: "certifications", title: "Certifications", visible: false },
  ];

  const currentOrder: ResumeSectionMeta[] = Array.isArray(doc.sectionOrder)
    ? [...doc.sectionOrder]
    : [];

  // Add missing default sections
  for (const def of defaultSections) {
    if (!currentOrder.some((s) => s.key === def.key)) {
      currentOrder.push(def);
    }
  }

  // Ensure all custom sections are in sectionOrder
  if (Array.isArray(doc.customSections)) {
    for (const cs of doc.customSections) {
      if (!currentOrder.some((s) => s.key === "custom" && s.customId === cs.id)) {
        currentOrder.push({
          key: "custom",
          customId: cs.id,
          title: cs.title || "Custom Section",
          visible: cs.visible !== false,
        });
      }
    }
  }

  // Remove custom sections from order if they no longer exist
  const validCustomIds = new Set((doc.customSections || []).map((cs) => cs.id));
  const filteredOrder = currentOrder.filter(
    (s) => s.key !== "custom" || (s.customId && validCustomIds.has(s.customId)),
  );

  return {
    ...doc,
    sectionOrder: filteredOrder,
  };
}

export function loadCurrentResume(): ResumeDocument {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_RESUME);
    if (!raw) return ensureSectionOrder(defaultResume);
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      parsed.id &&
      parsed.contact &&
      Array.isArray(parsed.experience)
    ) {
      return ensureSectionOrder(parsed);
    }
  } catch (err) {
    console.error("Failed to load resume from localStorage:", err);
  }
  return ensureSectionOrder(defaultResume);
}

export function saveCurrentResume(doc: ResumeDocument): void {
  try {
    const updated = ensureSectionOrder({
      ...doc,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY_CURRENT_RESUME, JSON.stringify(updated));
    updateInSavedResumeList(updated);
  } catch (err) {
    console.warn("Failed to save resume to localStorage:", err);
  }
}

export function getSavedResumes(): ResumeDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_RESUMES);
    if (!raw) {
      const initial = [ensureSectionOrder(defaultResume)];
      localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(initial));
      return initial;
    }
    const list: ResumeDocument[] = JSON.parse(raw) || [];
    if (list.length === 0) {
      const initial = [ensureSectionOrder(defaultResume)];
      localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(initial));
      return initial;
    }
    return list.map((doc) => ensureSectionOrder(doc));
  } catch (err) {
    console.error("Failed to get saved resumes:", err);
    return [ensureSectionOrder(defaultResume)];
  }
}

export function saveNewResume(doc: ResumeDocument): void {
  try {
    const prepared = ensureSectionOrder(doc);
    const list = getSavedResumes();
    const existingIdx = list.findIndex((d) => d.id === prepared.id);
    if (existingIdx >= 0) {
      list[existingIdx] = prepared;
    } else {
      list.unshift(prepared);
    }
    localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(list));
  } catch (err) {
    console.error("Error saving new resume to list:", err);
  }
}

function updateInSavedResumeList(doc: ResumeDocument): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_RESUMES);
    const list: ResumeDocument[] = raw ? JSON.parse(raw) || [] : [];
    const idx = list.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      list[idx] = doc;
    } else {
      list.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(list));
  } catch (err) {
    console.warn("Failed to update in saved resume list:", err);
  }
}

export function deleteSavedResume(id: string): void {
  try {
    const list = getSavedResumes().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(list));
  } catch (err) {
    console.error("Error deleting resume:", err);
  }
}

export function duplicateSavedResume(doc: ResumeDocument): ResumeDocument {
  const duplicated: ResumeDocument = ensureSectionOrder({
    ...JSON.parse(JSON.stringify(doc)),
    id: "resume-" + Date.now(),
    title: `${doc.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  saveNewResume(duplicated);
  return duplicated;
}

/** Formats the entire resume as an ATS-friendly, clean plain text snippet for quick pasting into job application boxes */
export function generateResumePlainText(doc: ResumeDocument): string {
  const lines: string[] = [];

  // Header
  lines.push((doc.contact.fullName || "UNTITLED").toUpperCase());
  if (doc.contact.jobTitle) lines.push(doc.contact.jobTitle);
  const contacts: string[] = [];
  if (doc.contact.email) contacts.push(doc.contact.email);
  if (doc.contact.phone) contacts.push(doc.contact.phone);
  if (doc.contact.location) contacts.push(doc.contact.location);
  if (doc.contact.linkedin) contacts.push(doc.contact.linkedin);
  if (doc.contact.github) contacts.push(doc.contact.github);
  if (doc.contact.website) contacts.push(doc.contact.website);
  lines.push(contacts.join(" | "));
  lines.push("");

  const sectionsToRender: ResumeSectionMeta[] =
    doc.sectionOrder && doc.sectionOrder.length > 0
      ? doc.sectionOrder.filter((s) => s.visible !== false)
      : [
          { key: "summary", title: "PROFESSIONAL SUMMARY", visible: true },
          { key: "experience", title: "WORK EXPERIENCE", visible: true },
          { key: "education", title: "EDUCATION", visible: true },
          { key: "skills", title: "SKILLS", visible: true },
          { key: "projects", title: "PROJECTS", visible: true },
          { key: "certifications", title: "CERTIFICATIONS", visible: true },
        ];

  sectionsToRender.forEach((section) => {
    const heading = (section.title || section.key).toUpperCase();

    if (section.key === "summary" && doc.summary) {
      lines.push(heading);
      lines.push("-".repeat(Math.max(heading.length, 12)));
      lines.push(doc.summary);
      lines.push("");
    } else if (section.key === "experience" && doc.experience.length > 0) {
      lines.push(heading);
      lines.push("-".repeat(Math.max(heading.length, 12)));
      doc.experience.forEach((exp) => {
        lines.push(
          `${exp.position} — ${exp.company}${exp.location ? ` (${exp.location})` : ""}`,
        );
        lines.push(
          `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}`,
        );
        exp.bullets.forEach((b) => {
          if (b.trim()) lines.push(`• ${b.trim()}`);
        });
        lines.push("");
      });
    } else if (section.key === "education" && doc.education.length > 0) {
      lines.push(heading);
      lines.push("-".repeat(Math.max(heading.length, 12)));
      doc.education.forEach((edu) => {
        lines.push(
          `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`,
        );
        lines.push(
          `${edu.institution}${edu.location ? `, ${edu.location}` : ""} | ${edu.startDate} - ${edu.isCurrent ? "Present" : edu.endDate}`,
        );
        if (edu.gradeOrGpa) lines.push(`Result / Honors: ${edu.gradeOrGpa}`);
        if (edu.bullets && edu.bullets.length > 0) {
          edu.bullets.forEach((b) => {
            if (b.trim()) lines.push(`• ${b.trim()}`);
          });
        }
        lines.push("");
      });
    } else if (section.key === "skills" && doc.skillCategories.length > 0) {
      lines.push(heading);
      lines.push("-".repeat(Math.max(heading.length, 12)));
      doc.skillCategories.forEach((sc) => {
        lines.push(`${sc.categoryName}: ${sc.skills.join(", ")}`);
      });
      lines.push("");
    } else if (section.key === "projects" && doc.projects.length > 0) {
      lines.push(heading);
      lines.push("-".repeat(Math.max(heading.length, 12)));
      doc.projects.forEach((proj) => {
        lines.push(
          `${proj.name}${proj.roleOrSubtitle ? ` (${proj.roleOrSubtitle})` : ""}${proj.link ? ` — ${proj.link}` : ""}`,
        );
        if (proj.techStack && proj.techStack.length > 0) {
          lines.push(`Tech Stack: ${proj.techStack.join(", ")}`);
        }
        proj.bullets.forEach((b) => {
          if (b.trim()) lines.push(`• ${b.trim()}`);
        });
        lines.push("");
      });
    } else if (section.key === "certifications" && doc.certifications.length > 0) {
      lines.push(heading);
      lines.push("-".repeat(Math.max(heading.length, 12)));
      doc.certifications.forEach((cert) => {
        lines.push(
          `${cert.name} — ${cert.issuer}${cert.issueDate ? ` (${cert.issueDate})` : ""}`,
        );
        if (cert.credentialId) lines.push(`Credential ID: ${cert.credentialId}`);
      });
      lines.push("");
    } else if (section.key === "custom" && section.customId) {
      const cs = doc.customSections?.find((c) => c.id === section.customId);
      if (cs && cs.items.length > 0) {
        lines.push(heading);
        lines.push("-".repeat(Math.max(heading.length, 12)));
        cs.items.forEach((item) => {
          lines.push(
            `${item.title}${item.subtitle ? ` — ${item.subtitle}` : ""}`,
          );
          if (item.description) lines.push(item.description);
          if (item.bullets && item.bullets.length > 0) {
            item.bullets.forEach((b) => {
              if (b.trim()) lines.push(`• ${b.trim()}`);
            });
          }
        });
        lines.push("");
      }
    }
  });

  return lines.join("\n");
}
