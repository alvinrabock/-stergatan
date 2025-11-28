# Headless Pages Integration Guide

This guide explains how to fetch and render pages from the Frontspace CMS in your headless frontend application, including webhook integration for automatic revalidation.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Fetching Pages](#fetching-pages)
4. [Rendering Page Content](#rendering-page-content)
5. [Webhook Integration](#webhook-integration)
6. [Block Types Reference](#block-types-reference)
7. [Complete Examples](#complete-examples)

## Overview

The Frontspace CMS provides a headless API for fetching page content, including:
- Page metadata (title, SEO settings, slug)
- Visual page builder content (blocks)
- Responsive styles and layouts
- Typography and theme settings

Pages are built using a block-based system where each page consists of multiple blocks (sections) that can be customized with content, styles, and responsive behaviors.

## API Endpoints

### Base URL
```
https://your-store-subdomain.frontspace.se/api
```

### Available Endpoints

#### 1. Get All Pages
```http
GET /api/pages
```

Returns a list of all published pages for the current store.

**Response:**
```json
{
  "pages": [
    {
      "id": "uuid",
      "title": "Home Page",
      "slug": "home",
      "meta_title": "Welcome to Our Store",
      "meta_description": "Shop the latest products...",
      "status": "published",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 2. Get Page by Slug
```http
GET /api/pages/{slug}
```

Returns complete page data including content blocks.

**Response:**
```json
{
  "page": {
    "id": "uuid",
    "title": "Home Page",
    "slug": "home",
    "meta_title": "Welcome to Our Store",
    "meta_description": "Shop the latest products...",
    "og_title": "Welcome to Our Store",
    "og_description": "Shop the latest products...",
    "og_image": "https://...",
    "status": "published",
    "content": [
      {
        "id": "block-1",
        "type": "hero",
        "content": {
          "heading": "Welcome to Our Store",
          "subheading": "Discover amazing products",
          "buttonText": "Shop Now",
          "buttonLink": "/shop",
          "backgroundImage": "https://..."
        },
        "styles": {
          "backgroundColor": "#ffffff",
          "padding": "60px 20px"
        },
        "responsiveStyles": {
          "padding": {
            "desktop": "60px 20px",
            "tablet": "40px 20px",
            "mobile": "30px 15px"
          }
        }
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 3. Get Page by ID
```http
GET /api/pages/by-id/{id}
```

Returns page data by UUID instead of slug.

## Fetching Pages

### Next.js App Router Example

```typescript
// app/[slug]/page.tsx
import { notFound } from 'next/navigation'

interface PageData {
  id: string
  title: string
  slug: string
  meta_title?: string
  meta_description?: string
  og_title?: string
  og_description?: string
  og_image?: string
  content: Block[]
}

interface Block {
  id: string
  type: string
  content: Record<string, any>
  styles?: Record<string, any>
  responsiveStyles?: Record<string, any>
}

async function getPage(slug: string): Promise<PageData | null> {
  const res = await fetch(
    `https://your-store.frontspace.se/api/pages/${slug}`,
    {
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: [`page-${slug}`] // Tag for on-demand revalidation
      }
    }
  )

  if (!res.ok) {
    return null
  }

  const data = await res.json()
  return data.page
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)

  if (!page) return {}

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.og_title || page.meta_title || page.title,
      description: page.og_description || page.meta_description,
      images: page.og_image ? [page.og_image] : [],
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} />
}

// Generate static params for all pages
export async function generateStaticParams() {
  const res = await fetch('https://your-store.frontspace.se/api/pages')
  const data = await res.json()

  return data.pages.map((page: any) => ({
    slug: page.slug,
  }))
}
```

### React/Remix Example

```typescript
// routes/$slug.tsx
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader({ params }: LoaderArgs) {
  const res = await fetch(
    `https://your-store.frontspace.se/api/pages/${params.slug}`
  )

  if (!res.ok) {
    throw new Response('Not Found', { status: 404 })
  }

  const data = await res.json()
  return json({ page: data.page })
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>()

  return <PageRenderer page={page} />
}
```

### Vue/Nuxt Example

```typescript
// pages/[slug].vue
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: page, error } = await useFetch(
  `https://your-store.frontspace.se/api/pages/${slug}`
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: page.value?.page.meta_title || page.value?.page.title,
  meta: [
    {
      name: 'description',
      content: page.value?.page.meta_description
    },
    {
      property: 'og:title',
      content: page.value?.page.og_title || page.value?.page.meta_title
    },
    {
      property: 'og:description',
      content: page.value?.page.og_description || page.value?.page.meta_description
    },
    {
      property: 'og:image',
      content: page.value?.page.og_image
    }
  ]
})
</script>

<template>
  <PageRenderer :page="page?.page" />
</template>
```

## Rendering Page Content

### Block Renderer Component

Create a component to render different block types:

```typescript
// components/PageRenderer.tsx
import React from 'react'
import { HeroBlock } from './blocks/HeroBlock'
import { TextBlock } from './blocks/TextBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { ButtonBlock } from './blocks/ButtonBlock'
import { ContainerBlock } from './blocks/ContainerBlock'

interface Block {
  id: string
  type: string
  content: Record<string, any>
  styles?: Record<string, any>
  responsiveStyles?: Record<string, any>
}

interface PageRendererProps {
  page: {
    content: Block[]
  }
}

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  container: ContainerBlock,
  // Add more block types as needed
}

export function PageRenderer({ page }: PageRendererProps) {
  return (
    <div className="page-content">
      {page.content.map((block) => {
        const BlockComponent = blockComponents[block.type]

        if (!BlockComponent) {
          console.warn(`Unknown block type: ${block.type}`)
          return null
        }

        return (
          <BlockComponent
            key={block.id}
            id={block.id}
            content={block.content}
            styles={block.styles}
            responsiveStyles={block.responsiveStyles}
          />
        )
      })}
    </div>
  )
}
```

### Responsive Styles Helper

```typescript
// lib/responsive-styles.ts
interface ResponsiveStylesMap {
  [property: string]: {
    desktop?: string
    tablet?: string
    mobile?: string
  }
}

export function generateResponsiveCSS(
  blockId: string,
  responsiveStyles?: ResponsiveStylesMap
): string {
  if (!responsiveStyles) return ''

  let css = ''

  Object.entries(responsiveStyles).forEach(([property, values]) => {
    // Desktop (default)
    if (values.desktop) {
      css += `#${blockId} { ${property}: ${values.desktop}; }\n`
    }

    // Tablet
    if (values.tablet) {
      css += `@media (max-width: 1024px) {
        #${blockId} { ${property}: ${values.tablet}; }
      }\n`
    }

    // Mobile
    if (values.mobile) {
      css += `@media (max-width: 768px) {
        #${blockId} { ${property}: ${values.mobile}; }
      }\n`
    }
  })

  return css
}
```

### Example Block Component

```typescript
// components/blocks/HeroBlock.tsx
import React from 'react'
import { generateResponsiveCSS } from '@/lib/responsive-styles'

interface HeroBlockProps {
  id: string
  content: {
    heading?: string
    subheading?: string
    buttonText?: string
    buttonLink?: string
    backgroundImage?: string
  }
  styles?: Record<string, any>
  responsiveStyles?: any
}

export function HeroBlock({ id, content, styles, responsiveStyles }: HeroBlockProps) {
  const responsiveCSS = generateResponsiveCSS(id, responsiveStyles)

  return (
    <>
      {responsiveCSS && (
        <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
      )}
      <section
        id={id}
        className="hero-block"
        style={{
          ...styles,
          backgroundImage: content.backgroundImage
            ? `url(${content.backgroundImage})`
            : undefined,
        }}
      >
        <div className="hero-content">
          {content.heading && <h1>{content.heading}</h1>}
          {content.subheading && <p>{content.subheading}</p>}
          {content.buttonText && content.buttonLink && (
            <a href={content.buttonLink} className="hero-button">
              {content.buttonText}
            </a>
          )}
        </div>
      </section>
    </>
  )
}
```

## Webhook Integration

The CMS sends webhooks when pages are created, updated, or deleted. Use these webhooks to trigger revalidation in your frontend.

### Webhook Payload

```json
{
  "event": "page.updated",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "id": "uuid",
    "slug": "home",
    "title": "Home Page",
    "status": "published",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

### Event Types

- `page.created` - New page created
- `page.updated` - Page content or settings updated
- `page.deleted` - Page deleted
- `page.published` - Page published
- `page.unpublished` - Page unpublished

### Next.js Revalidation Endpoint

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify webhook signature (recommended)
  const signature = request.headers.get('x-webhook-signature')
  if (!verifySignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = await request.json()
  const { event, data } = body

  try {
    switch (event) {
      case 'page.created':
      case 'page.updated':
      case 'page.published':
        // Revalidate the specific page
        revalidateTag(`page-${data.slug}`)
        revalidatePath(`/${data.slug}`)

        // Also revalidate the pages list
        revalidateTag('pages-list')
        break

      case 'page.deleted':
      case 'page.unpublished':
        // Revalidate the pages list
        revalidateTag('pages-list')
        break
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    )
  }
}

function verifySignature(signature: string | null, body: string): boolean {
  // Implement signature verification using your webhook secret
  // Example using HMAC:
  const crypto = require('crypto')
  const secret = process.env.WEBHOOK_SECRET!
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return signature === expectedSignature
}
```

### Configuring Webhooks in CMS

1. Go to **Settings** → **Webhooks** in the CMS admin
2. Click **Add Webhook**
3. Enter your revalidation endpoint URL:
   ```
   https://your-frontend.com/api/revalidate
   ```
4. Select events: `page.created`, `page.updated`, `page.deleted`, `page.published`, `page.unpublished`
5. Save the webhook secret for signature verification

### Remix Revalidation

```typescript
// app/routes/api.revalidate.ts
import { json, type ActionArgs } from '@remix-run/node'

export async function action({ request }: ActionArgs) {
  const body = await request.json()
  const { event, data } = body

  // Trigger your cache invalidation logic
  // This depends on your caching strategy (Redis, CDN, etc.)

  switch (event) {
    case 'page.updated':
    case 'page.published':
      await invalidateCache(`page-${data.slug}`)
      break

    case 'page.deleted':
      await invalidateCache(`page-${data.slug}`)
      await invalidateCache('pages-list')
      break
  }

  return json({ success: true })
}
```

### Vercel Integration (ISR)

If using Vercel, you can use their deployment webhook to trigger full rebuilds:

```bash
# In your CMS webhook settings, add:
https://api.vercel.com/v1/integrations/deploy/[project-id]/[deploy-hook]
```

Or use on-demand ISR with the Next.js revalidation endpoint above.

## Block Types Reference

### Common Block Types

#### Hero Block
```typescript
{
  type: "hero",
  content: {
    heading: string
    subheading: string
    buttonText: string
    buttonLink: string
    backgroundImage: string
  }
}
```

#### Text Block
```typescript
{
  type: "text",
  content: {
    text: string // HTML content
    alignment: "left" | "center" | "right"
  }
}
```

#### Image Block
```typescript
{
  type: "image",
  content: {
    src: string
    alt: string
    width: string
    height: string
  }
}
```

#### Button Block
```typescript
{
  type: "button",
  content: {
    text: string
    link: string
    variant: "primary" | "secondary" | "outline"
  }
}
```

#### Container Block
```typescript
{
  type: "container",
  content: {
    children: Block[] // Nested blocks
  }
}
```

### Responsive Styles Structure

```typescript
{
  responsiveStyles: {
    padding: {
      desktop: "60px 20px",
      tablet: "40px 20px",
      mobile: "30px 15px"
    },
    fontSize: {
      desktop: "48px",
      tablet: "36px",
      mobile: "28px"
    },
    width: {
      desktop: "100%",
      tablet: "90%",
      mobile: "100%"
    }
  }
}
```

## Complete Examples

### Full Next.js Implementation

```typescript
// app/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageRenderer } from '@/components/PageRenderer'

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://your-store.frontspace.se'

async function getPage(slug: string) {
  const res = await fetch(`${STORE_URL}/api/pages/${slug}`, {
    next: {
      revalidate: 60,
      tags: [`page-${slug}`],
    },
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.page
}

async function getAllPages() {
  const res = await fetch(`${STORE_URL}/api/pages`, {
    next: {
      revalidate: 3600,
      tags: ['pages-list'],
    },
  })

  if (!res.ok) return []
  const data = await res.json()
  return data.pages
}

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page: any) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const page = await getPage(params.slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.og_title || page.meta_title || page.title,
      description: page.og_description || page.meta_description,
      images: page.og_image ? [{ url: page.og_image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.og_title || page.meta_title || page.title,
      description: page.og_description || page.meta_description,
      images: page.og_image ? [page.og_image] : [],
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)

  if (!page || page.status !== 'published') {
    notFound()
  }

  return (
    <main>
      <PageRenderer page={page} />
    </main>
  )
}
```

### Webhook Revalidation with Authentication

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!

function verifyWebhookSignature(
  signature: string | null,
  body: string
): boolean {
  if (!signature || !WEBHOOK_SECRET) return false

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature')

    // Verify webhook signature
    if (!verifyWebhookSignature(signature, body)) {
      console.error('[Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { event, data } = JSON.parse(body)

    console.log(`[Webhook] Received ${event} for page ${data.slug}`)

    // Handle different events
    switch (event) {
      case 'page.created':
      case 'page.updated':
      case 'page.published':
        // Revalidate specific page
        revalidateTag(`page-${data.slug}`)
        revalidatePath(`/${data.slug}`)

        // Revalidate pages list
        revalidateTag('pages-list')
        revalidatePath('/')

        console.log(`[Webhook] Revalidated page: ${data.slug}`)
        break

      case 'page.deleted':
      case 'page.unpublished':
        // Revalidate pages list
        revalidateTag('pages-list')
        revalidatePath('/')

        console.log(`[Webhook] Removed page from cache: ${data.slug}`)
        break

      default:
        console.warn(`[Webhook] Unknown event: ${event}`)
    }

    return NextResponse.json({
      revalidated: true,
      event,
      slug: data.slug,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Best Practices

1. **Caching Strategy**
   - Use aggressive caching with webhook-based revalidation
   - Set appropriate `revalidate` times as a fallback
   - Use cache tags for granular invalidation

2. **Error Handling**
   - Always handle 404s gracefully
   - Implement fallback UI for missing blocks
   - Log warnings for unknown block types

3. **Performance**
   - Generate static pages at build time when possible
   - Use ISR (Incremental Static Regeneration) for dynamic content
   - Optimize images using your framework's image optimization

4. **Security**
   - Always verify webhook signatures
   - Use environment variables for secrets
   - Implement rate limiting on webhook endpoints

5. **SEO**
   - Use proper meta tags from page data
   - Implement structured data when applicable
   - Generate sitemaps from the pages API

## Troubleshooting

### Pages not updating after webhook
- Check webhook signature verification
- Verify the revalidation endpoint is accessible
- Check Next.js logs for revalidation errors
- Ensure cache tags match between fetch and revalidation

### Unknown block types
- Update your block components registry
- Add fallback rendering for unknown types
- Check CMS for new block types

### Slow page loads
- Enable static generation where possible
- Optimize image loading
- Implement lazy loading for blocks
- Use CDN for static assets

## Additional Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Webhook Security Best Practices](https://webhooks.fyi/security/hmac)
