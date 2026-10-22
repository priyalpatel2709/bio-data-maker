import { getSupabaseClient } from './supabaseClient';
import { BiodataDocument } from '../types/biodata';
import { ResumeDocument } from '../types/resume';

export interface SharedDocumentResult {
  type: 'biodata' | 'resume';
  title: string;
  data: BiodataDocument | ResumeDocument;
  createdAt?: string;
  viewsCount?: number;
}

/**
 * Encodes an object safely into a URL-friendly UTF-8 Base64 string
 */
export function encodeDocumentToHash(type: 'biodata' | 'resume', doc: any): string {
  try {
    const jsonStr = JSON.stringify(doc);
    // UTF-8 safe base64
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64 = btoa(binary);
    return `${type}:${base64}`;
  } catch (e) {
    console.error('Failed to encode document to hash:', e);
    return '';
  }
}

/**
 * Decodes a document from a URL-friendly UTF-8 Base64 string
 */
export function decodeDocumentFromHash(hashPayload: string): { type: 'biodata' | 'resume'; data: any } | null {
  try {
    const colonIdx = hashPayload.indexOf(':');
    if (colonIdx === -1) return null;
    const type = hashPayload.slice(0, colonIdx) as 'biodata' | 'resume';
    const base64 = hashPayload.slice(colonIdx + 1);

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonStr);
    return { type, data };
  } catch (e) {
    console.error('Failed to decode document from hash:', e);
    return null;
  }
}

/**
 * Creates a shareable link.
 * 1. If Supabase is connected, attempts to save to public.shared_documents table.
 * 2. If not connected or fails, falls back immediately to a 100% offline, zero-config URL hash link.
 */
export async function createShareableLink(
  type: 'biodata' | 'resume',
  doc: BiodataDocument | ResumeDocument
): Promise<{ url: string; isCloud: boolean }> {
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const client = getSupabaseClient();

  // Try Supabase first if available
  if (client) {
    try {
      const shareSlug = (doc.id || 'doc').replace(/[^a-zA-Z0-9_-]/g, '_');
      const { error } = await client.from('shared_documents').upsert(
        {
          share_id: shareSlug,
          type,
          title: doc.title || (type === 'biodata' ? 'Biodata' : 'Resume'),
          data: doc,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'share_id' }
      );

      if (!error) {
        return {
          url: `${baseUrl}#/share?id=${shareSlug}`,
          isCloud: true,
        };
      }
      // If table doesn't exist yet (PGRST205), silently fall back to zero-config hash link
      if (error.code !== 'PGRST205') {
        console.warn('Supabase shared_documents upsert notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase share error, falling back to zero-config:', e);
    }
  }

  // Fallback to zero-config offline hash link
  const encoded = encodeDocumentToHash(type, doc);
  return {
    url: `${baseUrl}#/share?d=${encodeURIComponent(encoded)}`,
    isCloud: false,
  };
}

/**
 * Fetches or decodes a shared document from current location parameters.
 */
export async function resolveSharedDocument(): Promise<SharedDocumentResult | null> {
  const hash = window.location.hash;
  if (!hash.includes('/share')) return null;

  const searchPart = hash.includes('?') ? hash.split('?')[1] : window.location.search.replace(/^\?/, '');
  const params = new URLSearchParams(searchPart);

  const cloudId = params.get('id');
  const encodedData = params.get('d');

  // 1. Try decoding from encoded hash data
  if (encodedData) {
    const decoded = decodeDocumentFromHash(decodeURIComponent(encodedData));
    if (decoded) {
      return {
        type: decoded.type,
        title: decoded.data.title || (decoded.type === 'biodata' ? 'Biodata' : 'Resume'),
        data: decoded.data,
      };
    }
  }

  // 2. Try fetching from Supabase with cloudId
  if (cloudId) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('shared_documents')
          .select('*')
          .eq('share_id', cloudId)
          .single();

        if (data && !error) {
          // Increment view counter asynchronously
          try {
            await client.rpc('increment_share_view', { target_share_id: cloudId });
          } catch {
            // silent ignore
          }

          return {
            type: data.type,
            title: data.title,
            data: data.data,
            createdAt: data.created_at,
            viewsCount: data.views_count,
          };
        }
      } catch (e) {
        console.error('Error fetching shared document from Supabase:', e);
      }
    }
  }

  return null;
}
