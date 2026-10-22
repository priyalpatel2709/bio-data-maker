import { ResumeDocument } from '../types/resume';
import { defaultResume } from '../data/defaultResume';

const STORAGE_KEY_CURRENT_RESUME = 'resume_current_doc';
const STORAGE_KEY_SAVED_RESUMES = 'resume_saved_list';

function isDummyResume(doc: any): boolean {
  if (!doc) return true;
  if (doc.id === 'resume-sample-1') return true;
  if (doc.contact?.fullName === 'Alex Morgan') return true;
  if (doc.contact?.email === 'alex.morgan@email.com') return true;
  return false;
}

export function loadCurrentResume(): ResumeDocument {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_RESUME);
    if (!raw) return defaultResume;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.contact && Array.isArray(parsed.experience)) {
      if (isDummyResume(parsed)) {
        saveCurrentResume(defaultResume);
        return defaultResume;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load resume from localStorage:', err);
  }
  return defaultResume;
}

export function saveCurrentResume(doc: ResumeDocument): void {
  try {
    const updated = {
      ...doc,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_CURRENT_RESUME, JSON.stringify(updated));
    updateInSavedResumeList(updated);
  } catch (err) {
    console.warn('Failed to save resume to localStorage:', err);
  }
}

export function getSavedResumes(): ResumeDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_RESUMES);
    if (!raw) {
      const initial = [defaultResume];
      localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(initial));
      return initial;
    }
    const list: ResumeDocument[] = JSON.parse(raw) || [];
    let updated = false;
    const migrated = list.map((doc) => {
      if (isDummyResume(doc)) {
        updated = true;
        return defaultResume;
      }
      return doc;
    });
    if (updated || migrated.length === 0) {
      if (migrated.length === 0) migrated.push(defaultResume);
      localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(migrated));
    }
    return migrated;
  } catch (err) {
    console.error('Failed to get saved resumes:', err);
    return [defaultResume];
  }
}

export function saveNewResume(doc: ResumeDocument): void {
  try {
    const list = getSavedResumes();
    const existingIdx = list.findIndex((d) => d.id === doc.id);
    if (existingIdx >= 0) {
      list[existingIdx] = doc;
    } else {
      list.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving new resume to list:', err);
  }
}

function updateInSavedResumeList(doc: ResumeDocument): void {
  try {
    const list = getSavedResumes();
    const idx = list.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      list[idx] = doc;
      localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(list));
    }
  } catch {
    // silent fallback
  }
}

export function deleteSavedResume(id: string): void {
  try {
    const list = getSavedResumes().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY_SAVED_RESUMES, JSON.stringify(list));
  } catch (err) {
    console.error('Error deleting resume:', err);
  }
}

export function duplicateSavedResume(doc: ResumeDocument): ResumeDocument {
  const duplicated: ResumeDocument = {
    ...JSON.parse(JSON.stringify(doc)),
    id: 'resume-' + Date.now(),
    title: `${doc.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveNewResume(duplicated);
  return duplicated;
}

/** Formats the entire resume as an ATS-friendly, clean plain text snippet for quick pasting into job application boxes */
export function generateResumePlainText(doc: ResumeDocument): string {
  const lines: string[] = [];

  // Header
  lines.push(doc.contact.fullName.toUpperCase());
  if (doc.contact.jobTitle) lines.push(doc.contact.jobTitle);
  const contacts: string[] = [];
  if (doc.contact.email) contacts.push(doc.contact.email);
  if (doc.contact.phone) contacts.push(doc.contact.phone);
  if (doc.contact.location) contacts.push(doc.contact.location);
  if (doc.contact.linkedin) contacts.push(doc.contact.linkedin);
  if (doc.contact.github) contacts.push(doc.contact.github);
  if (doc.contact.website) contacts.push(doc.contact.website);
  lines.push(contacts.join(' | '));
  lines.push('');

  // Summary
  if (doc.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('--------------------');
    lines.push(doc.summary);
    lines.push('');
  }

  // Experience
  if (doc.experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('---------------');
    doc.experience.forEach((exp) => {
      lines.push(`${exp.position} — ${exp.company}${exp.location ? ` (${exp.location})` : ''}`);
      lines.push(`${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}`);
      exp.bullets.forEach((b) => {
        if (b.trim()) lines.push(`• ${b.trim()}`);
      });
      lines.push('');
    });
  }

  // Education
  if (doc.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('---------');
    doc.education.forEach((edu) => {
      lines.push(`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`);
      lines.push(`${edu.institution}${edu.location ? `, ${edu.location}` : ''} | ${edu.startDate} - ${edu.isCurrent ? 'Present' : edu.endDate}`);
      if (edu.gradeOrGpa) lines.push(`Result / Honors: ${edu.gradeOrGpa}`);
      if (edu.bullets && edu.bullets.length > 0) {
        edu.bullets.forEach((b) => {
          if (b.trim()) lines.push(`• ${b.trim()}`);
        });
      }
      lines.push('');
    });
  }

  // Skills
  if (doc.skillCategories.length > 0) {
    lines.push('SKILLS');
    lines.push('------');
    doc.skillCategories.forEach((sc) => {
      lines.push(`${sc.categoryName}: ${sc.skills.join(', ')}`);
    });
    lines.push('');
  }

  // Projects
  if (doc.projects.length > 0) {
    lines.push('PROJECTS');
    lines.push('--------');
    doc.projects.forEach((proj) => {
      lines.push(`${proj.name}${proj.roleOrSubtitle ? ` (${proj.roleOrSubtitle})` : ''}${proj.link ? ` — ${proj.link}` : ''}`);
      if (proj.techStack && proj.techStack.length > 0) {
        lines.push(`Tech Stack: ${proj.techStack.join(', ')}`);
      }
      proj.bullets.forEach((b) => {
        if (b.trim()) lines.push(`• ${b.trim()}`);
      });
      lines.push('');
    });
  }

  // Certifications
  if (doc.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('--------------');
    doc.certifications.forEach((cert) => {
      lines.push(`${cert.name} — ${cert.issuer}${cert.issueDate ? ` (${cert.issueDate})` : ''}`);
      if (cert.credentialId) lines.push(`Credential ID: ${cert.credentialId}`);
    });
    lines.push('');
  }

  // Custom sections
  doc.customSections.filter((cs) => cs.visible).forEach((cs) => {
    lines.push(cs.title.toUpperCase());
    lines.push('-'.repeat(cs.title.length));
    cs.items.forEach((item) => {
      lines.push(`${item.title}${item.subtitle ? ` (${item.subtitle})` : ''}${item.date ? ` — ${item.date}` : ''}`);
      if (item.description) lines.push(item.description);
      if (item.bullets) {
        item.bullets.forEach((b) => {
          if (b.trim()) lines.push(`• ${b.trim()}`);
        });
      }
    });
    lines.push('');
  });

  return lines.join('\n');
}
