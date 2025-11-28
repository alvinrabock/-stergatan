# Frontspace CMS Integration

This directory contains the Frontspace CMS integration that replaces Payload CMS for Östers IF.

## Files

- **`client.ts`** - API client for fetching content from Frontspace
- **`types.ts`** - TypeScript type definitions for all post types
- **`index.ts`** - Main export file

## Environment Variables

Add these to your `.env` file:

```env
FRONTSPACE_ENDPOINT=https://api.frontspace.se
FRONTSPACE_STORE_ID=your_store_id
FRONTSPACE_API_KEY=your_api_key
FRONTSPACE_WEBHOOK_URL=https://your-domain.com/api/frontspace/webhook
FRONTSPACE_WEBHOOK_SECRET=your_webhook_secret
```

## Post Types

The following post types are configured:

1. **personal** - Staff/team members
2. **personalavdelningar** - Staff departments
3. **lag** - Teams
4. **partners** - Partners
5. **partnerpaket** - Partner packages
6. **partnerpaket-kategorier** - Partner package categories
7. **partnernivaer** - Partner levels
8. **dokument** - Documents
9. **nyheter** - News/blog posts
10. **nyhetskategorier** - News categories
11. **jobb** - Job listings
12. **dokumentkategorier** - Document categories

## Usage Examples

### Fetch all news posts

```typescript
import frontspace from '@/lib/frontspace';

const { posts, total } = await frontspace.nyheter.getAll({
  limit: 10,
  offset: 0,
});
```

### Fetch a single post by slug

```typescript
import frontspace from '@/lib/frontspace';

const nyhet = await frontspace.nyheter.getBySlug('match-report-osters-hammarby');
```

### Fetch with filters

```typescript
import { fetchPosts } from '@/lib/frontspace';
import { Nyhet } from '@/lib/frontspace/types';

const { posts } = await fetchPosts<Nyhet>('nyheter', {
  limit: 5,
  filters: {
    visaPaHemsida: true,
  },
  sort: '-publishedAt', // Sort by publishedAt descending
});
```

### Using TypeScript types

```typescript
import { Nyhet, Partner, Lag } from '@/lib/frontspace/types';

// Type-safe post handling
const post: Nyhet = await frontspace.nyheter.getBySlug('slug');
console.log(post.rubrik); // ✅ Type-safe
console.log(post.invalidField); // ❌ TypeScript error
```

## Webhook Integration

The webhook endpoint is located at `/api/frontspace/webhook` and handles content updates from Frontspace.

### Webhook Events

When content is updated in Frontspace, the webhook will:

1. **Verify the signature** using `FRONTSPACE_WEBHOOK_SECRET`
2. **Revalidate affected paths** (e.g., `/nyheter`, `/nyhet/[slug]`)
3. **Clear Next.js cache** for updated content
4. **Return success response** to Frontspace

### Configure in Frontspace

In your Frontspace dashboard:

1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/frontspace/webhook`
3. Set secret header: `x-frontspace-secret: your_webhook_secret`
4. Select events: `post.created`, `post.updated`, `post.deleted`

## Adapters

For backward compatibility with existing code, we provide adapter functions that transform Frontspace data to match the legacy Payload format. This allows existing components to work without modifications.

### Using Adapters

```typescript
import { fetchAllNyheter, fetchSingleNyhet } from '@/lib/frontspace/adapters';

// Fetch all news posts (returns Post[] in legacy format)
const posts = await fetchAllNyheter(10, 1);

// Fetch single post (returns Post | null in legacy format)
const post = await fetchSingleNyhet('match-report-2025');
```

### Available Adapters

- **`adapters/nyheter.ts`** - News posts
  - `fetchAllNyheter(limit, page)`
  - `fetchSingleNyhet(slug)`
  - `fetchNyheterByCategory(categorySlug, limit, page)`
  - `fetchFastPosts(limit)`
  - `fetchHomepageNyheter(limit)`
  - `searchNyheter(searchTerm, limit)`

- **`adapters/lag.ts`** - Teams
  - `fetchAllLag(limit)`
  - `fetchSingleLag(slug)`
  - `fetchLagByKon(kon)`

- **`adapters/partners.ts`** - Partners
  - `fetchAllPartners(limit)`
  - `fetchSinglePartner(slug)`
  - `fetchHomepagePartners()`
  - `fetchPartnersByLevel(levelSlug)`

- **`adapters/personal.ts`** - Staff
  - `fetchAllPersonal(limit)`
  - `fetchSinglePersonal(slug)`
  - `fetchPersonalByAvdelning(avdelningSlug)`
  - `fetchHomepagePersonal()`

## Migration from Payload

The codebase has been migrated from Payload CMS to Frontspace. Most Apollo/GraphQL queries have been replaced with Frontspace adapters for backward compatibility.

### Migration Status

**✅ Migrated:**
- News posts (`fetchAllPosts`, `fetchSinglePosts`)
- Teams (`fetchAllTeams`, `fetchTeamBySlug`)
- Partners (`fetchAllPartners`, `fetchSinglePartner`)
- Staff (`fetchAllPersonal`, `fetchSinglePersonalMember`)

**⏳ Pending:**
- Job listings (jobb)
- Documents (dokument)
- Partner packages and categories
- News categories
- Other content collections

### For Developers

**Existing code continues to work** - The adapter functions maintain the same API as the old Apollo queries, so components don't need to be updated immediately.

**New code should use Frontspace directly:**

```typescript
// Direct Frontspace usage (recommended for new code)
import frontspace from '@/lib/frontspace';
const { posts } = await frontspace.nyheter.getAll({ limit: 10 });

// Adapter usage (for legacy compatibility)
import { fetchAllNyheter } from '@/lib/frontspace/adapters';
const posts = await fetchAllNyheter(10, 1);
```

For complete migration documentation, see [MIGRATION.md](../../../MIGRATION.md).

## Caching

Content is cached using Next.js's built-in caching:

- **Cache time**: 60 seconds (configurable in `client.ts`)
- **Revalidation**: Automatic via webhooks
- **Manual revalidation**: Use `revalidatePath()` or `revalidateTag()`

## Error Handling

The client includes built-in error handling:

```typescript
const post = await frontspace.nyheter.getBySlug('non-existent');
// Returns null if not found, logs error to console
```

For custom error handling:

```typescript
try {
  const { posts } = await frontspace.nyheter.getAll();
} catch (error) {
  console.error('Failed to fetch news:', error);
  // Handle error...
}
```
