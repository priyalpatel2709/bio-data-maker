import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BiodataDocument,
  BiodataSection,
  CustomField,
  AttachedImage,
  StylingConfig,
  TemplateId,
  Language,
} from '../types/biodata';
import { defaultBiodata } from '../data/defaultBiodata';
import { TEMPLATES } from '../data/templateCatalog';
import {
  loadCurrentBiodata,
  saveCurrentBiodata,
  getSavedDocuments,
  saveNewDocument,
  deleteSavedDocument,
  duplicateSavedDocument
} from '../utils/storage';
import {
  UI_TRANSLATIONS,
  TranslationDictionary,
  translateDocumentSections,
} from '../i18n/translations';
import { useAuth } from './AuthContext';
import { queueCloudSave, deleteCloudDocument } from '../services/syncService';

interface BiodataContextType {
  document: BiodataDocument;
  language: Language;
  setLanguage: (lang: Language) => void;
  translateBiodata: (targetLang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  viewMode: 'studio' | 'dashboard';
  setViewMode: (mode: 'studio' | 'dashboard') => void;
  activeTab: 'form' | 'design' | 'templates';
  setActiveTab: (tab: 'form' | 'design' | 'templates') => void;
  previewZoom: number | 'fit';
  setPreviewZoom: (zoom: number | 'fit') => void;
  mobilePreviewOpen: boolean;
  setMobilePreviewOpen: (open: boolean) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  // Document actions
  updateDocumentTitle: (title: string) => void;
  setPhotoUrl: (url: string | undefined) => void;
  updateStyling: (styling: Partial<StylingConfig>) => void;
  setTemplate: (templateId: TemplateId) => void;

  // Attached Images actions (for appending high-res photos to document end)
  addAttachedImage: (image: { url: string; caption?: string; filename?: string; sizeBytes?: number }) => void;
  updateAttachedImage: (id: string, updates: Partial<AttachedImage>) => void;
  deleteAttachedImage: (id: string) => void;
  reorderAttachedImages: (images: AttachedImage[]) => void;

  // Section actions
  addSection: (title: string, description?: string) => void;
  updateSection: (sectionId: string, updates: Partial<BiodataSection>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (newSections: BiodataSection[]) => void;

  // Field actions
  addField: (sectionId: string, field: Omit<CustomField, 'id'>) => void;
  updateField: (sectionId: string, fieldId: string, updates: Partial<CustomField>) => void;
  deleteField: (sectionId: string, fieldId: string) => void;
  reorderFields: (sectionId: string, newFields: CustomField[]) => void;
  moveField: (sourceSectionId: string, targetSectionId: string, fieldId: string) => void;

  // Persistence & Draft management
  savedDocs: BiodataDocument[];
  refreshSavedDocs: () => void;
  loadDocument: (doc: BiodataDocument) => void;
  createNewDocument: () => void;
  duplicateDocument: (doc: BiodataDocument) => void;
  removeDocument: (id: string) => void;
  resetToDefault: () => void;
}

const BiodataContext = createContext<BiodataContextType | undefined>(undefined);

export const BiodataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, syncStatus } = useAuth();
  const [document, setDocument] = useState<BiodataDocument>(loadCurrentBiodata);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('biodatamaker_language') as Language) || 'en';
  });
  const [viewMode, setViewMode] = useState<'studio' | 'dashboard'>('dashboard');
  const [activeTab, setActiveTab] = useState<'form' | 'design' | 'templates'>('form');
  const [previewZoom, setPreviewZoom] = useState<number | 'fit'>('fit');
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [savedDocs, setSavedDocs] = useState<BiodataDocument[]>(getSavedDocuments);

  // Auto-save locally and sync to cloud if authenticated
  useEffect(() => {
    saveCurrentBiodata(document);
    if (user?.id) {
      queueCloudSave('biodata', document, user.id);
    }
  }, [document, user?.id]);

  // Refresh saved documents when cloud sync completes
  useEffect(() => {
    if (syncStatus === 'synced') {
      setSavedDocs(getSavedDocuments());
      setDocument(loadCurrentBiodata());
    }
  }, [syncStatus]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('biodatamaker_language', lang);
    setDocument(prev => ({
      ...prev,
      language: lang,
      styling: {
        ...prev.styling,
        language: lang,
      }
    }));
  }, []);

  const translateBiodata = useCallback((targetLang: Language) => {
    setLanguageState(targetLang);
    localStorage.setItem('biodatamaker_language', targetLang);
    setDocument(prev => ({
      ...prev,
      language: targetLang,
      styling: {
        ...prev.styling,
        language: targetLang,
      },
      sections: translateDocumentSections(prev.sections, targetLang),
    }));
  }, []);

  const t = useCallback((key: keyof TranslationDictionary): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || String(key);
  }, [language]);

  const refreshSavedDocs = useCallback(() => {
    setSavedDocs(getSavedDocuments());
  }, []);

  const updateDocumentTitle = useCallback((title: string) => {
    setDocument(prev => ({ ...prev, title }));
  }, []);

  const setPhotoUrl = useCallback((photoUrl: string | undefined) => {
    setDocument(prev => ({ ...prev, photoUrl }));
  }, []);

  const updateStyling = useCallback((updates: Partial<StylingConfig>) => {
    setDocument(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        ...updates
      }
    }));
  }, []);

  const setTemplate = useCallback((templateId: TemplateId) => {
    const templateDef = TEMPLATES.find(t => t.id === templateId);
    if (!templateDef) return;

    setDocument(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        ...templateDef.defaultStyling,
        templateId
      }
    }));
  }, []);

  // Attached Images Handlers (High-Resolution Photos appended to end)
  const addAttachedImage = useCallback((image: { url: string; caption?: string; filename?: string; sizeBytes?: number }) => {
    const newImg: AttachedImage = {
      id: 'img-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      url: image.url,
      caption: image.caption || '',
      filename: image.filename,
      sizeBytes: image.sizeBytes,
    };
    setDocument(prev => ({
      ...prev,
      attachedImages: [...(prev.attachedImages || []), newImg]
    }));
  }, []);

  const updateAttachedImage = useCallback((id: string, updates: Partial<AttachedImage>) => {
    setDocument(prev => ({
      ...prev,
      attachedImages: (prev.attachedImages || []).map(img => img.id === id ? { ...img, ...updates } : img)
    }));
  }, []);

  const deleteAttachedImage = useCallback((id: string) => {
    setDocument(prev => ({
      ...prev,
      attachedImages: (prev.attachedImages || []).filter(img => img.id !== id)
    }));
  }, []);

  const reorderAttachedImages = useCallback((newImages: AttachedImage[]) => {
    setDocument(prev => ({
      ...prev,
      attachedImages: newImages
    }));
  }, []);

  // Section actions
  const addSection = useCallback((title: string, description?: string) => {
    const newSection: BiodataSection = {
      id: 'sec-' + Date.now(),
      key: 'custom_' + Date.now(),
      title,
      description,
      isCustom: true,
      visible: true,
      fields: []
    };
    setDocument(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<BiodataSection>) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(sec => sec.id === sectionId ? { ...sec, ...updates } : sec)
    }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.filter(sec => sec.id !== sectionId)
    }));
  }, []);

  const reorderSections = useCallback((newSections: BiodataSection[]) => {
    setDocument(prev => ({
      ...prev,
      sections: newSections
    }));
  }, []);

  // Field actions
  const addField = useCallback((sectionId: string, fieldData: Omit<CustomField, 'id'>) => {
    const newField: CustomField = {
      ...fieldData,
      id: 'fld-' + Date.now()
    };
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: [...sec.fields, newField]
          };
        }
        return sec;
      })
    }));
  }, []);

  const updateField = useCallback((sectionId: string, fieldId: string, updates: Partial<CustomField>) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
          };
        }
        return sec;
      })
    }));
  }, []);

  const deleteField = useCallback((sectionId: string, fieldId: string) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            fields: sec.fields.filter(f => f.id !== fieldId)
          };
        }
        return sec;
      })
    }));
  }, []);

  const reorderFields = useCallback((sectionId: string, newFields: CustomField[]) => {
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, fields: newFields };
        }
        return sec;
      })
    }));
  }, []);

  const moveField = useCallback((sourceSectionId: string, targetSectionId: string, fieldId: string) => {
    setDocument(prev => {
      let targetField: CustomField | undefined;
      const cleanSections = prev.sections.map(sec => {
        if (sec.id === sourceSectionId) {
          targetField = sec.fields.find(f => f.id === fieldId);
          return {
            ...sec,
            fields: sec.fields.filter(f => f.id !== fieldId)
          };
        }
        return sec;
      });

      if (!targetField) return prev;

      return {
        ...prev,
        sections: cleanSections.map(sec => {
          if (sec.id === targetSectionId) {
            return {
              ...sec,
              fields: [...sec.fields, targetField!]
            };
          }
          return sec;
        })
      };
    });
  }, []);

  const loadDocument = useCallback((doc: BiodataDocument) => {
    setDocument(doc);
    saveCurrentBiodata(doc);
    setViewMode('studio');
  }, []);

  const createNewDocument = useCallback(() => {
    const blankDoc: BiodataDocument = {
      ...JSON.parse(JSON.stringify(defaultBiodata)),
      id: 'doc-' + Date.now(),
      title: 'New Biodata Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDocument(blankDoc);
    saveNewDocument(blankDoc);
    if (user?.id) {
      queueCloudSave('biodata', blankDoc, user.id, true);
    }
    refreshSavedDocs();
    setViewMode('studio');
  }, [refreshSavedDocs, user?.id]);

  const duplicateDocument = useCallback((doc: BiodataDocument) => {
    const dup = duplicateSavedDocument(doc);
    if (user?.id) {
      queueCloudSave('biodata', dup, user.id, true);
    }
    refreshSavedDocs();
    setDocument(dup);
    setViewMode('studio');
  }, [refreshSavedDocs, user?.id]);

  const removeDocument = useCallback((id: string) => {
    deleteSavedDocument(id);
    if (user?.id) {
      void deleteCloudDocument(id, user.id);
    }
    refreshSavedDocs();
  }, [refreshSavedDocs, user?.id]);

  const resetToDefault = useCallback(() => {
    setDocument(defaultBiodata);
    saveCurrentBiodata(defaultBiodata);
  }, []);

  return (
    <BiodataContext.Provider
      value={{
        document,
        language,
        setLanguage,
        translateBiodata,
        t,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        previewZoom,
        setPreviewZoom,
        mobilePreviewOpen,
        setMobilePreviewOpen,
        exportModalOpen,
        setExportModalOpen,
        updateDocumentTitle,
        setPhotoUrl,
        updateStyling,
        setTemplate,
        addAttachedImage,
        updateAttachedImage,
        deleteAttachedImage,
        reorderAttachedImages,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        addField,
        updateField,
        deleteField,
        reorderFields,
        moveField,
        savedDocs,
        refreshSavedDocs,
        loadDocument,
        createNewDocument,
        duplicateDocument,
        removeDocument,
        resetToDefault,
      }}
    >
      {children}
    </BiodataContext.Provider>
  );
};

export const useBiodata = () => {
  const context = useContext(BiodataContext);
  if (!context) {
    throw new Error('useBiodata must be used within a BiodataProvider');
  }
  return context;
};
