import { BiodataDocument } from '../types/biodata';
import { defaultBiodata } from '../data/defaultBiodata';

const STORAGE_KEY_CURRENT = 'biodata_current_doc';
const STORAGE_KEY_SAVED_LIST = 'biodata_saved_list';

export function loadCurrentBiodata(): BiodataDocument {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (!raw) return defaultBiodata;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && Array.isArray(parsed.sections)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load biodata from localStorage:', err);
  }
  return defaultBiodata;
}

export function saveCurrentBiodata(doc: BiodataDocument): void {
  try {
    const updated = {
      ...doc,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(updated));
    // Also update in saved list if present
    updateInSavedList(updated);
  } catch (err) {
    console.warn('Failed to save biodata to localStorage (quota exceeded or private browsing):', err);
  }
}

export function getSavedDocuments(): BiodataDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_LIST);
    if (!raw) {
      // Initialize with default
      const initial = [defaultBiodata];
      localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Failed to get saved documents:', err);
    return [defaultBiodata];
  }
}

export function saveNewDocument(doc: BiodataDocument): void {
  try {
    const list = getSavedDocuments();
    const existingIdx = list.findIndex(d => d.id === doc.id);
    if (existingIdx >= 0) {
      list[existingIdx] = doc;
    } else {
      list.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving new document to list:', err);
  }
}

function updateInSavedList(doc: BiodataDocument): void {
  try {
    const list = getSavedDocuments();
    const idx = list.findIndex(d => d.id === doc.id);
    if (idx >= 0) {
      list[idx] = doc;
      localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(list));
    }
  } catch {
    // silent fallback
  }
}

export function deleteSavedDocument(id: string): void {
  try {
    const list = getSavedDocuments().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(list));
  } catch (err) {
    console.error('Error deleting document:', err);
  }
}

export function duplicateSavedDocument(doc: BiodataDocument): BiodataDocument {
  const duplicated: BiodataDocument = {
    ...JSON.parse(JSON.stringify(doc)),
    id: 'doc-' + Date.now(),
    title: `${doc.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveNewDocument(duplicated);
  return duplicated;
}
