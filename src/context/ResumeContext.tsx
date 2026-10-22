import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ResumeDocument,
  ResumeContactInfo,
  WorkExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
  CustomResumeSection,
  ResumeStylingConfig,
  ResumeTemplateId,
  ResumeSectionMeta,
} from '../types/resume';
import { defaultResume, RESUME_TEMPLATES } from '../data/defaultResume';
import {
  loadCurrentResume,
  saveCurrentResume,
  getSavedResumes,
  saveNewResume,
  deleteSavedResume,
  duplicateSavedResume,
} from '../utils/resumeStorage';
import { useAuth } from './AuthContext';
import { queueCloudSave, deleteCloudDocument } from '../services/syncService';

interface ResumeContextType {
  document: ResumeDocument;
  viewMode: 'studio' | 'dashboard';
  setViewMode: (mode: 'studio' | 'dashboard') => void;
  activeTab: 'content' | 'design' | 'templates';
  setActiveTab: (tab: 'content' | 'design' | 'templates') => void;
  previewZoom: number | 'fit';
  setPreviewZoom: (zoom: number | 'fit') => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  // Document metadata & Title
  updateTitle: (title: string) => void;
  updateContact: (updates: Partial<ResumeContactInfo>) => void;
  updateSummary: (summary: string) => void;

  // Experience
  addExperience: (item?: Partial<WorkExperienceItem>) => void;
  updateExperience: (id: string, updates: Partial<WorkExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  reorderExperience: (items: WorkExperienceItem[]) => void;

  // Education
  addEducation: (item?: Partial<EducationItem>) => void;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (items: EducationItem[]) => void;

  // Skills
  addSkillCategory: (catName?: string, initialSkills?: string[]) => void;
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;
  addSkillToCategory: (categoryId: string, skill: string) => void;
  removeSkillFromCategory: (categoryId: string, skillIndex: number) => void;

  // Projects
  addProject: (item?: Partial<ProjectItem>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  // Certifications
  addCertification: (item?: Partial<CertificationItem>) => void;
  updateCertification: (id: string, updates: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;

  // Custom Sections
  addCustomSection: (title: string) => void;
  updateCustomSection: (id: string, updates: Partial<CustomResumeSection>) => void;
  deleteCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, updates: any) => void;
  deleteCustomSectionItem: (sectionId: string, itemId: string) => void;

  // Section Ordering & Visibility
  reorderSectionOrder: (newOrder: ResumeSectionMeta[]) => void;
  toggleSectionVisibility: (key: string, customId?: string) => void;

  // Styling & Templates
  updateStyling: (updates: Partial<ResumeStylingConfig>) => void;
  setTemplate: (templateId: ResumeTemplateId) => void;

  // Drafts & Management
  savedResumes: ResumeDocument[];
  refreshSavedResumes: () => void;
  loadResume: (doc: ResumeDocument) => void;
  addSavedResume: (doc: ResumeDocument) => void;
  createNewResume: (preset?: 'software' | 'blank' | 'executive') => void;
  duplicateResume: (doc: ResumeDocument) => void;
  removeResume: (id: string) => void;
  resetToSample: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, syncStatus } = useAuth();
  const [document, setDocument] = useState<ResumeDocument>(loadCurrentResume);
  const [viewMode, setViewMode] = useState<'studio' | 'dashboard'>('dashboard');
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'templates'>('content');
  const [previewZoom, setPreviewZoom] = useState<number | 'fit'>('fit');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [savedResumes, setSavedResumes] = useState<ResumeDocument[]>(getSavedResumes);

  // Auto-save locally and sync to cloud if authenticated
  useEffect(() => {
    saveCurrentResume(document);
    if (user?.id) {
      queueCloudSave('resume', document, user.id);
    }
  }, [document, user?.id]);

  // Refresh saved resumes when cloud sync completes
  useEffect(() => {
    if (syncStatus === 'synced') {
      setSavedResumes(getSavedResumes());
      setDocument(loadCurrentResume());
    }
  }, [syncStatus]);

  const refreshSavedResumes = useCallback(() => {
    setSavedResumes(getSavedResumes());
  }, []);

  const updateTitle = useCallback((title: string) => {
    setDocument((prev) => ({ ...prev, title }));
  }, []);

  const updateContact = useCallback((updates: Partial<ResumeContactInfo>) => {
    setDocument((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...updates },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setDocument((prev) => ({ ...prev, summary }));
  }, []);

  // Experience actions
  const addExperience = useCallback((item?: Partial<WorkExperienceItem>) => {
    const newItem: WorkExperienceItem = {
      id: 'exp-' + Date.now(),
      position: item?.position || 'Job Title',
      company: item?.company || 'Company Name',
      location: item?.location || 'City, Country',
      startDate: item?.startDate || '2023',
      endDate: item?.endDate || 'Present',
      isCurrent: item?.isCurrent ?? true,
      bullets: item?.bullets || ['Achieved key milestones and drove measurable performance impact.'],
    };
    setDocument((prev) => ({
      ...prev,
      experience: [newItem, ...prev.experience],
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<WorkExperienceItem>) => {
    setDocument((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    }));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setDocument((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  }, []);

  const reorderExperience = useCallback((items: WorkExperienceItem[]) => {
    setDocument((prev) => ({ ...prev, experience: items }));
  }, []);

  // Education actions
  const addEducation = useCallback((item?: Partial<EducationItem>) => {
    const newItem: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: item?.degree || 'Bachelor of Science',
      fieldOfStudy: item?.fieldOfStudy || 'Field of Study',
      institution: item?.institution || 'University Name',
      location: item?.location || 'City, Country',
      startDate: item?.startDate || '2019',
      endDate: item?.endDate || '2023',
      isCurrent: item?.isCurrent ?? false,
      gradeOrGpa: item?.gradeOrGpa || '',
      bullets: item?.bullets || [],
    };
    setDocument((prev) => ({
      ...prev,
      education: [newItem, ...prev.education],
    }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<EducationItem>) => {
    setDocument((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setDocument((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, []);

  const reorderEducation = useCallback((items: EducationItem[]) => {
    setDocument((prev) => ({ ...prev, education: items }));
  }, []);

  // Skills
  const addSkillCategory = useCallback((catName?: string, initialSkills?: string[]) => {
    const newCat: SkillCategory = {
      id: 'skill-cat-' + Date.now(),
      categoryName: catName || 'New Skill Group',
      skills: initialSkills && initialSkills.length > 0 ? initialSkills : ['Sample Skill'],
    };
    setDocument((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
  }, []);

  const updateSkillCategory = useCallback((id: string, updates: Partial<SkillCategory>) => {
    setDocument((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteSkillCategory = useCallback((id: string) => {
    setDocument((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((c) => c.id !== id),
    }));
  }, []);

  const addSkillToCategory = useCallback((categoryId: string, skill: string) => {
    if (!skill.trim()) return;
    setDocument((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        if (cat.skills.includes(skill.trim())) return cat;
        return { ...cat, skills: [...cat.skills, skill.trim()] };
      }),
    }));
  }, []);

  const removeSkillFromCategory = useCallback((categoryId: string, skillIndex: number) => {
    setDocument((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          skills: cat.skills.filter((_, idx) => idx !== skillIndex),
        };
      }),
    }));
  }, []);

  // Projects
  const addProject = useCallback((item?: Partial<ProjectItem>) => {
    const newProj: ProjectItem = {
      id: 'proj-' + Date.now(),
      name: item?.name || 'Project Name',
      roleOrSubtitle: item?.roleOrSubtitle || 'Creator / Developer',
      techStack: item?.techStack || ['React', 'TypeScript'],
      link: item?.link || '',
      bullets: item?.bullets || ['Designed and built key feature set with user-friendly interface.'],
    };
    setDocument((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    setDocument((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setDocument((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  // Certifications
  const addCertification = useCallback((item?: Partial<CertificationItem>) => {
    const newCert: CertificationItem = {
      id: 'cert-' + Date.now(),
      name: item?.name || 'Certification Name',
      issuer: item?.issuer || 'Issuing Organization',
      issueDate: item?.issueDate || '2023',
    };
    setDocument((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<CertificationItem>) => {
    setDocument((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteCertification = useCallback((id: string) => {
    setDocument((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  }, []);

  // Custom Sections
  const addCustomSection = useCallback((title: string) => {
    const newId = 'cust-' + Date.now();
    const newSection: CustomResumeSection = {
      id: newId,
      title: title || 'Custom Section',
      visible: true,
      items: [
        {
          id: 'item-' + Date.now(),
          title: 'Entry Title',
          subtitle: 'Optional detail or subtitle',
        },
      ],
    };
    setDocument((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
      sectionOrder: [
        ...prev.sectionOrder,
        { key: 'custom', customId: newId, title: newSection.title, visible: true },
      ],
    }));
  }, []);

  const updateCustomSection = useCallback((id: string, updates: Partial<CustomResumeSection>) => {
    setDocument((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) => (cs.id === id ? { ...cs, ...updates } : cs)),
      sectionOrder: prev.sectionOrder.map((so) =>
        so.customId === id ? { ...so, title: updates.title || so.title } : so
      ),
    }));
  }, []);

  const deleteCustomSection = useCallback((id: string) => {
    setDocument((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((cs) => cs.id !== id),
      sectionOrder: prev.sectionOrder.filter((so) => so.customId !== id),
    }));
  }, []);

  const addCustomSectionItem = useCallback((sectionId: string) => {
    setDocument((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) => {
        if (cs.id !== sectionId) return cs;
        return {
          ...cs,
          items: [
            ...cs.items,
            {
              id: 'item-' + Date.now(),
              title: 'New Item',
              subtitle: '',
            },
          ],
        };
      }),
    }));
  }, []);

  const updateCustomSectionItem = useCallback((sectionId: string, itemId: string, updates: any) => {
    setDocument((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) => {
        if (cs.id !== sectionId) return cs;
        return {
          ...cs,
          items: cs.items.map((it) => (it.id === itemId ? { ...it, ...updates } : it)),
        };
      }),
    }));
  }, []);

  const deleteCustomSectionItem = useCallback((sectionId: string, itemId: string) => {
    setDocument((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) => {
        if (cs.id !== sectionId) return cs;
        return {
          ...cs,
          items: cs.items.filter((it) => it.id !== itemId),
        };
      }),
    }));
  }, []);

  // Section Ordering
  const reorderSectionOrder = useCallback((newOrder: ResumeSectionMeta[]) => {
    setDocument((prev) => ({ ...prev, sectionOrder: newOrder }));
  }, []);

  const toggleSectionVisibility = useCallback((key: string, customId?: string) => {
    setDocument((prev) => ({
      ...prev,
      sectionOrder: prev.sectionOrder.map((so) => {
        if (so.key === key && (!customId || so.customId === customId)) {
          return { ...so, visible: !so.visible };
        }
        return so;
      }),
    }));
  }, []);

  // Styling & Template
  const updateStyling = useCallback((updates: Partial<ResumeStylingConfig>) => {
    setDocument((prev) => ({
      ...prev,
      styling: { ...prev.styling, ...updates },
    }));
  }, []);

  const setTemplate = useCallback((templateId: ResumeTemplateId) => {
    const tpl = RESUME_TEMPLATES.find((t) => t.id === templateId);
    setDocument((prev) => ({
      ...prev,
      styling: {
        ...prev.styling,
        templateId,
        ...(tpl ? tpl.defaultStyling : {}),
      },
    }));
  }, []);

  // Document Management
  const loadResume = useCallback((doc: ResumeDocument) => {
    setDocument(doc);
    saveCurrentResume(doc);
  }, []);

  const createNewResume = useCallback((preset: 'software' | 'blank' | 'executive' = 'software') => {
    let newDoc: ResumeDocument;
    if (preset === 'blank') {
      newDoc = {
        ...defaultResume,
        id: 'resume-' + Date.now(),
        title: 'Untitled Resume',
        contact: {
          fullName: 'Your Name',
          jobTitle: 'Your Target Job Title',
          email: 'your.name@example.com',
          phone: '+1 555-0100',
          location: 'City, Country',
        },
        summary: '',
        experience: [],
        education: [],
        skillCategories: [],
        projects: [],
        certifications: [],
        customSections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      newDoc = {
        ...defaultResume,
        id: 'resume-' + Date.now(),
        title: preset === 'executive' ? 'Executive Leadership Resume' : 'Software Engineer Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    saveNewResume(newDoc);
    if (user?.id) {
      queueCloudSave('resume', newDoc, user.id, true);
    }
    setDocument(newDoc);
    refreshSavedResumes();
    setViewMode('studio');
  }, [refreshSavedResumes, user?.id]);

  const addSavedResume = useCallback((doc: ResumeDocument) => {
    saveNewResume(doc);
    if (user?.id) {
      queueCloudSave('resume', doc, user.id, true);
    }
    refreshSavedResumes();
  }, [refreshSavedResumes, user?.id]);

  const duplicateResume = useCallback((doc: ResumeDocument) => {
    const dup = duplicateSavedResume(doc);
    if (user?.id) {
      queueCloudSave('resume', dup, user.id, true);
    }
    refreshSavedResumes();
    setDocument(dup);
  }, [refreshSavedResumes, user?.id]);

  const removeResume = useCallback((id: string) => {
    deleteSavedResume(id);
    if (user?.id) {
      void deleteCloudDocument(id, user.id);
    }
    refreshSavedResumes();
    const remaining = getSavedResumes();
    if (remaining.length > 0) {
      setDocument(remaining[0]);
    } else {
      createNewResume('software');
    }
  }, [createNewResume, refreshSavedResumes, user?.id]);

  const resetToSample = useCallback(() => {
    setDocument(defaultResume);
    saveCurrentResume(defaultResume);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        document,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        previewZoom,
        setPreviewZoom,
        exportModalOpen,
        setExportModalOpen,
        updateTitle,
        updateContact,
        updateSummary,
        addExperience,
        updateExperience,
        deleteExperience,
        reorderExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        reorderEducation,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        addSkillToCategory,
        removeSkillFromCategory,
        addProject,
        updateProject,
        deleteProject,
        addCertification,
        updateCertification,
        deleteCertification,
        addCustomSection,
        updateCustomSection,
        deleteCustomSection,
        addCustomSectionItem,
        updateCustomSectionItem,
        deleteCustomSectionItem,
        reorderSectionOrder,
        toggleSectionVisibility,
        updateStyling,
        setTemplate,
        savedResumes,
        refreshSavedResumes,
        loadResume,
        addSavedResume,
        createNewResume,
        duplicateResume,
        removeResume,
        resetToSample,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
