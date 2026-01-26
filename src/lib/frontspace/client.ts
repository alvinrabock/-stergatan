/**
 * Frontspace CMS GraphQL Client
 * Replaces Payload CMS with Frontspace headless CMS
 */

const FRONTSPACE_ENDPOINT = process.env.FRONTSPACE_ENDPOINT || 'http://localhost:3000/api/graphql';
const FRONTSPACE_STORE_ID = process.env.FRONTSPACE_STORE_ID || '';
const FRONTSPACE_API_KEY = process.env.FRONTSPACE_API_KEY;

if (!FRONTSPACE_ENDPOINT) {
  console.warn('⚠️  Frontspace endpoint not configured. Set FRONTSPACE_ENDPOINT in .env');
}

if (!FRONTSPACE_STORE_ID) {
  console.warn('⚠️  Frontspace store ID not configured. Set FRONTSPACE_STORE_ID in .env');
}

/**
 * Cache tag constants for consistent revalidation
 * These MUST match the tags used in the webhook handler
 */
export const CACHE_TAGS = {
  FRONTSPACE: 'frontspace',
  NYHETER: 'nyheter',
  LAG: 'lag',
  PARTNERS: 'partners',
  PERSONAL: 'personal',
  JOBB: 'jobb',
  DOKUMENT: 'dokument',
  NYHETSKATEGORIER: 'nyhetskategorier',
  PAGES: 'pages',
  MENUS: 'menus',
  HEADER: 'header',
  FOOTER: 'footer',
  SPELARE: 'spelare',
  STAB: 'stab',
  FORMS: 'forms',
  THEME: 'theme',
} as const;

/**
 * Get cache tags for a post type
 * Returns array of tags including the specific post type, general frontspace tag, and store-specific tag
 */
function getPostTypeCacheTags(postType: string): string[] {
  const normalizedType = postType.toLowerCase();
  const storeTag = `frontspace-${FRONTSPACE_STORE_ID}`;
  return [normalizedType, CACHE_TAGS.FRONTSPACE, storeTag];
}

/**
 * Base GraphQL fetch function for Frontspace API
 */
async function frontspaceGraphQLFetch<T>(
  query: string,
  variables?: Record<string, any>,
  tags?: string[]
): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-store-id': FRONTSPACE_STORE_ID,
    };

    if (FRONTSPACE_API_KEY) {
      headers['Authorization'] = `Bearer ${FRONTSPACE_API_KEY}`;
    }

    const response = await fetch(FRONTSPACE_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      next: {
        revalidate: false, // Only revalidate via webhook
        tags: tags || ['frontspace'], // Cache tags for on-demand revalidation
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('GraphQL Response Error:', result);
      throw new Error(`Frontspace GraphQL error: ${response.status} ${response.statusText} - ${JSON.stringify(result)}`);
    }

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data as T;
  } catch (error) {
    console.error(`❌ Error fetching from Frontspace GraphQL:`, error);
    throw error;
  }
}

/**
 * Fetch menu by slug
 */
export async function fetchMenuBySlug(slug: string): Promise<any> {
  const query = `
    query GetMenuBySlug($storeId: String!, $slug: String!) {
      menuBySlug(storeId: $storeId, slug: $slug) {
        id
        name
        slug
        store_id
        created_at
        updated_at
        items {
          id
          menu_id
          title
          link_type
          url
          slug
          page_id
          target
          css_class
          parent_id
          sort_order
          is_active
          created_at
          page {
            id
            slug
            title
            parent_id
          }
          children {
            id
            title
            link_type
            url
            slug
            page_id
            target
            page {
              id
              slug
              title
              parent_id
            }
            children {
              id
              title
              link_type
              url
              slug
              page_id
              target
              page {
                id
                slug
                title
                parent_id
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ menuBySlug: any }>(query, {
      storeId: FRONTSPACE_STORE_ID,
      slug,
    }, [CACHE_TAGS.MENUS, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);

    if (!data.menuBySlug) {
      console.warn(`Menu with slug "${slug}" not found for store ${FRONTSPACE_STORE_ID}`);
      return null;
    }

    return data.menuBySlug;
  } catch (error) {
    console.error(`Error fetching menu "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch footer template
 */
export async function fetchFooter(): Promise<any> {
  const query = `
    query GetFooter($storeId: String!) {
      footer(storeId: $storeId) {
        id
        name
        content {
          blocks {
            id
            type
            content
            styles
            responsiveStyles
          }
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ footer: any }>(query, {
      storeId: FRONTSPACE_STORE_ID,
    }, [CACHE_TAGS.FOOTER, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);

    // Handle null or empty blocks gracefully
    if (data.footer && data.footer.content) {
      if (!data.footer.content.blocks) {
        data.footer.content.blocks = [];
      }
    }

    return data.footer;
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}

/**
 * Fetch header template from CMS
 */
export async function fetchHeader(): Promise<any> {
  const query = `
    query GetHeader($storeId: String!) {
      header(storeId: $storeId) {
        id
        name
        content {
          blocks {
            id
            type
            content
            styles
            responsiveStyles
          }
        }
        headerSettings {
          position
          background
          shadow
          colorOnScroll
          backgroundColorOnScroll
          logoOnScroll
          logoMode
        }
        conditions {
          visibility
          pages
          pageTypes
          devices
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ header: any }>(query, {
      storeId: FRONTSPACE_STORE_ID,
    }, [CACHE_TAGS.HEADER, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);

    // Handle null or empty blocks gracefully
    if (data.header && data.header.content) {
      if (!data.header.content.blocks) {
        data.header.content.blocks = [];
      }
    }

    return data.header;
  } catch (error) {
    console.error('Error fetching header:', error);
    return null;
  }
}

/**
 * Fetch page by slug
 */
export async function fetchPageBySlug(slug: string): Promise<any> {
  const query = `
    query GetPage($storeId: String!, $slug: String!) {
      page(storeId: $storeId, slug: $slug) {
        id
        title
        slug
        parent_id
        status
        reverse_header_colors
        created_at
        updated_at
        published_at
        content {
          blocks {
            id
            type
            content
            styles
            responsiveStyles
          }
          pageSettings {
            seoTitle
            seoDescription
            ogImage
          }
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ page: any }>(query, {
      storeId: FRONTSPACE_STORE_ID,
      slug,
    }, [CACHE_TAGS.PAGES, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);
    return data.page;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all pages (for routing)
 */
export async function fetchAllPages(options?: {
  limit?: number;
}): Promise<any[]> {
  const { limit = 1000 } = options || {};

  const query = `
    query GetAllPages($storeId: String!, $limit: Int) {
      pages(storeId: $storeId, limit: $limit) {
        id
        title
        slug
        parent_id
        status
        reverse_header_colors
        created_at
        updated_at
        published_at
        content {
          blocks {
            id
            type
            content
            styles
            responsiveStyles
          }
          pageSettings {
            seoTitle
            seoDescription
            ogImage
          }
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ pages: any[] }>(query, {
      storeId: FRONTSPACE_STORE_ID,
      limit,
    }, [CACHE_TAGS.PAGES, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);
    // Filter to only published pages on the client side
    const publishedPages = (data.pages || []).filter((page: any) => page.status === 'published');
    return publishedPages;
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}

/**
 * Build full path for a page by traversing parent chain
 */
function buildPagePath(pageId: string, pagesMap: Map<string, any>): string {
  const segments: string[] = [];
  let currentPage = pagesMap.get(pageId);
  const visitedIds = new Set<string>();

  while (currentPage) {
    // Detect circular references
    if (visitedIds.has(currentPage.id)) {
      console.error(`Circular parent reference detected for page: ${currentPage.slug}`);
      break;
    }
    visitedIds.add(currentPage.id);

    segments.unshift(currentPage.slug);

    if (currentPage.parent_id) {
      currentPage = pagesMap.get(currentPage.parent_id);
    } else {
      break;
    }
  }

  return '/' + segments.join('/');
}

/**
 * Enrich menu items with full nested paths
 */
function enrichMenuItemsWithPaths(menuItems: any[], pagesMap: Map<string, any>): any[] {
  return menuItems.map(item => {
    const enrichedItem = { ...item };

    // Build full path for internal pages
    if (item.link_type === 'internal' && item.page_id) {
      const fullPath = buildPagePath(item.page_id, pagesMap);
      console.log(`[Menu] Enriching "${item.title}": ${item.url || item.slug} -> ${fullPath}`);
      enrichedItem.url = fullPath;
    }

    // Recursively enrich children
    if (item.children && item.children.length > 0) {
      enrichedItem.children = enrichMenuItemsWithPaths(item.children, pagesMap);
    }

    return enrichedItem;
  });
}

/**
 * Fetch all posts of a specific type
 */
export async function fetchPosts<T>(
  postType: string,
  options?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, any>;
    contentFilter?: Record<string, any>;
    sort?: string;
  }
): Promise<{ posts: T[]; total: number }> {
  const { limit = 10, offset = 0, filters, contentFilter } = options || {};

  // Use filters as contentFilter if provided (filters is the public API, contentFilter is the internal GraphQL param)
  const actualContentFilter = contentFilter || filters || null;

  // Construct GraphQL query for fetching posts from Frontspace
  const query = `
    query GetPosts($storeId: String!, $postTypeSlug: String, $limit: Int, $offset: Int, $contentFilter: JSON) {
      posts(storeId: $storeId, postTypeSlug: $postTypeSlug, limit: $limit, offset: $offset, contentFilter: $contentFilter) {
        id
        title
        slug
        content
        status
        sort_order
        created_at
        updated_at
        published_at
        postType {
          id
          name
          slug
        }
      }
    }
  `;

  try {
    const variables = {
      storeId: FRONTSPACE_STORE_ID,
      postTypeSlug: postType,
      limit,
      offset,
      contentFilter: actualContentFilter,
    };

    const data = await frontspaceGraphQLFetch<{ posts: any[] }>(query, variables, getPostTypeCacheTags(postType));

    // Filter out drafts and scheduled posts - only show published posts
    const publishedPosts = (data.posts || []).filter((post: any) => post.status === 'published');

    return {
      posts: publishedPosts as T[],
      total: publishedPosts.length,
    };
  } catch (error) {
    console.error(`Error fetching ${postType}:`, error);
    return { posts: [], total: 0 };
  }
}

/**
 * Fetch a single post by slug
 * Uses the generic 'post' query with postTypeSlug parameter
 */
export async function fetchPostBySlug<T>(
  postType: string,
  slug: string
): Promise<T | null> {
  const query = `
    query GetPost($storeId: String!, $postTypeSlug: String!, $slug: String!) {
      post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
        id
        title
        slug
        content
        status
        created_at
        updated_at
        published_at
        postType {
          id
          name
          slug
        }
        kategori {
          id
          title
          slug
          content
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<any>(query, {
      storeId: FRONTSPACE_STORE_ID,
      postTypeSlug: postType,
      slug
    }, getPostTypeCacheTags(postType));

    // Only return published posts
    if (data.post && data.post.status !== 'published') {
      return null;
    }

    return data.post || null;
  } catch (_error) {
    console.error(`Post not found: ${postType}/${slug}`);
    return null;
  }
}

/**
 * Fetch huvudmeny (main menu)
 * Parallelized: fetches menu and pages concurrently for better performance
 */
export async function fetchHuvudmeny() {
  // Fetch menu and all pages in parallel (both are needed for path enrichment)
  const [menu, allPages] = await Promise.all([
    fetchMenuBySlug('huvudmeny'),
    fetchAllPages()
  ]);

  if (!menu || !menu.items) return menu;

  const pagesMap = new Map(allPages.map(page => [page.id, page]));

  // Enrich menu items with full nested paths
  menu.items = enrichMenuItemsWithPaths(menu.items, pagesMap);

  return menu;
}

/**
 * Fetch partners with expanded relation fields (partnerniva)
 */
async function fetchPartnersWithRelations(
  options?: {
    limit?: number;
    offset?: number;
    contentFilter?: Record<string, any>;
  }
): Promise<{ posts: any[]; total: number }> {
  const { limit = 100, offset = 0, contentFilter } = options || {};

  const query = `
    query GetPartnersWithRelations($storeId: String!, $limit: Int, $offset: Int, $contentFilter: JSON) {
      posts(storeId: $storeId, postTypeSlug: "partners", limit: $limit, offset: $offset, contentFilter: $contentFilter) {
        id
        title
        slug
        content
        status
        sort_order
        created_at
        updated_at
        published_at
        partnerniva {
          id
          title
          slug
          content
        }
        postType {
          id
          name
          slug
        }
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ posts: any[] }>(query, {
      storeId: FRONTSPACE_STORE_ID,
      limit,
      offset,
      contentFilter,
    }, getPostTypeCacheTags('partners'));

    return {
      posts: data.posts || [],
      total: data.posts?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching partners with relations:', error);
    return { posts: [], total: 0 };
  }
}

// Export specific post type fetchers
export const frontspace = {
  pages: {
    getAll: (options?: Parameters<typeof fetchAllPages>[0]) => fetchAllPages(options),
    getBySlug: (slug: string) => fetchPageBySlug(slug),
  },
  menus: {
    getBySlug: (slug: string) => fetchMenuBySlug(slug),
    getHuvudmeny: () => fetchHuvudmeny(),
  },
  nyheter: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('nyheter', { ...options, sort: options?.sort || '-publishedAt' }),
    getBySlug: (slug: string) =>
      fetchPostBySlug('nyheter', slug),
  },
  lag: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('lag', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('lag', slug),
  },
  partners: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('partners', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('partners', slug),
    getAllWithRelations: (options?: { limit?: number; offset?: number; contentFilter?: Record<string, any> }) =>
      fetchPartnersWithRelations(options),
  },
  personal: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('personal', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('personal', slug),
  },
  nyhetskategorier: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('nyhetskategorier', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('nyhetskategorier', slug),
  },
  dokument: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('dokument', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('dokument', slug),
  },
  jobb: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('jobb', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('jobb', slug),
  },
  spelare: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('spelare', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('spelare', slug),
  },
  stab: {
    getAll: (options?: Parameters<typeof fetchPosts>[1]) =>
      fetchPosts('stab', options),
    getBySlug: (slug: string) =>
      fetchPostBySlug('stab', slug),
  },
  forms: {
    getById: (formId: string) => fetchFormById(formId),
  },
};

// ============================================================================
// FORMS
// ============================================================================

export interface FormField {
  name: string
  label: string
  type: string // 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: string[] // For select, radio, checkbox fields
}

export interface Form {
  id: string
  name: string
  status: string // 'active' | 'inactive'
  fields: FormField[]
  email_settings?: {
    send_to_type?: string
    to_email?: string
    form_email_field?: string
    subject?: string
    send_confirmation_to_user?: boolean
    confirmation_subject?: string
    confirmation_message?: string
  }
  created_at?: string
  updated_at?: string
}

/**
 * Fetch a specific form by ID
 */
export async function fetchFormById(formId: string): Promise<Form | null> {
  const query = `
    query GetForm($storeId: String!, $id: String!) {
      form(storeId: $storeId, id: $id) {
        id
        name
        status
        fields {
          name
          label
          type
          required
          placeholder
          options
        }
        email_settings {
          send_to_type
          to_email
          form_email_field
          subject
          send_confirmation_to_user
          confirmation_subject
          confirmation_message
        }
        created_at
        updated_at
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ form: Form }>(query, {
      storeId: FRONTSPACE_STORE_ID,
      id: formId,
    }, [CACHE_TAGS.FORMS, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);

    return data.form || null;
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
}

// ============================================================================
// THEME SETTINGS (Fonts, Colors, Typography)
// ============================================================================

import type { ThemeSettings } from './types';

/**
 * Fetch theme settings from store
 */
export async function fetchThemeSettings(): Promise<ThemeSettings | null> {
  const query = `
    query GetStoreTheme($storeId: String!) {
      storeSettings(storeId: $storeId) {
        theme_settings
      }
    }
  `;

  try {
    const data = await frontspaceGraphQLFetch<{ storeSettings: { theme_settings: ThemeSettings } }>(query, {
      storeId: FRONTSPACE_STORE_ID,
    }, [CACHE_TAGS.THEME, CACHE_TAGS.FRONTSPACE, `frontspace-${FRONTSPACE_STORE_ID}`]);

    return data.storeSettings?.theme_settings || null;
  } catch {
    // Field may not exist in schema yet - return null silently
    return null;
  }
}
