/**
 * Stab (Staff) Adapter
 * Fetches staff data from Frontspace CMS
 */

import { frontspace, fetchPosts } from '../client';

// Staff type based on Frontspace API response
export interface FrontspaceStabContent {
  bild?: string;
  roll?: string;
  epost?: string;
  telefon?: string;
  lag?: {
    id: string;
    title: string;
    slug: string;
  } | string;
}

export interface FrontspaceStab {
  id: string;
  title: string;
  slug: string;
  content: FrontspaceStabContent;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

/**
 * Transform raw Frontspace response to FrontspaceStab type
 */
function transformStab(stab: any): FrontspaceStab {
  return {
    id: stab.id,
    title: stab.title,
    slug: stab.slug,
    content: stab.content || {},
    status: stab.status,
    created_at: stab.created_at,
    updated_at: stab.updated_at,
    published_at: stab.published_at,
  };
}

/**
 * Fetch all staff members
 */
export async function fetchAllStab(limit = 100): Promise<FrontspaceStab[]> {
  try {
    const { posts } = await fetchPosts<any>('stab', { limit });
    return posts.map(transformStab);
  } catch (error) {
    console.error('Error fetching stab from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch staff by team ID
 * Filters staff whose lag.id matches the given teamId
 */
export async function fetchStabByTeam(teamId: string): Promise<FrontspaceStab[]> {
  try {
    // Fetch all staff and filter by team
    const { posts: allStaff } = await fetchPosts<any>('stab', { limit: 200 });

    // Filter staff that belong to this team
    const filteredStaff = allStaff.filter((staff: any) => {
      const lag = staff.content?.lag;
      if (!lag) return false;

      // lag can be an object with id or just a string ID
      if (typeof lag === 'string') {
        return lag === teamId;
      }
      return lag?.id === teamId;
    });

    console.log(`[fetchStabByTeam] Found ${filteredStaff.length} staff members for team: ${teamId}`);

    return filteredStaff.map(transformStab);
  } catch (error) {
    console.error(`Error fetching stab by team ${teamId}:`, error);
    return [];
  }
}

/**
 * Fetch single staff member by slug
 */
export async function fetchSingleStab(slug: string): Promise<FrontspaceStab | null> {
  try {
    const stab = await frontspace.stab?.getBySlug?.(slug);
    if (!stab) return null;

    return transformStab(stab);
  } catch (error) {
    console.error(`Error fetching stab ${slug} from Frontspace:`, error);
    return null;
  }
}
