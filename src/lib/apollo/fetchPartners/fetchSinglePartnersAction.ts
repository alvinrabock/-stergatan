"use server"
import { cache } from "react";
import { fetchSinglePartner as fetchSinglePartnerFromFrontspace } from '@/lib/frontspace/adapters';

/**
 * Fetch single partner by slug
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchSinglePartner = cache(async (slug: string) => {
  return fetchSinglePartnerFromFrontspace(slug);
});