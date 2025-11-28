"use server";

import { fetchAllLag } from '@/lib/frontspace/adapters';

/**
 * Fetch all teams
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchAllTeams = async () => {
    return fetchAllLag();
};
