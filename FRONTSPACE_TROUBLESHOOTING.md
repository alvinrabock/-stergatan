# Frontspace GraphQL Troubleshooting Guide

This guide helps you diagnose and fix common GraphQL errors when working with Frontspace CMS.

## Table of Contents

1. [Understanding the "Must Have Selection of Subfields" Error](#understanding-the-must-have-selection-of-subfields-error)
2. [Common GraphQL Query Errors](#common-graphql-query-errors)
3. [How to Fix Query Structure](#how-to-fix-query-structure)
4. [Debugging GraphQL Queries](#debugging-graphql-queries)
5. [Best Practices](#best-practices)

---

## Understanding the "Must Have Selection of Subfields" Error

### The Error Message

```
Field "content" of type "PageContent!" must have a selection of subfields.
Did you mean "content { ... }"?
```

### What This Means

This error occurs when you query a **complex type** (object) in GraphQL but don't specify which fields you want from that object.

### Example of WRONG Query

```graphql
query GetPage($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    id
    title
    slug
    content      # ❌ ERROR: content is an object, need to specify fields
    status
  }
}
```

### Example of CORRECT Query

```graphql
query GetPage($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    id
    title
    slug
    content {    # ✅ CORRECT: specify which fields you want
      blocks
      pageSettings
    }
    status
  }
}
```

---

## Common GraphQL Query Errors

### Error 1: Missing Subfield Selection

**Error Message:**
```
Field "content" of type "PageContent!" must have a selection of subfields
```

**Cause:** Querying an object type without specifying its fields.

**Solution:** Add curly braces `{ }` and specify the fields you need.

**Before:**
```graphql
{
  page(storeId: $storeId, slug: $slug) {
    content  # ❌ Missing subfields
  }
}
```

**After:**
```graphql
{
  page(storeId: $storeId, slug: $slug) {
    content {
      blocks
      pageSettings
    }  # ✅ Subfields specified
  }
}
```

### Error 2: Nested Object Missing Subfields

**Error Message:**
```
Field "pageSettings" of type "PageSettings!" must have a selection of subfields
```

**Cause:** Nested objects also need their fields specified.

**Solution:** Add subfields to nested objects.

**Before:**
```graphql
{
  page(storeId: $storeId, slug: $slug) {
    content {
      pageSettings  # ❌ Missing subfields
    }
  }
}
```

**After:**
```graphql
{
  page(storeId: $storeId, slug: $slug) {
    content {
      pageSettings {
        seoTitle
        seoDescription
        ogImage
      }  # ✅ Subfields specified
    }
  }
}
```

### Error 3: Array of Objects Missing Subfields

**Error Message:**
```
Field "blocks" of type "[Block!]!" must have a selection of subfields
```

**Cause:** Arrays of objects need their item fields specified.

**Solution:** Specify fields for array items.

**Before:**
```graphql
{
  page(storeId: $storeId, slug: $slug) {
    content {
      blocks  # ❌ Missing subfields for array items
    }
  }
}
```

**After:**
```graphql
{
  page(storeId: $storeId, slug: $slug) {
    content {
      blocks {
        id
        type
        content
        styles
      }  # ✅ Subfields specified for array items
    }
  }
}
```

---

## How to Fix Query Structure

### Step 1: Identify Complex Types

Complex types in Frontspace include:
- `content` (PageContent)
- `pageSettings` (PageSettings)
- `blocks` (Array of Block objects)
- `headerSettings` (HeaderSettings)
- `footerSettings` (FooterSettings)
- `meta` (Meta object)

### Step 2: Complete Page Query Structure

Here's a complete, working query for fetching a page:

```graphql
query GetPage($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    # Simple fields (scalar types)
    id
    title
    slug
    status
    created_at
    updated_at
    published_at

    # Complex field: content (must have subfields)
    content {
      # Blocks array (must have subfields)
      blocks {
        id
        type
        content
        styles
        responsiveStyles
      }

      # Page settings object (must have subfields)
      pageSettings {
        seoTitle
        seoDescription
        ogImage
      }
    }
  }
}
```

### Step 3: Complete Post Query Structure

For custom post types (like jobs, campaigns, etc.):

```graphql
query GetPost($storeId: String!, $postTypeSlug: String!, $slug: String!) {
  post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
    # Simple fields
    id
    title
    slug
    status
    store_id
    created_at
    updated_at
    published_at

    # Complex field: content (must have subfields)
    content {
      description
      location
      # Add any custom fields your post type has
    }

    # Complex field: meta (must have subfields)
    meta {
      image
      # Add any custom meta fields
    }
  }
}
```

### Step 4: Complete Header Query Structure

```graphql
query GetHeader($storeId: String!) {
  header(storeId: $storeId) {
    id
    name

    # Complex field: content
    content {
      blocks {
        id
        type
        content
        styles
        responsiveStyles
      }
    }

    # Complex field: headerSettings
    headerSettings {
      position
      background
      shadow
      colorOnScroll
      backgroundColorOnScroll
      logoOnScroll
    }
  }
}
```

---

## Debugging GraphQL Queries

### Method 1: Use GraphQL Playground

1. Open your Frontspace GraphQL endpoint in browser:
   ```
   http://localhost:3000/api/graphql
   ```

2. Test queries in the playground
3. Use autocomplete (Ctrl+Space) to see available fields
4. View schema documentation in the sidebar

### Method 2: Add Debug Logging

Add logging to your GraphQL client:

```typescript
// lib/frontspace-client.ts

async query<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  // Log the query being sent
  console.log('📤 GraphQL Query:', query)
  console.log('📦 Variables:', variables)

  try {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-store-id': this.storeId,
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    })

    const result = await response.json()

    // Log the result
    console.log('📥 GraphQL Response:', result)

    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors)
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`)
    }

    return result.data
  } catch (error) {
    console.error('❌ Fetch Error:', error)
    throw error
  }
}
```

### Method 3: Check Schema Structure

Create a test file to explore the schema:

```typescript
// app/debug-schema/page.tsx

export default function DebugSchema() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GraphQL Schema Reference</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-2">Page Query</h2>
          <pre className="bg-gray-900 text-white p-4 rounded overflow-auto">
{`query GetPage($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    id
    title
    slug
    content {
      blocks {
        id
        type
        content
        styles
      }
      pageSettings {
        seoTitle
        seoDescription
        ogImage
      }
    }
    status
  }
}`}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Post Query</h2>
          <pre className="bg-gray-900 text-white p-4 rounded overflow-auto">
{`query GetPost($storeId: String!, $postTypeSlug: String!, $slug: String!) {
  post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
    id
    title
    slug
    content {
      # Specify your custom fields here
    }
    meta {
      # Specify your meta fields here
    }
    status
  }
}`}
          </pre>
        </section>
      </div>
    </div>
  )
}
```

---

## Fixing Your Specific Error

Based on your error, here's how to fix it:

### Current Code (WRONG)

```typescript
// This is causing the error
async getPage(slug: string): Promise<Page | null> {
  const data = await this.query<{ page: Page }>(`
    query GetPage($storeId: String!, $slug: String!) {
      page(storeId: $storeId, slug: $slug) {
        id
        title
        slug
        content      # ❌ ERROR HERE
        status
        created_at
        updated_at
        published_at
      }
    }
  `, {
    storeId: this.storeId,
    slug
  })

  return data.page || null
}
```

### Fixed Code (CORRECT)

```typescript
// This is the correct version
async getPage(slug: string): Promise<Page | null> {
  const data = await this.query<{ page: Page }>(`
    query GetPage($storeId: String!, $slug: String!) {
      page(storeId: $storeId, slug: $slug) {
        id
        title
        slug
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
        status
        created_at
        updated_at
        published_at
      }
    }
  `, {
    storeId: this.storeId,
    slug
  })

  return data.page || null
}
```

### If You Want ALL Content Fields

If you're not sure which fields exist in `content`, you can use this pattern:

```typescript
async getPage(slug: string): Promise<Page | null> {
  const data = await this.query<{ page: Page }>(`
    query GetPage($storeId: String!, $slug: String!) {
      page(storeId: $storeId, slug: $slug) {
        id
        title
        slug
        content {
          # Get everything by specifying all possible fields
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
          # Add any other content fields your schema has
        }
        status
        created_at
        updated_at
        published_at
      }
    }
  `, {
    storeId: this.storeId,
    slug
  })

  return data.page || null
}
```

---

## Best Practices

### 1. Always Specify Subfields for Complex Types

```typescript
// ❌ BAD
query {
  page {
    content
  }
}

// ✅ GOOD
query {
  page {
    content {
      blocks {
        id
        type
      }
    }
  }
}
```

### 2. Request Only What You Need

```typescript
// ❌ BAD: Requesting too much data
query {
  page {
    content {
      blocks {
        id
        type
        content
        styles
        responsiveStyles
        metadata
        settings
        // ... 20 more fields you don't need
      }
    }
  }
}

// ✅ GOOD: Only request what you'll use
query {
  page {
    content {
      blocks {
        id
        type
        content
      }
    }
  }
}
```

### 3. Use Fragments for Repeated Structures

```graphql
fragment BlockFields on Block {
  id
  type
  content
  styles
  responsiveStyles
}

query GetPage($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    id
    title
    content {
      blocks {
        ...BlockFields
      }
    }
  }
}
```

### 4. Create Reusable Query Strings

```typescript
// lib/graphql-queries.ts

export const PAGE_FIELDS = `
  id
  title
  slug
  content {
    blocks {
      id
      type
      content
      styles
    }
    pageSettings {
      seoTitle
      seoDescription
      ogImage
    }
  }
  status
  created_at
  updated_at
  published_at
`

export const GET_PAGE_QUERY = `
  query GetPage($storeId: String!, $slug: String!) {
    page(storeId: $storeId, slug: $slug) {
      ${PAGE_FIELDS}
    }
  }
`

// Then use it in your client
async getPage(slug: string): Promise<Page | null> {
  const data = await this.query<{ page: Page }>(GET_PAGE_QUERY, {
    storeId: this.storeId,
    slug
  })
  return data.page || null
}
```

---

## Quick Reference: Field Types

### Scalar Types (No Subfields Needed)
- `String` - e.g., `id`, `title`, `slug`
- `Int` - e.g., `count`
- `Float` - e.g., `price`
- `Boolean` - e.g., `published`
- `ID` - e.g., `id`

### Complex Types (Subfields Required)
- `PageContent` - needs `{ blocks, pageSettings, ... }`
- `Block` - needs `{ id, type, content, ... }`
- `PageSettings` - needs `{ seoTitle, seoDescription, ... }`
- `HeaderSettings` - needs `{ position, background, ... }`
- `Meta` - needs `{ image, ... }`

### How to Tell the Difference

```graphql
# If you see ! or [] or a capitalized type name, it's complex
content: PageContent!    # Complex type, needs subfields
blocks: [Block!]!        # Array of complex types, needs subfields
title: String!           # Scalar type, no subfields needed
```

---

## Testing Your Fixes

### 1. Create a Test Page

```typescript
// app/test-graphql/page.tsx
import client from '@/lib/frontspace-client'

export default async function TestGraphQL() {
  try {
    const page = await client.getPage('home')

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-green-600">✅ Query Successful!</h1>
        <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(page, null, 2)}
        </pre>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">❌ Query Failed</h1>
        <pre className="mt-4 bg-red-100 p-4 rounded overflow-auto">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    )
  }
}

export const revalidate = 0
```

### 2. Verify in Browser

Visit `http://localhost:3000/test-graphql` to see if the query works.

### 3. Check Console

Look for these logs:
- ✅ `📤 GraphQL Query:` - Shows the query being sent
- ✅ `📥 GraphQL Response:` - Shows the successful response
- ❌ `❌ GraphQL Errors:` - Shows any errors

---

## Summary

### The Golden Rule

> **Any field that returns an object or array of objects MUST have its subfields specified.**

### Quick Fix Checklist

- [ ] Find the field causing the error (e.g., `content`)
- [ ] Add curly braces `{ }` after the field
- [ ] Add the subfields you need inside the braces
- [ ] For nested objects, repeat the process
- [ ] Test the query

### Example Transformation

```graphql
# Before (causes error)
{
  page {
    content
  }
}

# After (works correctly)
{
  page {
    content {
      blocks {
        id
        type
      }
      pageSettings {
        seoTitle
      }
    }
  }
}
```

---

## Need More Help?

1. Check the Frontspace GraphQL Playground
2. Review your schema documentation
3. Add debug logging to see the exact query being sent
4. Compare with working examples in this guide
5. Ensure all complex types have subfield selections

Remember: GraphQL requires you to be explicit about what data you want. This error is GraphQL's way of saying "You asked for an object, but didn't tell me which fields from that object you want!"
