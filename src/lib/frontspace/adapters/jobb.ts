/**
 * Jobb (Jobs) Adapter
 * Fetches job listing data from Frontspace CMS
 */

import { frontspace } from '../client';

// Frontspace Jobb content type based on actual API response
export interface FrontspaceJobbContent {
  omslagsbild?: string; // URL to cover image
  content?: string; // Rich text content (HTML)
  publicerad?: string;
  slutdatum?: string; // End date for application
}

export interface FrontspaceJobb {
  id: string;
  title: string;
  slug: string;
  content: FrontspaceJobbContent;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

/**
 * Transform raw Frontspace response to FrontspaceJobb type
 */
function transformJobb(job: any): FrontspaceJobb {
  return {
    id: job.id,
    title: job.title,
    slug: job.slug,
    content: job.content || {},
    status: job.status,
    created_at: job.created_at,
    updated_at: job.updated_at,
    published_at: job.published_at,
  };
}

/**
 * Fetch all jobs
 */
export async function fetchAllJobb(limit = 100): Promise<FrontspaceJobb[]> {
  try {
    const { posts } = await frontspace.jobb.getAll({ limit });
    return posts.map(transformJobb);
  } catch (error) {
    console.error('Error fetching jobb from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch single job by slug
 */
export async function fetchSingleJobb(slug: string): Promise<FrontspaceJobb | null> {
  try {
    const job = await frontspace.jobb.getBySlug(slug);
    if (!job) return null;

    return transformJobb(job);
  } catch (error) {
    console.error(`Error fetching jobb ${slug} from Frontspace:`, error);
    return null;
  }
}
