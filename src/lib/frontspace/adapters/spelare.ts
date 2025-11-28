/**
 * Spelare (Players) Adapter
 * Fetches player data from Frontspace CMS
 */

import { frontspace, fetchPosts } from '../client';

// Player type based on Frontspace API response
export interface FrontspaceSpelareContent {
  bild?: string;
  land?: string;
  trojnummer?: string;
  position?: string;
  utlanad?: string;
  kommentar?: string;
  lag?: {
    id: string;
    title: string;
    slug: string;
  } | string;
}

export interface FrontspaceSpelare {
  id: string;
  title: string;
  slug: string;
  content: FrontspaceSpelareContent;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

/**
 * Transform raw Frontspace response to FrontspaceSpelare type
 */
function transformSpelare(spelare: any): FrontspaceSpelare {
  return {
    id: spelare.id,
    title: spelare.title,
    slug: spelare.slug,
    content: spelare.content || {},
    status: spelare.status,
    created_at: spelare.created_at,
    updated_at: spelare.updated_at,
    published_at: spelare.published_at,
  };
}

/**
 * Fetch all players
 */
export async function fetchAllSpelare(limit = 100): Promise<FrontspaceSpelare[]> {
  try {
    const { posts } = await fetchPosts<any>('spelare', { limit });
    return posts.map(transformSpelare);
  } catch (error) {
    console.error('Error fetching spelare from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch players by team ID
 * Filters players whose lag.id matches the given teamId
 */
export async function fetchSpelareByTeam(teamId: string): Promise<FrontspaceSpelare[]> {
  try {
    // Fetch all players and filter by team
    const { posts: allPlayers } = await fetchPosts<any>('spelare', { limit: 500 });

    // Filter players that belong to this team
    const filteredPlayers = allPlayers.filter((player: any) => {
      const lag = player.content?.lag;
      if (!lag) return false;

      // lag can be an object with id or just a string ID
      if (typeof lag === 'string') {
        return lag === teamId;
      }
      return lag?.id === teamId;
    });

    console.log(`[fetchSpelareByTeam] Found ${filteredPlayers.length} players for team: ${teamId}`);

    // Sort by trojnummer (jersey number)
    const sortedPlayers = filteredPlayers.sort((a: any, b: any) => {
      const numA = parseInt(a.content?.trojnummer || '999', 10);
      const numB = parseInt(b.content?.trojnummer || '999', 10);
      return numA - numB;
    });

    return sortedPlayers.map(transformSpelare);
  } catch (error) {
    console.error(`Error fetching spelare by team ${teamId}:`, error);
    return [];
  }
}

/**
 * Fetch single player by slug
 */
export async function fetchSingleSpelare(slug: string): Promise<FrontspaceSpelare | null> {
  try {
    const spelare = await frontspace.spelare?.getBySlug?.(slug);
    if (!spelare) return null;

    return transformSpelare(spelare);
  } catch (error) {
    console.error(`Error fetching spelare ${slug} from Frontspace:`, error);
    return null;
  }
}
