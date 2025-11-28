# Frontspace Single Post Import Guide

This guide explains how to fetch and display single items from custom post types in Frontspace CMS, using the service pages as an example.

## Overview

When you need to create dynamic pages for individual posts (like `/service/skadeverkstad` or `/jobb/bilmekaniker`), you need to:

1. Create a fetch function to get the single post by slug
2. Create a dynamic route with `[slug]` parameter
3. Generate static paths for all posts
4. Handle the post content and display it

---

## Step 1: Create the Fetch Function

### Example: Fetching a Single Service (Tjänst)

**File:** `lib/fetchTjanster.ts`

```typescript
import { getTenantClient } from './fetch-with-tenant'
import { getCurrentStoreId } from './get-tenant'

export interface Tjanst {
  id: string
  title: string
  slug: string
  content: {
    beskrivning?: string
    omslagsbild?: string | { url: string }
    // ... other content fields
  }
  status: string
  created_at: string
  updated_at: string
  published_at: string
}

/**
 * Fetch a single Tjänst post by slug
 */
export async function getTjanstBySlug(slug: string): Promise<Tjanst | null> {
  try {
    const [tenantClient, storeId] = await Promise.all([
      getTenantClient(),
      getCurrentStoreId()
    ])

    const data = await tenantClient.query<{ post: Tjanst }>(
      `
      query GetTjanst($storeId: String!, $postTypeSlug: String!, $slug: String!) {
        post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
          id
          title
          slug
          content
          status
          created_at
          updated_at
          published_at
        }
      }
      `,
      {
        storeId,
        postTypeSlug: 'tjanster',  // Your post type slug
        slug
      }
    )

    return data.post || null
  } catch (error) {
    console.error('Error fetching single tjänst:', error)
    return null
  }
}

/**
 * Fetch all Tjänster posts (for generating static paths)
 */
export async function getAllTjanster(): Promise<Tjanst[]> {
  try {
    const [tenantClient, storeId] = await Promise.all([
      getTenantClient(),
      getCurrentStoreId()
    ])

    const data = await tenantClient.query<{ posts: Tjanst[] }>(
      `
      query GetTjanster($storeId: String!, $postTypeSlug: String!) {
        posts(storeId: $storeId, postTypeSlug: $postTypeSlug) {
          id
          title
          slug
          content
          status
          created_at
          updated_at
          published_at
        }
      }
      `,
      {
        storeId,
        postTypeSlug: 'tjanster'
      }
    )

    return data.posts || []
  } catch (error) {
    console.error('Error fetching tjanster:', error)
    return []
  }
}
```

---

## Step 2: Create the Dynamic Route

### File Structure
```
app/
└── service/
    └── [slug]/
        └── page.tsx
```

### Example: Service Page

**File:** `app/service/[slug]/page.tsx`

```typescript
import { getTjanstBySlug, getAllTjanster } from '@/lib/fetchTjanster'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// IMPORTANT: In Next.js 15, params is a Promise
type PageProps = {
  params: Promise<{ slug: string }>
}

/**
 * Generate static paths for all service pages
 */
export async function generateStaticParams() {
  const tjanster = await getAllTjanster()

  return tjanster
    .filter(tjanst => tjanst.status === 'published')
    .map((tjanst) => ({
      slug: tjanst.slug,
    }))
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tjanst = await getTjanstBySlug(slug)

  if (!tjanst) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: tjanst.title,
    description: tjanst.content.beskrivning || `Learn more about ${tjanst.title}`,
  }
}

/**
 * Service page component
 */
export default async function ServicePage({ params }: PageProps) {
  // IMPORTANT: await params in Next.js 15
  const { slug } = await params

  // Fetch the service post
  const tjanst = await getTjanstBySlug(slug)

  // Handle not found
  if (!tjanst || tjanst.status !== 'published') {
    notFound()
  }

  // Get the image URL
  const imageUrl = typeof tjanst.content.omslagsbild === 'string'
    ? tjanst.content.omslagsbild
    : tjanst.content.omslagsbild?.url

  return (
    <main className="container mx-auto px-4 py-8">
      <article>
        {/* Hero Image */}
        {imageUrl && (
          <div className="mb-8">
            <img
              src={imageUrl}
              alt={tjanst.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{tjanst.title}</h1>

        {/* Description */}
        {tjanst.content.beskrivning && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: tjanst.content.beskrivning }}
          />
        )}
      </article>
    </main>
  )
}

/**
 * Enable static generation with revalidation
 */
export const revalidate = 60 // Revalidate every 60 seconds
```

---

## Step 3: Fetching Posts with Relationships

Some posts have relationships to other post types (like Jobb posts relate to Ort locations). Here's how to handle those:

### Example: Job Post with Location Relationship

**File:** `lib/fetchJobb.ts`

```typescript
import { getTenantClient } from './fetch-with-tenant'
import { getCurrentStoreId } from './get-tenant'
import { getAllOrterCrossTenant } from './fetchOrter'

export interface JobbOrt {
  id: string
  title: string
  slug: string
  content: any
  store_id: string
}

export interface Jobb {
  id: string
  title: string
  slug: string
  content: string
  orter: JobbOrt[]  // Populated location objects
  // ... other fields
}

/**
 * Fetch a single Jobb post with populated relationships
 */
export async function getSingleJobb(slug: string): Promise<Jobb | null> {
  try {
    const [tenantClient, storeId, allOrter] = await Promise.all([
      getTenantClient(),
      getCurrentStoreId(),
      getAllOrterCrossTenant()  // Fetch all locations to populate the relationship
    ])

    const data = await tenantClient.query<{ post: any }>(
      `
      query GetSingleJobb($storeId: String!, $postTypeSlug: String!, $slug: String!) {
        post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
          id
          title
          slug
          content
          status
          store_id
          published_at
          created_at
          updated_at
        }
      }
      `,
      {
        storeId,
        postTypeSlug: 'jobb',
        slug
      }
    )

    if (!data || !data.post) {
      return null
    }

    const post = data.post

    // Create a map of orter for quick lookup
    const orterMap = new Map<string, JobbOrt>()
    allOrter.forEach(ort => {
      orterMap.set(ort.id, {
        id: ort.id,
        title: ort.title,
        slug: ort.slug,
        content: ort.content,
        store_id: ort.store_id
      })
    })

    // Populate orter relationship from content
    const ortIds = post.content?.ort || []
    const populatedOrter = ortIds
      .map((ortId: string) => orterMap.get(ortId))
      .filter((ort: JobbOrt | undefined): ort is JobbOrt => ort !== undefined)

    // Map to Jobb type with populated relationships
    const jobb: Jobb = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content?.content || '',
      orter: populatedOrter,  // Populated location objects
      status: post.status,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at
    }

    return jobb
  } catch (error) {
    console.error('Error fetching single jobb:', error)
    return null
  }
}
```

---

## Important: Querying Relationship Fields

### The `content` Field vs Relationship Fields

When you query posts from Frontspace, there are TWO ways relationship data can be stored:

1. **Inside `content` as JSON** - IDs stored in the content blob
2. **As separate relationship fields** - Full objects available as top-level fields

### Example: Bilmodell with Brand Relationship

**WRONG - Only queries content (gets IDs but not full objects):**
```graphql
query GetBilmodell {
  post(storeId: $storeId, postTypeSlug: "bilmodeller", slug: $slug) {
    id
    title
    content  # ❌ Only contains bilmarke ID, not full object
  }
}
```

**CORRECT - Explicitly queries the relationship field:**
```graphql
query GetBilmodell {
  post(storeId: $storeId, postTypeSlug: "bilmodeller", slug: $slug) {
    id
    title
    content
    bilmarke {  # ✅ Gets full brand object
      id
      title
      slug
      content
    }
  }
}
```

### How to Know What Relationship Fields Exist

1. Check your Frontspace CMS post type configuration
2. Look at the field types - relationship fields are separate from the content JSON
3. Common relationship field names:
   - `bilmarke` - Brand relationship
   - `kategori` - Category relationship
   - `avdelning` - Department relationship
   - Custom relationship fields defined in your post type

### Pattern for Handling Relationships

```typescript
// 1. Query the relationship field explicitly
const data = await client.query(`
  query GetPost {
    post(...) {
      id
      title
      content
      bilmarke {      # Relationship field
        id
        title
        slug
        content
      }
    }
  }
`)

// 2. Use the relationship if available, fall back to manual lookup if needed
if (post.bilmarke) {
  // Relationship was populated by GraphQL query
  brand = post.bilmarke
} else if (post.content?.bilmarke) {
  // Relationship ID stored in content, need to look up manually
  const brandId = post.content.bilmarke
  brand = await getBrandById(brandId)
}
```

---

## Key Points to Remember

1. **Next.js 15**: Always `await params` - `params` is now a Promise
2. **Static Generation**: Use `generateStaticParams()` for static site generation
3. **Not Found**: Use `notFound()` from `next/navigation` for 404 pages
4. **Revalidation**: Set `export const revalidate = 60` for ISR (Incremental Static Regeneration)
5. **Relationships**:
   - Query relationship fields explicitly in GraphQL (don't rely on `content` alone)
   - Populate relationships manually if they're stored as IDs in the content field
   - Create lookup maps for efficient relationship resolution
6. **HTML Content**: Use `dangerouslySetInnerHTML` for rich text content from CMS
7. **Images**: Handle both string URLs and object URLs (`{ url: string }`)

---

## Common Patterns

### Pattern 1: Simple Post (No Relationships)
- Fetch post by slug
- Display content directly
- Example: Service pages, About pages

### Pattern 2: Post with Relationships (IDs in Content)
- Fetch post by slug
- Fetch related posts separately
- Map IDs to full objects
- Example: Job posts with locations

### Pattern 3: Post with GraphQL Relationships
- Fetch post with relationship fields
- Use relationship objects directly
- Fall back to manual lookup if needed
- Example: Bilmodeller with brands

---

## Testing Your Implementation

1. **Check the data structure** in Frontspace CMS preview
2. **Verify the GraphQL query** returns the expected fields
3. **Test with missing data** (unpublished posts, missing relationships)
4. **Check static generation** with `npm run build`
5. **Verify revalidation** works after content updates in CMS

---

## Example URLs

Based on your codebase:

- `/service/skadeverkstad` - Service post type
- `/service/bilservice` - Service post type
- `/jobb/bilmekaniker` - Job post type with location relationships
- `/anlaggningar/vaxjo` - Location post type

Each follows the same pattern: `/{post-type-slug}/[slug]`
