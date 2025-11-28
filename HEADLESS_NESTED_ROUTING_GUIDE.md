# Headless Frontend: Nested Page Routing Guide

This guide explains how to implement multi-level page routing in your headless frontend to handle parent pages with subpages (e.g., `/partners/vara-partners`).

## Table of Contents

1. [Overview](#overview)
2. [Page Structure in Frontspace](#page-structure-in-frontspace)
3. [GraphQL Queries](#graphql-queries)
4. [Implementation Examples](#implementation-examples)
5. [Dynamic Route Patterns](#dynamic-route-patterns)
6. [Best Practices](#best-practices)

---

## Overview

Frontspace supports hierarchical page structures where pages can have parent-child relationships. When a page has a parent, its full URL path is constructed by combining the parent's slug with the child's slug.

**Example URL Structure:**
```
/partners                    → Parent page (slug: "partners")
/partners/vara-partners      → Child page (slug: "vara-partners", parent: "partners")
/partners/vara-partners/team → Grandchild page (slug: "team", parent: "vara-partners")
```

---

## Page Structure in Frontspace

### Page Data Model

Each page in Frontspace has the following key fields:

```typescript
interface Page {
  id: string
  title: string
  slug: string           // The page's own slug (e.g., "vara-partners")
  parent_id: string | null
  status: string         // "published" | "draft" | "scheduled"
  content: JSON          // Page builder blocks
  created_at: string
  updated_at: string
  published_at: string | null
}
```

### Parent-Child Relationships

- **parent_id**: If set, this page is a child of another page
- **Full URL Path**: Constructed by traversing up the parent chain and joining slugs with `/`

---

## GraphQL Queries

### 1. Fetch All Published Pages

To build your routing system, first fetch all published pages:

```graphql
query GetAllPages($storeId: String!) {
  pages(storeId: $storeId, status: "published") {
    id
    title
    slug
    parent_id
    content
    published_at
    created_at
  }
}
```

**Usage:**
```javascript
const { data } = await fetch('https://your-store.frontspace.se/api/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: GET_ALL_PAGES,
    variables: { storeId: 'your-store-id' }
  })
})

const pages = data.data.pages
```

### 2. Fetch Single Page by Slug

To fetch a specific page by its slug:

```graphql
query GetPageBySlug($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    id
    title
    slug
    parent_id
    content
    published_at
  }
}
```

**Important:** This query uses the page's **own slug**, not the full URL path.

---

## Implementation Examples

### React/Next.js Example

#### Step 1: Build Full Path Mapping

Create a utility function to build full paths for all pages:

```typescript
// utils/pageRouting.ts

interface Page {
  id: string
  title: string
  slug: string
  parent_id: string | null
  content: any
}

interface PageWithPath extends Page {
  fullPath: string
}

/**
 * Builds the full URL path for a page by traversing parent chain
 */
export function buildPagePaths(pages: Page[]): PageWithPath[] {
  const pageMap = new Map(pages.map(p => [p.id, p]))

  const getFullPath = (page: Page): string => {
    const segments: string[] = []
    let current: Page | undefined = page

    // Traverse up the parent chain
    while (current) {
      segments.unshift(current.slug)
      current = current.parent_id ? pageMap.get(current.parent_id) : undefined
    }

    return '/' + segments.join('/')
  }

  return pages.map(page => ({
    ...page,
    fullPath: getFullPath(page)
  }))
}

/**
 * Finds a page by its full URL path
 */
export function findPageByPath(pages: PageWithPath[], path: string): PageWithPath | undefined {
  return pages.find(page => page.fullPath === path)
}
```

#### Step 2: Create Dynamic Catch-All Route

**File: `app/[...slug]/page.tsx` (Next.js 13+ App Router)**

```typescript
import { notFound } from 'next/navigation'
import { buildPagePaths, findPageByPath } from '@/utils/pageRouting'
import PageRenderer from '@/components/PageRenderer'

// Fetch pages data
async function getPages() {
  const response = await fetch('https://your-store.frontspace.se/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetAllPages($storeId: String!) {
          pages(storeId: $storeId, status: "published") {
            id
            title
            slug
            parent_id
            content
          }
        }
      `,
      variables: { storeId: process.env.NEXT_PUBLIC_STORE_ID }
    }),
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })

  const { data } = await response.json()
  return data.pages
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const pages = await getPages()
  const pagesWithPaths = buildPagePaths(pages)

  // Construct full path from URL segments
  const fullPath = '/' + params.slug.join('/')

  // Find matching page
  const page = findPageByPath(pagesWithPaths, fullPath)

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} />
}

// Generate static paths at build time
export async function generateStaticParams() {
  const pages = await getPages()
  const pagesWithPaths = buildPagePaths(pages)

  return pagesWithPaths.map(page => ({
    slug: page.fullPath.split('/').filter(Boolean)
  }))
}
```

**File: `pages/[...slug].tsx` (Next.js Pages Router)**

```typescript
import { GetStaticPaths, GetStaticProps } from 'next'
import { buildPagePaths, findPageByPath } from '@/utils/pageRouting'
import PageRenderer from '@/components/PageRenderer'

interface PageProps {
  page: any
}

export default function Page({ page }: PageProps) {
  return <PageRenderer page={page} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('https://your-store.frontspace.se/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetAllPages($storeId: String!) {
          pages(storeId: $storeId, status: "published") {
            id
            slug
            parent_id
          }
        }
      `,
      variables: { storeId: process.env.NEXT_PUBLIC_STORE_ID }
    })
  })

  const { data } = await response.json()
  const pagesWithPaths = buildPagePaths(data.pages)

  return {
    paths: pagesWithPaths.map(page => ({
      params: { slug: page.fullPath.split('/').filter(Boolean) }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[]
  const fullPath = '/' + slug.join('/')

  const response = await fetch('https://your-store.frontspace.se/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetAllPages($storeId: String!) {
          pages(storeId: $storeId, status: "published") {
            id
            title
            slug
            parent_id
            content
          }
        }
      `,
      variables: { storeId: process.env.NEXT_PUBLIC_STORE_ID }
    })
  })

  const { data } = await response.json()
  const pagesWithPaths = buildPagePaths(data.pages)
  const page = findPageByPath(pagesWithPaths, fullPath)

  if (!page) {
    return { notFound: true }
  }

  return {
    props: { page },
    revalidate: 60
  }
}
```

#### Step 3: Handle Root Pages

Root pages (without parents) should be accessible at `/{slug}`. You can handle this with:

**Option A: Separate route file**
```typescript
// app/[slug]/page.tsx
export default async function RootPage({ params }: { params: { slug: string } }) {
  // Same logic as [...slug] but for single segment
}
```

**Option B: Include in catch-all**
The catch-all route already handles single segments, so `/partners` works automatically.

### Vue/Nuxt Example

**File: `pages/[...slug].vue`**

```vue
<template>
  <PageRenderer v-if="page" :page="page" />
  <div v-else>Page not found</div>
</template>

<script setup lang="ts">
import { buildPagePaths, findPageByPath } from '~/utils/pageRouting'

const route = useRoute()
const fullPath = computed(() => '/' + (route.params.slug as string[]).join('/'))

const { data: pages } = await useFetch('https://your-store.frontspace.se/api/graphql', {
  method: 'POST',
  body: {
    query: `
      query GetAllPages($storeId: String!) {
        pages(storeId: $storeId, status: "published") {
          id
          title
          slug
          parent_id
          content
        }
      }
    `,
    variables: { storeId: useRuntimeConfig().public.storeId }
  },
  transform: (response) => response.data.pages
})

const pagesWithPaths = computed(() => buildPagePaths(pages.value || []))
const page = computed(() => findPageByPath(pagesWithPaths.value, fullPath.value))
</script>
```

---

## Dynamic Route Patterns

### Common URL Structures

| URL Pattern | Parent Slug | Child Slug | Grandchild Slug |
|-------------|-------------|------------|-----------------|
| `/about` | - | `about` | - |
| `/about/team` | `about` | `team` | - |
| `/about/team/leadership` | `team` | `leadership` | - |
| `/products` | - | `products` | - |
| `/products/category-a` | `products` | `category-a` | - |
| `/products/category-a/item-1` | `category-a` | `item-1` | - |

### Handling Different Depths

Your routing solution should handle unlimited nesting depth:

```typescript
// Handles any depth: /a/b/c/d/e/f...
function getPageByPath(path: string, pages: Page[]): Page | undefined {
  const pagesWithPaths = buildPagePaths(pages)
  return pagesWithPaths.find(p => p.fullPath === path)
}
```

---

## Best Practices

### 1. Caching Strategy

Cache the page hierarchy to avoid repeated GraphQL queries:

```typescript
// Using React Query
import { useQuery } from '@tanstack/react-query'

function usePages() {
  return useQuery({
    queryKey: ['pages', storeId],
    queryFn: fetchPages,
    staleTime: 60000, // 1 minute
    cacheTime: 300000  // 5 minutes
  })
}
```

### 2. SEO Optimization

Generate proper meta tags for nested pages:

```typescript
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const pages = await getPages()
  const pagesWithPaths = buildPagePaths(pages)
  const fullPath = '/' + params.slug.join('/')
  const page = findPageByPath(pagesWithPaths, fullPath)

  if (!page) return {}

  return {
    title: page.title,
    openGraph: {
      title: page.title,
      url: fullPath
    }
  }
}
```

### 3. Breadcrumb Navigation

Build breadcrumbs from the page hierarchy:

```typescript
function getBreadcrumbs(page: Page, pages: Page[]): Array<{ title: string, path: string }> {
  const pageMap = new Map(pages.map(p => [p.id, p]))
  const pagesWithPaths = buildPagePaths(pages)
  const pathMap = new Map(pagesWithPaths.map(p => [p.id, p.fullPath]))

  const breadcrumbs: Array<{ title: string, path: string }> = []
  let current: Page | undefined = page

  while (current) {
    breadcrumbs.unshift({
      title: current.title,
      path: pathMap.get(current.id) || '/'
    })
    current = current.parent_id ? pageMap.get(current.parent_id) : undefined
  }

  return breadcrumbs
}
```

### 4. Error Handling

Handle edge cases gracefully:

```typescript
// Missing parent page
if (page.parent_id && !pages.find(p => p.id === page.parent_id)) {
  console.warn(`Page "${page.slug}" has missing parent`)
  // Treat as root page or show error
}

// Circular references
const visitedIds = new Set<string>()
let current = page
while (current?.parent_id) {
  if (visitedIds.has(current.id)) {
    console.error('Circular parent reference detected')
    break
  }
  visitedIds.add(current.id)
  current = pages.find(p => p.id === current.parent_id)
}
```

### 5. Performance Optimization

**Memoize path building:**
```typescript
import { useMemo } from 'react'

function usePagePaths(pages: Page[]) {
  return useMemo(() => buildPagePaths(pages), [pages])
}
```

**Lazy load page content:**
```typescript
const PageRenderer = lazy(() => import('@/components/PageRenderer'))
```

---

## Testing Your Implementation

### Test Cases

1. **Root page**: `/about` should load page with `slug: "about"` and `parent_id: null`
2. **Child page**: `/about/team` should load page with `slug: "team"` and `parent_id: <about-page-id>`
3. **Deep nesting**: `/a/b/c/d` should correctly traverse the hierarchy
4. **Non-existent page**: `/fake/page` should return 404
5. **URL encoding**: `/products/café` should handle special characters
6. **Trailing slashes**: Both `/about` and `/about/` should work

### Example Test (Jest + React Testing Library)

```typescript
import { buildPagePaths, findPageByPath } from './pageRouting'

describe('Page Routing', () => {
  const mockPages = [
    { id: '1', slug: 'partners', parent_id: null, title: 'Partners', content: {} },
    { id: '2', slug: 'vara-partners', parent_id: '1', title: 'Våra Partners', content: {} }
  ]

  it('should build correct full paths', () => {
    const pagesWithPaths = buildPagePaths(mockPages)

    expect(pagesWithPaths[0].fullPath).toBe('/partners')
    expect(pagesWithPaths[1].fullPath).toBe('/partners/vara-partners')
  })

  it('should find page by full path', () => {
    const pagesWithPaths = buildPagePaths(mockPages)
    const page = findPageByPath(pagesWithPaths, '/partners/vara-partners')

    expect(page?.slug).toBe('vara-partners')
  })
})
```

---

## Troubleshooting

### Issue: 404 on nested pages

**Cause**: Catch-all route not configured properly
**Solution**: Ensure your route file is named `[...slug]` (with spread operator)

### Issue: Incorrect path construction

**Cause**: Parent chain not properly traversed
**Solution**: Verify `parent_id` values in your data and use the `buildPagePaths` utility

### Issue: Slow page loads

**Cause**: Fetching pages on every request
**Solution**: Implement caching with `revalidate` in Next.js or use a state management solution

---

## Additional Resources

- [Frontspace GraphQL Guide](./HEADLESS_GRAPHQL_GUIDE.md)
- [Page Builder Block Rendering](./HEADLESS_PAGES_GUIDE.md)
- [Next.js Dynamic Routes Documentation](https://nextjs.org/docs/routing/dynamic-routes)
- [Nuxt Dynamic Routes Documentation](https://nuxt.com/docs/guide/directory-structure/pages#dynamic-routes)

---

**Need help?** If you have questions about implementing nested routing in your headless frontend, please reach out to the Frontspace support team.
