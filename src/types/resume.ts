export type ResumeTemplateId =
  | 'modern-tech'
  | 'executive-corporate'
  | 'minimalist-ats'
  | 'creative-split'
  | 'compact-engineering'
  | 'elegant-academic'
  | 'monochrome-classic'
  | 'classic'
  | 'stockholm'
  | 'sydney'
  | 'dublin'
  | 'vienna';

export interface ResumeContactInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface WorkExperienceItem {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gradeOrGpa?: string;
  bullets?: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[]; // e.g. ["React", "TypeScript", "Node.js"]
}

export interface ProjectItem {
  id: string;
  name: string;
  roleOrSubtitle?: string;
  techStack?: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CustomResumeSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface CustomResumeSection {
  id: string;
  title: string;
  visible: boolean;
  items: CustomResumeSectionItem[];
}

export type ResumeFontOption =
  | 'Inter'
  | 'Roboto'
  | 'Montserrat'
  | 'Merriweather'
  | 'Playfair Display'
  | 'Lora';

export interface ResumeStylingConfig {
  templateId: ResumeTemplateId;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: ResumeFontOption;
  fontSize: 'compact' | 'normal' | 'relaxed';
  spacing: 'compact' | 'normal' | 'relaxed';
  paperSize: 'a4' | 'letter';
  showPhoto: boolean;
  photoShape: 'circle' | 'rounded' | 'square';
  skillsDisplay: 'chips' | 'dots' | 'comma';
  atsOptimized: boolean;
  pageMargin: 'compact' | 'normal' | 'spacious';
  showPage2Header: boolean;
  showPageNumbers: boolean;
  pageSplitAt: 'auto' | 'projects' | 'education' | 'skills' | 'single-page';
}

export type ResumeSectionKey =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'custom';

export interface ResumeSectionMeta {
  key: ResumeSectionKey;
  customId?: string;
  title: string;
  visible: boolean;
}

export interface ResumeDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  contact: ResumeContactInfo;
  summary: string;
  experience: WorkExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  customSections: CustomResumeSection[];
  sectionOrder: ResumeSectionMeta[];
  styling: ResumeStylingConfig;
}

export interface ResumeTemplateDefinition {
  id: ResumeTemplateId;
  name: string;
  description: string;
  bestFor: string;
  previewColor: string;
  badge?: string;
  defaultStyling: Partial<ResumeStylingConfig>;
}
