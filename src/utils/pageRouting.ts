/**
 * Page Routing Utilities
 * Handles nested page routing with parent-child relationships
 */

interface Page {
  id: string;
  title: string;
  slug: string;
  parent_id?: string | null;
  parentId?: string | null;
  content: any;
}

export interface PageWithPath extends Page {
  fullPath: string;
}

/**
 * Builds the full URL path for a page by traversing parent chain
 */
export function buildPagePaths(pages: Page[]): PageWithPath[] {
  const pageMap = new Map(pages.map(p => [p.id, p]));

  const getFullPath = (page: Page): string => {
    const segments: string[] = [];
    let current: Page | undefined = page;
    const visitedIds = new Set<string>();

    // Traverse up the parent chain
    while (current) {
      // Detect circular references
      if (visitedIds.has(current.id)) {
        console.error(`Circular parent reference detected for page: ${page.slug}`);
        break;
      }
      visitedIds.add(current.id);

      segments.unshift(current.slug);
      // Support both parent_id (snake_case from GraphQL) and parentId (camelCase)
      const parentId: string | null | undefined = current.parent_id || current.parentId;
      current = parentId ? pageMap.get(parentId) : undefined;
    }

    return '/' + segments.join('/');
  };

  return pages.map(page => ({
    ...page,
    fullPath: getFullPath(page)
  }));
}

/**
 * Finds a page by its full URL path
 */
export function findPageByPath(pages: PageWithPath[], path: string): PageWithPath | undefined {
  // Normalize path (remove trailing slash if present)
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return pages.find(page => page.fullPath === normalizedPath);
}

/**
 * Generates breadcrumbs from the page hierarchy
 */
export function getBreadcrumbs(page: Page, pages: Page[]): Array<{ title: string; path: string }> {
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const pagesWithPaths = buildPagePaths(pages);
  const pathMap = new Map(pagesWithPaths.map(p => [p.id, p.fullPath]));

  const breadcrumbs: Array<{ title: string; path: string }> = [];
  let current: Page | undefined = page;
  const visitedIds = new Set<string>();

  while (current) {
    // Detect circular references
    if (visitedIds.has(current.id)) {
      console.error(`Circular parent reference detected in breadcrumbs for page: ${page.slug}`);
      break;
    }
    visitedIds.add(current.id);

    breadcrumbs.unshift({
      title: current.title,
      path: pathMap.get(current.id) || '/'
    });
    // Support both parent_id (snake_case from GraphQL) and parentId (camelCase)
    const parentId: string | null | undefined = current.parent_id || current.parentId;
    current = parentId ? pageMap.get(parentId) : undefined;
  }

  return breadcrumbs;
}
