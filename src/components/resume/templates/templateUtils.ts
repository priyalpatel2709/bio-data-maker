import {
  ResumeDocument,
  ResumeSectionKey,
  ResumeSectionMeta,
} from "../../../types/resume";

export function getEffectiveSectionOrder(
  resume: ResumeDocument,
): ResumeSectionMeta[] {
  if (Array.isArray(resume.sectionOrder) && resume.sectionOrder.length > 0) {
    return resume.sectionOrder.filter((s) => s.visible !== false);
  }
  return [
    { key: "summary", title: "Professional Summary", visible: true },
    { key: "experience", title: "Work Experience", visible: true },
    { key: "education", title: "Education", visible: true },
    { key: "skills", title: "Skills & Proficiencies", visible: true },
    { key: "projects", title: "Featured Projects", visible: true },
    { key: "certifications", title: "Certifications", visible: false },
  ];
}

export function getSectionTitle(
  resume: ResumeDocument,
  key: ResumeSectionKey,
  fallbackTitle: string,
  customId?: string,
): string {
  const match = resume.sectionOrder?.find(
    (s) => s.key === key && (!customId || s.customId === customId),
  );
  return match?.title?.trim() || fallbackTitle;
}
