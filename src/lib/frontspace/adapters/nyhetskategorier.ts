/**
 * Nyhetskategorier (News Categories) Adapter
 * Adapts Frontspace Nyhetskategorier type to match legacy Category type
 */

import { frontspace } from '../client';
import type { Category } from '@/types';

/**
 * Transform Frontspace Nyhetskategori to legacy Category format
 */
function transformNyhetskategoriToCategory(kategori: any): Category {
  const content = kategori.content || {};

  return {
    id: kategori.id,
    title: kategori.title,
    slug: kategori.slug,
    publishedAt: kategori.published_at || kategori.createdAt,
    slugLock: false,
    parent: kategori.parent || content.parent || null,
    breadcrumbs: content.breadcrumbs || [],
    banner: content.banner || content.omslagsbild,
    description: content.beskrivning || content.description || null,
    updatedAt: kategori.updated_at || kategori.updatedAt || new Date().toISOString(),
    createdAt: kategori.created_at || kategori.createdAt || new Date().toISOString(),
  } as Category;
}

/**
 * Fetch all nyhetskategorier
 */
export async function fetchAllNyhetskategorier(limit = 100): Promise<Category[]> {
  try {
    const { posts } = await frontspace.nyhetskategorier.getAll({
      limit,
      sort: '-publishedAt'
    });

    return posts.map(transformNyhetskategoriToCategory);
  } catch (error) {
    console.error('Error fetching nyhetskategorier from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch single nyhetskategori by slug
 */
export async function fetchSingleNyhetskategori(slug: string): Promise<Category | null> {
  try {
    const kategori = await frontspace.nyhetskategorier.getBySlug(slug);
    if (!kategori) return null;

    return transformNyhetskategoriToCategory(kategori);
  } catch (error) {
    console.error(`Error fetching nyhetskategori ${slug} from Frontspace:`, error);
    return null;
  }
}
