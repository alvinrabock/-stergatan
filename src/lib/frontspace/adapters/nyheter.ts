/**
 * Nyheter (News) Adapter
 * Adapts Frontspace Nyhet type to match legacy Post type from Payload
 */

import { frontspace } from '../client';
import type { Post } from '@/types';

/**
 * Transform Frontspace Nyhet to legacy Post format
 */
function transformNyhetToPost(nyhet: any): Post {
  // Handle the new Frontspace API structure
  const content = nyhet.content || {};
  const omslagsbild = content.omslagsbild;

  // Get Frontspace endpoint from env or use default
  const frontspaceEndpoint = process.env.FRONTSPACE_ENDPOINT || 'http://localhost:3000';
  const baseUrl = frontspaceEndpoint.replace('/api/graphql', '');

  // Handle omslagsbild - it can be either a string URL or an object
  let heroImageUrl: string | undefined;
  if (typeof omslagsbild === 'string') {
    // It's a direct URL string
    heroImageUrl = omslagsbild;
  } else if (omslagsbild && typeof omslagsbild === 'object' && omslagsbild.url) {
    // It's an object with url property
    heroImageUrl = omslagsbild.url?.startsWith('http')
      ? omslagsbild.url
      : `${baseUrl}${omslagsbild.url}`;
  }

  // Transform categories from Frontspace format
  // Categories can be in kategori (for single post) or content.kategori (for list)
  const kategorier = nyhet.kategori || content.kategori || [];

  // Ensure kategorier is an array
  const kategorierArray = Array.isArray(kategorier) ? kategorier : [];

  const categories = kategorierArray.map((kat: any) => {
    // If it's just a string ID, we can't do much with it
    if (typeof kat === 'string') {
      return {
        id: kat,
        title: '',
        slug: '',
        parent: null,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    }

    // Handle parent - it might be an object with an id or just a string/null
    let parent = null;
    if (kat.content?.parent) {
      parent = typeof kat.content.parent === 'object' ? kat.content.parent.id : kat.content.parent;
    }

    return {
      id: kat.id,
      title: kat.title,
      slug: kat.slug,
      parent,
      updatedAt: kat.updated_at || kat.updatedAt || new Date().toISOString(),
      createdAt: kat.created_at || kat.createdAt || new Date().toISOString(),
    };
  });

  return {
    id: nyhet.id,
    slug: nyhet.slug,
    title: nyhet.title,
    meta: {
      title: nyhet.title,
      description: content.ingress || '',
    },
    publishedAt: nyhet.published_at || nyhet.created_at,
    createdAt: nyhet.created_at,
    updatedAt: nyhet.updated_at,
    // Map hero image from omslagsbild
    heroImage: heroImageUrl ? {
      id: typeof omslagsbild === 'object' ? omslagsbild.id : nyhet.id,
      url: heroImageUrl,
      alt: (typeof omslagsbild === 'object' ? omslagsbild.alt : null) || nyhet.title,
      width: typeof omslagsbild === 'object' ? omslagsbild.width : null,
      height: typeof omslagsbild === 'object' ? omslagsbild.height : null,
      filename: typeof omslagsbild === 'object' ? omslagsbild.filename : null,
      mimeType: typeof omslagsbild === 'object' ? omslagsbild.mimeType : null,
      createdAt: nyhet.created_at,
      updatedAt: nyhet.updated_at,
      thumbnailURL: null,
      filesize: null,
      focalX: null,
      focalY: null,
    } : undefined,
    // Map YouTube link (field name is 'youtubelink' in Frontspace)
    youtubeLink: content.youtubelink || content.youtube_link || null,
    // Map categories
    categories,
    // Map content - the RichText component expects HTML content directly
    content: content.content || '',
    // Also provide layout format for compatibility
    layout: content.content ? [{
      blockType: 'content',
      columns: [{
        richText: content.content,
      }],
    }] : [],
    // Additional fields
    fastPost: content.fast_post || false,
    visaPaHemsida: content.visa_upp_pa_start || false,
  } as Post;
}

/**
 * Fetch all news posts with pagination
 */
export async function fetchAllNyheter(
  limit = 10,
  page = 1
): Promise<Post[]> {
  try {
    const offset = (page - 1) * limit;
    const { posts } = await frontspace.nyheter.getAll({
      limit,
      offset,
      sort: '-publishedAt',
    });

    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error('Error fetching nyheter from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch single news post by slug
 */
export async function fetchSingleNyhet(slug: string): Promise<Post | null> {
  try {
    const nyhet = await frontspace.nyheter.getBySlug(slug);
    if (!nyhet) return null;

    return transformNyhetToPost(nyhet);
  } catch (error) {
    console.error(`Error fetching nyhet ${slug} from Frontspace:`, error);
    return null;
  }
}

/**
 * Fetch news posts by category
 * Uses Frontspace's contentFilter to filter by category UUID
 */
export async function fetchNyheterByCategory(
  categorySlug: string,
  limit = 10,
  page = 1
): Promise<Post[]> {
  try {
    // Step 1: Get the category UUID from the slug
    const category = await frontspace.nyhetskategorier.getBySlug(categorySlug) as any;

    if (!category || !category.id) {
      console.warn(`[fetchNyheterByCategory] Category not found: ${categorySlug}`);
      return [];
    }

    console.log(`[fetchNyheterByCategory] Found category ${categorySlug} with ID: ${category.id}`);

    // Step 2: Fetch posts filtered by category UUID
    // The kategori field is nested in content.kategori and is an array of UUIDs
    const offset = (page - 1) * limit;

    // Fetch all posts and filter client-side since contentFilter on nested arrays might not work
    const { posts: allPosts } = await frontspace.nyheter.getAll({
      limit: 1000, // Fetch more to ensure we have enough after filtering
      sort: '-publishedAt',
    });

    // Filter posts that have this category in their content.kategori array
    const filteredPosts = allPosts.filter((post: any) => {
      const kategorier = post.content?.kategori || [];
      return kategorier.includes(category.id);
    });

    // Apply pagination after filtering
    const posts = filteredPosts.slice(offset, offset + limit);

    console.log(`[fetchNyheterByCategory] Found ${filteredPosts.length} total posts for category: ${categorySlug}, returning ${posts.length} for page ${page}`);

    // Transform and return
    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error(`Error fetching nyheter by category ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Fetch pinned/featured posts
 */
export async function fetchFastPosts(limit = 5): Promise<Post[]> {
  try {
    const { posts } = await frontspace.nyheter.getAll({
      limit,
      filters: {
        fastPost: true,
      },
      sort: '-publishedAt',
    });

    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error('Error fetching fast posts from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch posts for homepage
 */
export async function fetchHomepageNyheter(limit = 5): Promise<Post[]> {
  try {
    const { posts } = await frontspace.nyheter.getAll({
      limit,
      filters: {
        visa_upp_pa_start: true,  // Use the actual Frontspace field name
      },
      sort: '-publishedAt',
    });

    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error('Error fetching homepage nyheter from Frontspace:', error);
    return [];
  }
}

/**
 * Fetch posts for app/RSS feed (with publicera_till_app filter)
 */
export async function fetchAppPosts(limit = 50, page = 1): Promise<Post[]> {
  try {
    const offset = (page - 1) * limit;
    const { posts } = await frontspace.nyheter.getAll({
      limit,
      offset,
      filters: {
        publicera_till_app: true,
      },
      sort: '-publishedAt',
    });

    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error('Error fetching app posts from Frontspace:', error);
    return [];
  }
}

/**
 * Search news posts
 */
export async function searchNyheter(
  searchTerm: string,
  limit = 10
): Promise<Post[]> {
  try {
    const { posts } = await frontspace.nyheter.getAll({
      limit,
      filters: {
        rubrik: { contains: searchTerm },
      },
      sort: '-publishedAt',
    });

    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error(`Error searching nyheter for "${searchTerm}":`, error);
    return [];
  }
}

/**
 * Fetch news posts connected to a specific team
 * Uses the kopplade_lag relation field to filter posts
 */
export async function fetchNyheterByTeam(
  teamId: string,
  limit = 10,
  page = 1
): Promise<Post[]> {
  try {
    const offset = (page - 1) * limit;

    // Fetch all posts and filter client-side by team ID in kopplade_lag
    const { posts: allPosts } = await frontspace.nyheter.getAll({
      limit: 1000,
      sort: '-publishedAt',
    });

    // Filter posts that have this team in their content.kopplade_lag array
    const filteredPosts = allPosts.filter((post: any) => {
      const koppladelag = post.content?.kopplade_lag || [];
      // kopplade_lag can be an array of IDs (strings) or an array of objects with id
      return koppladelag.some((lag: any) => {
        if (typeof lag === 'string') {
          return lag === teamId;
        }
        return lag?.id === teamId;
      });
    });

    // Apply pagination after filtering
    const posts = filteredPosts.slice(offset, offset + limit);

    console.log(`[fetchNyheterByTeam] Found ${filteredPosts.length} total posts for team: ${teamId}, returning ${posts.length} for page ${page}`);

    return posts.map(transformNyhetToPost);
  } catch (error) {
    console.error(`Error fetching nyheter by team ${teamId}:`, error);
    return [];
  }
}
