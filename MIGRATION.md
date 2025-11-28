# Payload to Frontspace CMS Migration Guide

This document outlines the migration from Payload CMS to Frontspace CMS for the Östers IF website.

## Overview

The migration replaces Payload CMS with Frontspace, a headless CMS that provides similar functionality through a REST API. All existing Apollo GraphQL queries have been replaced with Frontspace API calls while maintaining backward compatibility with existing components.

## Migration Status

### ✅ Completed

1. **Frontspace Client Implementation** ([src/lib/frontspace/client.ts](src/lib/frontspace/client.ts))
   - Base fetch function with authentication
   - Specific fetchers for all 12 post types
   - Built-in caching (60 seconds)
   - Error handling

2. **TypeScript Type Definitions** ([src/lib/frontspace/types.ts](src/lib/frontspace/types.ts))
   - Complete types for all Frontspace post types
   - Matches Payload schema structure
   - Full type safety

3. **Adapter Functions** ([src/lib/frontspace/adapters/](src/lib/frontspace/adapters/))
   - `nyheter.ts` - News posts adapter
   - `lag.ts` - Teams adapter
   - `partners.ts` - Partners adapter
   - `personal.ts` - Staff members adapter
   - Transform Frontspace data to legacy Payload format

4. **Webhook Handler** ([src/app/api/frontspace/webhook/route.ts](src/app/api/frontspace/webhook/route.ts))
   - Handles content updates from Frontspace
   - Signature verification
   - Automatic cache revalidation

5. **Migrated Apollo Queries**
   - `fetchAllPosts` → uses `fetchAllNyheter`
   - `fetchSinglePosts` → uses `fetchSingleNyhet`
   - `fetchAllTeams` → uses `fetchAllLag`
   - `fetchTeamBySlug` → uses `fetchSingleLag`
   - `fetchAllPartners` → uses Frontspace partners adapter
   - `fetchSinglePartner` → uses Frontspace partners adapter
   - `fetchAllPersonal` → uses Frontspace personal adapter
   - `fetchSinglePersonalMember` → uses Frontspace personal adapter

### ⏳ Pending

1. **Environment Configuration**
   - Set up `.env` with Frontspace credentials
   - Configure webhook URL and secret

2. **Content Migration**
   - Export content from Payload
   - Import content to Frontspace
   - Verify all data migrated correctly

3. **Remaining Post Types**
   - Jobb (Job listings)
   - Dokument (Documents)
   - Partnerpaket (Partner packages)
   - Other content collections

4. **Testing**
   - Test all migrated pages with Frontspace API
   - Verify webhook functionality
   - Performance testing

## Environment Variables

Add these to your `.env` file:

```env
# Frontspace CMS
FRONTSPACE_ENDPOINT=https://api.frontspace.se
FRONTSPACE_STORE_ID=your_store_id_here
FRONTSPACE_API_KEY=your_api_key_here

# Frontspace Webhook
FRONTSPACE_WEBHOOK_URL=https://your-domain.com/api/frontspace/webhook
FRONTSPACE_WEBHOOK_SECRET=your_webhook_secret_here
```

## Post Type Mapping

| Payload Collection | Frontspace Post Type | Adapter Function |
|-------------------|---------------------|------------------|
| `posts` | `nyheter` | `fetchAllNyheter()` |
| `lags` | `lag` | `fetchAllLag()` |
| `partners` | `partners` | `fetchAllPartners()` |
| `personals` | `personal` | `fetchAllPersonal()` |
| `jobs` | `jobb` | Not yet implemented |
| `documents` | `dokument` | Not yet implemented |
| `partner-packages` | `partnerpaket` | Not yet implemented |
| `partner-levels` | `partnernivaer` | Not yet implemented |
| `news-categories` | `nyhetskategorier` | Not yet implemented |
| `document-categories` | `dokumentkategorier` | Not yet implemented |
| `staff-departments` | `personalavdelningar` | Not yet implemented |
| `package-categories` | `partnerpaket-kategorier` | Not yet implemented |

## API Endpoints

### Frontspace API Structure

```
GET  /stores/{storeId}/posts/{postType}              - List all posts
GET  /stores/{storeId}/posts/{postType}/slug/{slug}  - Get post by slug
GET  /stores/{storeId}/posts/{postType}/{id}         - Get post by ID
```

### Query Parameters

- `limit` - Number of posts to return (default: 100)
- `offset` - Offset for pagination (default: 0)
- `sort` - Sort field (prefix with `-` for descending, e.g., `-publishedAt`)
- Custom filters - Add any field as query parameter

## Usage Examples

### Before (Payload/Apollo)

```typescript
import client from '@/lib/apollo/apolloClient';
import { GET_ALL_POSTS } from './fetchAllPostsQuery';

const { data } = await client.query({
  query: GET_ALL_POSTS,
  variables: { limit: 10, page: 1 },
  fetchPolicy: 'network-only',
});

const posts = data?.Posts?.docs || [];
```

### After (Frontspace)

```typescript
import { fetchAllNyheter } from '@/lib/frontspace/adapters';

const posts = await fetchAllNyheter(10, 1);
```

### Direct Frontspace Client Usage

```typescript
import frontspace from '@/lib/frontspace';

// Fetch all news posts
const { posts, total } = await frontspace.nyheter.getAll({
  limit: 10,
  offset: 0,
  sort: '-publishedAt',
  filters: {
    visaPaHemsida: true,
  },
});

// Fetch single post by slug
const nyhet = await frontspace.nyheter.getBySlug('match-report-2025');
```

## Webhook Configuration

1. **In Frontspace Dashboard:**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/frontspace/webhook`
   - Set secret header: `x-frontspace-secret: your_webhook_secret`
   - Select events: `post.created`, `post.updated`, `post.deleted`

2. **Webhook Payload Example:**
   ```json
   {
     "event": "post.updated",
     "postType": "nyheter",
     "slug": "match-report-2025",
     "id": "abc123",
     "visaPaHemsida": true
   }
   ```

3. **Automatic Cache Revalidation:**
   - News posts: `/nyheter` and `/nyhet/[slug]`
   - Teams: `/lag` and `/lag/[slug]`
   - Partners: `/partners` and `/partner/[slug]`
   - Staff: `/om-oss/personal`
   - Homepage: revalidated for all `visaPaHemsida` content

## Data Transformation

The adapter functions transform Frontspace data to match the legacy Payload structure:

### Example: News Post (Nyhet)

**Frontspace Format:**
```typescript
{
  id: "abc123",
  rubrik: "Match Report",
  ingress: "Summary text",
  innehall: [{ type: 'paragraph', children: [...] }],
  huvudbild: { id: "img1", url: "...", alt: "..." },
  kategorier: [{ id: "cat1", namn: "Nyheter" }]
}
```

**Transformed to Legacy Format:**
```typescript
{
  id: "abc123",
  title: "Match Report",
  slug: "match-report",
  ingress: "Summary text",
  hero: {
    type: 'default',
    media: { id: "img1", url: "...", alt: "..." }
  },
  layout: [{
    blockType: 'content',
    columns: [{ richText: [...] }]
  }],
  categories: [{ id: "cat1", title: "Nyheter" }]
}
```

## Caching Strategy

1. **Client-side Cache:**
   - Frontspace client uses Next.js `revalidate: 60` (60 seconds)
   - React `cache()` wrapper for component-level caching

2. **Server-side Cache:**
   - Next.js automatic static generation
   - Tagged cache invalidation via webhooks

3. **Revalidation Triggers:**
   - Webhook events from Frontspace
   - Manual revalidation via Next.js admin API
   - Time-based revalidation (60 seconds)

## Testing Checklist

Before going live with Frontspace:

- [ ] Environment variables configured
- [ ] All content migrated from Payload
- [ ] Webhook endpoint tested
- [ ] Homepage displays correctly
- [ ] News listing page works
- [ ] News detail pages work
- [ ] Team pages work
- [ ] Partner pages work
- [ ] Staff pages work
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Images load properly
- [ ] Cache revalidation works
- [ ] Error handling tested

## Rollback Plan

If issues arise:

1. **Revert Apollo queries** - Restore original Apollo GraphQL queries from git history
2. **Re-enable Payload** - Ensure `NEXT_PUBLIC_BACKEND_URL` points to Payload backend
3. **Disable webhook** - Remove or disable Frontspace webhook in dashboard

## Support

- **Frontspace Documentation:** [README.md](src/lib/frontspace/README.md)
- **API Reference:** Check Frontspace API docs at your store dashboard
- **Type Definitions:** [src/lib/frontspace/types.ts](src/lib/frontspace/types.ts)

## Next Steps

1. Configure environment variables
2. Test Frontspace API connection
3. Migrate remaining post types (jobb, dokument, etc.)
4. Import all content from Payload to Frontspace
5. Configure webhook in Frontspace dashboard
6. Test all pages thoroughly
7. Deploy to production
8. Monitor for any issues
9. Remove Payload dependencies once stable
