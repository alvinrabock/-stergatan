/**
 * Pages Adapter
 * Adapts Frontspace page type to match legacy Page type from Payload
 */

import { fetchPageBySlug as fetchPageBySlugFromClient } from '../client';
import type { Page } from '@/types';

/**
 * Transform Frontspace page to Page format
 * No transformation needed for blocks - they use Frontspace structure directly
 */
function transformFrontspacePageToPage(page: any): Page {
  // Content is an object with blocks and pageSettings
  const content = page.content || {};
  const blocks = content.blocks || [];
  const pageSettings = content.pageSettings || {};

  // Frontspace blocks already have the correct structure: { id, type, content, styles, responsiveStyles }
  // No transformation needed - BlockRenderer expects this format
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    hero: { type: 'none' },
    layout: blocks, // Use Frontspace blocks directly
    meta: {
      title: pageSettings.seoTitle || page.title,
      description: pageSettings.seoDescription || '',
    },
    createdAt: page.created_at,
    updatedAt: page.updated_at,
    publishedAt: page.published_at,
    _status: page.status === 'published' ? 'published' : 'draft',
  } as Page;
}

/**
 * Fetch page by slug
 */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    const page = await fetchPageBySlugFromClient(slug);

    if (!page) return null;

    return transformFrontspacePageToPage(page);
  } catch (error) {
    console.error(`Error fetching page ${slug} from Frontspace:`, error);
    return null;
  }
}

/**
 * Fetch all pages
 */
export async function fetchAllPages(_limit = 100): Promise<Page[]> {
  // TODO: Implement fetchAllPages GraphQL query
  console.warn('fetchAllPages not yet implemented');
  return [];
}
