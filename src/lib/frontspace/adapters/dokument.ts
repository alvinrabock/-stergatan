/**
 * Dokument (Documents) Adapter
 * Fetches document data from Frontspace CMS
 */

import { frontspace } from '../client';

// Frontspace Dokument content type based on expected API response
export interface FrontspaceDokumentContent {
  beskrivning?: string;
  fil?: string; // URL to the file
}

export interface FrontspaceDokument {
  id: string;
  title: string;
  slug: string;
  content: FrontspaceDokumentContent;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

/**
 * Transform raw Frontspace response to FrontspaceDokument type
 */
function transformDokument(doc: any): FrontspaceDokument {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content || {},
    status: doc.status,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    published_at: doc.published_at,
  };
}

/**
 * Fetch all documents
 */
export async function fetchAllDokument(limit = 100): Promise<FrontspaceDokument[]> {
  try {
    const { posts } = await frontspace.dokument.getAll({ limit });
    return posts.map(transformDokument);
  } catch (error) {
    console.error('Error fetching dokument from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch single document by slug
 */
export async function fetchSingleDokument(slug: string): Promise<FrontspaceDokument | null> {
  try {
    const doc = await frontspace.dokument.getBySlug(slug);
    if (!doc) return null;

    return transformDokument(doc);
  } catch (error) {
    console.error(`Error fetching dokument ${slug} from Frontspace:`, error);
    return null;
  }
}
