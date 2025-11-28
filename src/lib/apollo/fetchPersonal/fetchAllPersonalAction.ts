'use server';

import { cache } from "react";
import { fetchAllPersonal as fetchAllPersonalFromFrontspace } from '@/lib/frontspace/adapters';

/**
 * Fetch all staff members
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchAllPersonal = cache(async () => {
  return fetchAllPersonalFromFrontspace();
});
