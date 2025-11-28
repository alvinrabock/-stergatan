'use server';

import { cache } from 'react';
import { fetchPageBySlug } from '@/lib/frontspace/adapters';

/**
 * Fetch page data by slug
 * Migrated from Payload to Frontspace CMS
 */
export const fetchPageData = cache(async (slug: string, draft: boolean = false) => {
  // Frontspace doesn't support draft mode yet
  // TODO: Add draft mode support if needed
  if (draft) {
    console.warn('⚠️  Draft mode is not yet supported with Frontspace');
  }

  // Normalize slug (home page has empty slug in some systems)
  const normalizedSlug = slug === 'home' || slug === '' ? 'home' : slug;

  return fetchPageBySlug(normalizedSlug);
});
