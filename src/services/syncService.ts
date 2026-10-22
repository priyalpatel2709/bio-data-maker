import { getSupabaseClient } from './supabaseClient';
import { BiodataDocument } from '../types/biodata';
import { ResumeDocument } from '../types/resume';
import {
  getSavedDocuments,
  saveNewDocument,
  loadCurrentBiodata,
  saveCurrentBiodata,
} from '../utils/storage';
import {
  getSavedResumes,
  saveNewResume,
  loadCurrentResume,
  saveCurrentResume,
} from '../utils/resumeStorage';
import {
  getAISettings,
  saveAISettings,
  AISettings,
} from './aiService';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

type SyncListener = (status: SyncStatus) => void;
const listeners = new Set<SyncListener>();
let currentStatus: SyncStatus = 'idle';

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function setSyncStatus(status: SyncStatus): void {
  currentStatus = status;
  listeners.forEach((listener) => {
    try {
      listener(status);
    } catch (e) {
      console.error('Sync listener error:', e);
    }
  });
}

export function subscribeSyncStatus(listener: SyncListener): () => void {
  listeners.add(listener);
  listener(currentStatus);
  return () => {
    listeners.delete(listener);
  };
}

// Debounce map for document saving
const debounceTimers: Record<string, NodeJS.Timeout> = {};

/**
 * Saves a single document to the Supabase cloud table.
 * Debounced by default to avoid hammering the database during live typing.
 */
export function queueCloudSave(
  type: 'biodata' | 'resume',
  doc: BiodataDocument | ResumeDocument,
  userId: string,
  immediate = false
): void {
  const client = getSupabaseClient();
  if (!client || !userId) return;

  const key = `${type}_${doc.id}`;
  if (debounceTimers[key]) {
    clearTimeout(debounceTimers[key]);
  }

  const performSave = async () => {
    try {
      setSyncStatus('syncing');
      const now = new Date().toISOString();
      const payload = {
        id: doc.id,
        user_id: userId,
        type,
        title: doc.title || (type === 'biodata' ? 'Untitled Biodata' : 'Untitled Resume'),
        data: doc,
        updated_at: now,
      };

      const { error } = await client
        .from('documents')
        .upsert(payload, { onConflict: 'id,user_id' });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn(
            'Supabase table "public.documents" not found. Please run the SQL script in "supabase/schema.sql" in your Supabase SQL Editor.'
          );
        } else {
          console.error(`Failed to save ${type} document to cloud:`, error);
        }
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    } catch (err) {
      console.error(`Network or unexpected error saving ${type}:`, err);
      setSyncStatus('error');
    }
  };

  if (immediate) {
    void performSave();
  } else {
    debounceTimers[key] = setTimeout(() => {
      void performSave();
    }, 1500); // 1.5s debounce
  }
}

/**
 * Deletes a document from the Supabase cloud table.
 */
export async function deleteCloudDocument(
  docId: string,
  userId: string
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || !userId) return false;

  try {
    setSyncStatus('syncing');
    const { error } = await client
      .from('documents')
      .delete()
      .match({ id: docId, user_id: userId });

    if (error) {
      console.error('Failed to delete cloud document:', error);
      setSyncStatus('error');
      return false;
    }
    setSyncStatus('synced');
    return true;
  } catch (err) {
    console.error('Error deleting cloud document:', err);
    setSyncStatus('error');
    return false;
  }
}

/**
 * Saves user AI settings to cloud (API keys, provider, model)
 */
export async function saveCloudAISettings(
  settings: AISettings,
  userId: string
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !userId) return;

  try {
    const { error } = await client
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          ai_settings: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.warn('Failed to save AI settings to cloud:', error);
    }
  } catch (err) {
    console.warn('Network error saving AI settings to cloud:', err);
  }
}

/**
 * Fetches user AI settings from cloud and populates localStorage if valid
 */
export async function fetchCloudAISettings(userId: string): Promise<AISettings | null> {
  const client = getSupabaseClient();
  if (!client || !userId) return null;

  try {
    const { data, error } = await client
      .from('user_settings')
      .select('ai_settings')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Failed to fetch cloud AI settings:', error);
      return null;
    }

    if (data && data.ai_settings) {
      const cloudSettings = data.ai_settings as AISettings;
      if (cloudSettings.apiKey) {
        saveAISettings(cloudSettings);
        return cloudSettings;
      }
    }
  } catch (err) {
    console.warn('Error fetching cloud AI settings:', err);
  }
  return null;
}

export interface SyncResult {
  biodatas: BiodataDocument[];
  resumes: ResumeDocument[];
  aiSettings?: AISettings | null;
}

/**
 * Full bidirectional synchronization triggered on Login or manual "Sync Now".
 * Pulls remote documents, compares timestamps, resolves conflicts, and pushes missing local docs.
 */
export async function syncAllUserData(userId: string): Promise<SyncResult | null> {
  const client = getSupabaseClient();
  if (!client || !userId) return null;

  setSyncStatus('syncing');

  try {
    // 1. Fetch cloud documents
    const { data: cloudDocs, error: docsError } = await client
      .from('documents')
      .select('*')
      .eq('user_id', userId);

    if (docsError) {
      if (docsError.code === 'PGRST205') {
        console.warn(
          'Supabase table "public.documents" not found. Please run the SQL script in "supabase/schema.sql" in your Supabase SQL Editor.'
        );
      } else {
        console.error('Error fetching cloud documents:', docsError);
      }
      setSyncStatus('error');
      return null;
    }

    const remoteBiodatas = (cloudDocs || [])
      .filter((d) => d.type === 'biodata')
      .map((d) => d.data as BiodataDocument);

    const remoteResumes = (cloudDocs || [])
      .filter((d) => d.type === 'resume')
      .map((d) => d.data as ResumeDocument);

    // 2. Synchronize Biodatas
    const localBiodatas = getSavedDocuments();
    const mergedBiodatasMap = new Map<string, BiodataDocument>();

    // Put remote docs first
    remoteBiodatas.forEach((doc) => {
      mergedBiodatasMap.set(doc.id, doc);
    });

    // Check local docs against remote
    for (const localDoc of localBiodatas) {
      const remoteDoc = mergedBiodatasMap.get(localDoc.id);
      if (!remoteDoc) {
        // Exists locally but not remotely -> upload it to remote
        mergedBiodatasMap.set(localDoc.id, localDoc);
        queueCloudSave('biodata', localDoc, userId, true);
      } else {
        // Exists in both -> compare updatedAt
        const localTime = new Date(localDoc.updatedAt || 0).getTime();
        const remoteTime = new Date(remoteDoc.updatedAt || 0).getTime();
        if (localTime > remoteTime) {
          // Local is newer -> keep local and update remote
          mergedBiodatasMap.set(localDoc.id, localDoc);
          queueCloudSave('biodata', localDoc, userId, true);
        } else {
          // Remote is newer -> keep remote
          mergedBiodatasMap.set(localDoc.id, remoteDoc);
        }
      }
    }

    const finalBiodatas = Array.from(mergedBiodatasMap.values());
    // Update local storage with full merged list
    localStorage.setItem('biodata_saved_list', JSON.stringify(finalBiodatas));

    // Update current open biodata if matching
    const currentBiodata = loadCurrentBiodata();
    const updatedCurrentBiodata = mergedBiodatasMap.get(currentBiodata.id);
    if (updatedCurrentBiodata) {
      saveCurrentBiodata(updatedCurrentBiodata);
    }

    // 3. Synchronize Resumes
    const localResumes = getSavedResumes();
    const mergedResumesMap = new Map<string, ResumeDocument>();

    remoteResumes.forEach((doc) => {
      mergedResumesMap.set(doc.id, doc);
    });

    for (const localDoc of localResumes) {
      const remoteDoc = mergedResumesMap.get(localDoc.id);
      if (!remoteDoc) {
        mergedResumesMap.set(localDoc.id, localDoc);
        queueCloudSave('resume', localDoc, userId, true);
      } else {
        const localTime = new Date(localDoc.updatedAt || 0).getTime();
        const remoteTime = new Date(remoteDoc.updatedAt || 0).getTime();
        if (localTime > remoteTime) {
          mergedResumesMap.set(localDoc.id, localDoc);
          queueCloudSave('resume', localDoc, userId, true);
        } else {
          mergedResumesMap.set(localDoc.id, remoteDoc);
        }
      }
    }

    const finalResumes = Array.from(mergedResumesMap.values());
    localStorage.setItem('resume_saved_list', JSON.stringify(finalResumes));

    const currentResume = loadCurrentResume();
    const updatedCurrentResume = mergedResumesMap.get(currentResume.id);
    if (updatedCurrentResume) {
      saveCurrentResume(updatedCurrentResume);
    }

    // 4. Synchronize AI Settings
    const cloudAi = await fetchCloudAISettings(userId);
    const localAi = getAISettings();
    let finalAi = cloudAi;

    if (!cloudAi && localAi.apiKey) {
      // User has local API key but none in cloud -> sync up to cloud
      await saveCloudAISettings(localAi, userId);
      finalAi = localAi;
    }

    setSyncStatus('synced');
    return {
      biodatas: finalBiodatas,
      resumes: finalResumes,
      aiSettings: finalAi,
    };
  } catch (err) {
    console.error('Failed to sync all user data:', err);
    setSyncStatus('error');
    return null;
  }
}
