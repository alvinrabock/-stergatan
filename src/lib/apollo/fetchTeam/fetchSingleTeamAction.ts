"use server";

import { fetchSingleLag } from '@/lib/frontspace/adapters';

/**
 * Fetch team by slug
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchTeamBySlug = async (slug: string) => {
  return fetchSingleLag(slug);
};
