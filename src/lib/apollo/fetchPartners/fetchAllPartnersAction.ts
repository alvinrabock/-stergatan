"use server"

import { cache } from "react";
import { fetchAllPartners as fetchAllPartnersFromFrontspace } from '@/lib/frontspace/adapters';

/**
 * Fetch all partners
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchAllPartners = cache(async () => {
    return fetchAllPartnersFromFrontspace();
  });