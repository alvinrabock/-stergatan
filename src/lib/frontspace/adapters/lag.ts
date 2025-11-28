/**
 * Lag (Teams) Adapter
 * Fetches team data from Frontspace CMS
 */

import { frontspace } from '../client';

// Training session type
export interface TrainingSession {
  _entryId?: string;
  _entryNumber?: number;
  datum: string;
  startid: string;
  sluttid: string;
  plats?: string;
  notering?: string;
}

// Frontspace Lag type based on actual API response
export interface FrontspaceLagContent {
  omslagsbild?: string;
  traningstillfallen?: TrainingSession[];
  spelare?: string;
  stab?: string;
  sportadminlank?: string;
  lanka_helt_till_sportadmin?: string | boolean;
  fetchfromsefapi?: boolean;
  sorteringsordning?: number;
  // SMC/Fogis integration fields
  fogis_teamid?: string;
  fogis_teamslug?: string;
  smc_teamid?: string;
}

export interface FrontspaceLag {
  id: string;
  title: string;
  slug: string;
  content: FrontspaceLagContent;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

/**
 * Transform raw Frontspace response to FrontspaceLag type
 */
function transformLag(lag: any): FrontspaceLag {
  return {
    id: lag.id,
    title: lag.title,
    slug: lag.slug,
    content: lag.content || {},
    status: lag.status,
    created_at: lag.created_at,
    updated_at: lag.updated_at,
    published_at: lag.published_at,
  };
}

/**
 * Fetch all teams
 */
export async function fetchAllLag(limit = 100): Promise<FrontspaceLag[]> {
  try {
    const { posts } = await frontspace.lag.getAll({ limit });
    return posts.map(transformLag);
  } catch (error) {
    console.error('Error fetching lag from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch single team by slug
 */
export async function fetchSingleLag(slug: string): Promise<FrontspaceLag | null> {
  try {
    const lag = await frontspace.lag.getBySlug(slug);
    if (!lag) return null;

    return transformLag(lag);
  } catch (error) {
    console.error(`Error fetching lag ${slug} from Frontspace:`, error);
    return null;
  }
}

/**
 * Fetch teams with SEF/SMC API enabled
 * Returns teams that have fetchfromsefapi=true and have smc_teamid set
 */
export async function fetchTeamsWithSEF(): Promise<FrontspaceLag[]> {
  try {
    const allTeams = await fetchAllLag();
    return allTeams.filter(
      (team) => team.content.fetchfromsefapi === true && team.content.smc_teamid
    );
  } catch (error) {
    console.error('Error fetching SEF teams from Frontspace:', error);
    return [];
  }
}
