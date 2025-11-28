"use server"
import { cache } from "react";
import { fetchSinglePersonal } from '@/lib/frontspace/adapters';

/**
 * Fetch single staff member by slug
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchSinglePersonalMember = cache(async (slug: string) => {
  return fetchSinglePersonal(slug);
});