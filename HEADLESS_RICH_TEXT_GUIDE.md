# Rendering Rich Text Fields in Headless Frontspace

This guide explains how to render rich text fields from Frontspace CMS in your headless frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Understanding the Data Structure](#understanding-the-data-structure)
3. [Implementation Options](#implementation-options)
4. [Option 1: Tiptap React Renderer](#option-1-tiptap-react-renderer-recommended)
5. [Option 2: Manual HTML Conversion](#option-2-manual-html-conversion)
6. [Option 3: Vue/Nuxt with Tiptap](#option-3-vuenuxt-with-tiptap)
7. [Styling Rich Text](#styling-rich-text)
8. [Advanced Usage](#advanced-usage)
9. [Best Practices](#best-practices)

## Overview

Frontspace stores rich text content using the [Tiptap editor](https://tiptap.dev/), which uses a JSON-based format called ProseMirror JSON. This format is flexible, extensible, and framework-agnostic.

### Why Tiptap JSON?

- **Structured data**: Content is stored as structured JSON, not HTML strings
- **Extensible**: Easy to add custom nodes and marks
- **Framework-agnostic**: Can be rendered in React, Vue, Svelte, or converted to HTML
- **Type-safe**: Can be validated and type-checked
- **Version control friendly**: JSON diff is clearer than HTML diff

## Understanding the Data Structure

When you query a post with rich text fields via GraphQL, the content structure looks like this:

```json
{
  "post": {
    "id": "abc-123",
    "title": "My Blog Post",
    "content": {
      "body": {
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "This is a paragraph with "
              },
              {
                "type": "text",
                "marks": [{ "type": "bold" }],
                "text": "bold text"
              },
              {
                "type": "text",
                "text": " and "
              },
              {
                "type": "text",
                "marks": [{ "type": "italic" }],
                "text": "italic text"
              },
              {
                "type": "text",
                "text": "."
              }
            ]
          },
          {
            "type": "heading",
            "attrs": { "level": 2 },
            "content": [
              {
                "type": "text",
                "text": "A Heading"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "First item"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "Second item"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
```

### Common Node Types

- `paragraph` - Standard paragraph
- `heading` - Headings (h1-h6), level specified in `attrs`
- `bulletList` / `orderedList` - Lists
- `listItem` - List items
- `blockquote` - Block quotes
- `codeBlock` - Code blocks
- `image` - Images with src/alt in `attrs`
- `hardBreak` - Line breaks

### Common Marks (Text Formatting)

- `bold` - Bold text
- `italic` - Italic text
- `underline` - Underlined text
- `strike` - Strikethrough
- `code` - Inline code
- `link` - Links with href in `attrs`

## Implementation Options

There are three main ways to render Tiptap JSON in your frontend:

1. **Tiptap React Renderer** (Recommended) - Use Tiptap's official React components
2. **Manual HTML Conversion** - Convert JSON to HTML yourself
3. **Tiptap Vue Renderer** - For Vue/Nuxt applications

## Option 1: Tiptap React Renderer (Recommended)

This is the easiest and most reliable method for React applications.

### Installation

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

### Basic Component

Create a reusable component for rendering rich text:

```typescript
// components/RichTextRenderer.tsx
'use client' // For Next.js 13+ App Router

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

interface RichTextRendererProps {
  content: any // Tiptap JSON content
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: content,
    editable: false, // Important: Read-only mode
    editorProps: {
      attributes: {
        class: className || '',
      },
    },
  })

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}
```

### Usage Example

```typescript
// app/blog/[slug]/page.tsx
import { gql } from '@apollo/client'
import { client } from '@/lib/apollo-client'
import { RichTextRenderer } from '@/components/RichTextRenderer'

const GET_POST = gql`
  query GetPost($storeId: String!, $slug: String!) {
    post(storeId: $storeId, postTypeSlug: "blog", slug: $slug) {
      id
      title
      slug
      content
      published_at
    }
  }
`

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const { data } = await client.query({
    query: GET_POST,
    variables: {
      storeId: process.env.NEXT_PUBLIC_STORE_ID!,
      slug: params.slug,
    },
  })

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{data.post.title}</h1>

      <div className="prose prose-lg max-w-none">
        <RichTextRenderer content={data.post.content.body} />
      </div>
    </article>
  )
}
```

## Option 2: Manual HTML Conversion

If you prefer not to use Tiptap or need server-side HTML generation, you can convert the JSON manually.

### Converter Implementation

```typescript
// lib/tiptap-to-html.ts

export function tiptapToHtml(doc: any): string {
  if (!doc || !doc.content) return ''
  return renderContent(doc.content)
}

function renderContent(content: any[]): string {
  return content.map(node => renderNode(node)).join('')
}

function renderNode(node: any): string {
  switch (node.type) {
    case 'paragraph':
      return `<p>${renderContent(node.content || [])}</p>`

    case 'heading':
      const level = node.attrs?.level || 1
      return `<h${level}>${renderContent(node.content || [])}</h${level}>`

    case 'bulletList':
      return `<ul>${renderContent(node.content || [])}</ul>`

    case 'orderedList':
      return `<ol>${renderContent(node.content || [])}</ol>`

    case 'listItem':
      return `<li>${renderContent(node.content || [])}</li>`

    case 'blockquote':
      return `<blockquote>${renderContent(node.content || [])}</blockquote>`

    case 'codeBlock':
      const code = node.content?.[0]?.text || ''
      const language = node.attrs?.language || ''
      return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`

    case 'image':
      const src = node.attrs?.src || ''
      const alt = node.attrs?.alt || ''
      const title = node.attrs?.title || ''
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" ${title ? `title="${escapeHtml(title)}"` : ''} />`

    case 'hardBreak':
      return '<br />'

    case 'horizontalRule':
      return '<hr />'

    case 'text':
      let text = escapeHtml(node.text || '')

      // Apply marks in reverse order for proper nesting
      if (node.marks && node.marks.length > 0) {
        // Reverse to apply innermost mark first
        const marks = [...node.marks].reverse()

        marks.forEach((mark: any) => {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`
              break
            case 'italic':
              text = `<em>${text}</em>`
              break
            case 'underline':
              text = `<u>${text}</u>`
              break
            case 'strike':
              text = `<s>${text}</s>`
              break
            case 'code':
              text = `<code>${text}</code>`
              break
            case 'link':
              const href = escapeHtml(mark.attrs?.href || '#')
              const target = mark.attrs?.target || '_self'
              const rel = target === '_blank' ? ' rel="noopener noreferrer"' : ''
              text = `<a href="${href}" target="${target}"${rel}>${text}</a>`
              break
          }
        })
      }

      return text

    default:
      // Unknown node type - try to render content if it exists
      return node.content ? renderContent(node.content) : ''
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
```

### Usage with Server Components

```typescript
// app/blog/[slug]/page.tsx
import { tiptapToHtml } from '@/lib/tiptap-to-html'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data } = await fetchPost(params.slug)

  // Convert to HTML on server
  const htmlContent = tiptapToHtml(data.post.content.body)

  return (
    <article className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{data.post.title}</h1>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  )
}
```

### Benefits of Manual Conversion

- **No client-side JavaScript**: HTML is generated on the server
- **Better SEO**: Content is in HTML from the start
- **Faster initial load**: No JavaScript bundle needed
- **Works without JS**: Content visible even with JavaScript disabled

## Option 3: Vue/Nuxt with Tiptap

For Vue and Nuxt applications, use Tiptap's Vue renderer.

### Installation

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

### Component

```vue
<!-- components/RichTextRenderer.vue -->
<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const props = defineProps<{
  content: any
}>()

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: true,
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto',
      },
    }),
  ],
  content: props.content,
  editable: false,
})

// Cleanup on unmount
onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="rich-text-content">
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.rich-text-content {
  @apply prose prose-lg max-w-none;
}
</style>
```

### Usage in Nuxt

```vue
<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
import { useGraphQL } from '~/composables/useGraphQL'

const route = useRoute()
const { client } = useGraphQL()

const GET_POST = `
  query GetPost($storeId: String!, $slug: String!) {
    post(storeId: $storeId, postTypeSlug: "blog", slug: $slug) {
      id
      title
      content
      published_at
    }
  }
`

const { data } = await client.query(GET_POST, {
  storeId: import.meta.env.VITE_STORE_ID,
  slug: route.params.slug,
})

useHead({
  title: data.post.title,
})
</script>

<template>
  <article class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">{{ data.post.title }}</h1>
    <RichTextRenderer :content="data.post.content.body" />
  </article>
</template>
```

## Styling Rich Text

### Using Tailwind Typography

The easiest way to style rich text is with Tailwind's Typography plugin:

```bash
npm install -D @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### Basic Styling

```jsx
<div className="prose prose-lg max-w-none">
  <RichTextRenderer content={richTextContent} />
</div>
```

### Available Modifiers

**Size**:
- `prose-sm` - Small text
- `prose-base` - Default size
- `prose-lg` - Large text
- `prose-xl` - Extra large
- `prose-2xl` - 2X large

**Color Theme**:
- `prose-slate`
- `prose-gray`
- `prose-zinc`
- `prose-neutral`
- `prose-stone`

**Dark Mode**:
```jsx
<div className="prose prose-lg dark:prose-invert">
  <RichTextRenderer content={content} />
</div>
```

### Custom Styling

Override specific elements:

```css
.prose {
  --tw-prose-body: theme('colors.gray.700');
  --tw-prose-headings: theme('colors.gray.900');
  --tw-prose-links: theme('colors.blue.600');
  --tw-prose-code: theme('colors.pink.600');
}

.prose h1 {
  @apply text-5xl font-extrabold;
}

.prose a {
  @apply no-underline hover:underline;
}

.prose img {
  @apply rounded-lg shadow-lg;
}
```

## Advanced Usage

### Handling Multiple Rich Text Fields

Posts often have multiple rich text fields:

```typescript
const { data } = await client.query({
  query: GET_POST,
  variables: { storeId, slug },
})

// data.post.content might contain:
// - excerpt (rich text)
// - body (rich text)
// - author_bio (rich text)

return (
  <article>
    {/* Excerpt - smaller, gray */}
    <div className="prose prose-base text-gray-600 mb-8">
      <RichTextRenderer content={data.post.content.excerpt} />
    </div>

    {/* Main body - large, full styling */}
    <div className="prose prose-lg max-w-none">
      <RichTextRenderer content={data.post.content.body} />
    </div>

    {/* Author bio - small, minimal */}
    <div className="prose prose-sm mt-12">
      <RichTextRenderer content={data.post.content.author_bio} />
    </div>
  </article>
)
```

### Plain Text Extraction

Extract plain text for SEO meta descriptions or previews:

```typescript
// lib/tiptap-to-plaintext.ts
export function tiptapToPlainText(doc: any): string {
  if (!doc || !doc.content) return ''
  return extractText(doc.content)
}

function extractText(content: any[]): string {
  return content.map(node => {
    if (node.type === 'text') {
      return node.text || ''
    }
    if (node.content) {
      return extractText(node.content)
    }
    return ''
  }).join(' ')
}

// Trim and create excerpt
export function createExcerpt(doc: any, maxLength: number = 160): string {
  const plainText = tiptapToPlainText(doc)
  if (plainText.length <= maxLength) {
    return plainText
  }
  return plainText.substring(0, maxLength).trim() + '...'
}
```

Usage for SEO:

```typescript
import { createExcerpt } from '@/lib/tiptap-to-plaintext'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data } = await fetchPost(params.slug)

  return {
    title: data.post.title,
    description: createExcerpt(data.post.content.body, 160),
  }
}
```

### Checking for Empty Content

```typescript
export function isRichTextEmpty(doc: any): boolean {
  if (!doc || !doc.content || doc.content.length === 0) {
    return true
  }

  // Check if all nodes are empty
  return doc.content.every((node: any) => {
    if (node.type === 'paragraph' && (!node.content || node.content.length === 0)) {
      return true
    }
    if (node.type === 'text' && (!node.text || node.text.trim() === '')) {
      return true
    }
    return false
  })
}
```

Usage:

```tsx
{!isRichTextEmpty(post.content.excerpt) && (
  <div className="excerpt">
    <RichTextRenderer content={post.content.excerpt} />
  </div>
)}
```

### Custom Node Rendering

If you need custom rendering for specific node types:

```typescript
function renderNode(node: any): string {
  switch (node.type) {
    // ... standard cases ...

    case 'customCallout':
      const type = node.attrs?.type || 'info'
      return `
        <div class="callout callout-${type}">
          ${renderContent(node.content || [])}
        </div>
      `

    case 'customVideo':
      const videoUrl = node.attrs?.url || ''
      return `
        <div class="video-wrapper">
          <iframe src="${escapeHtml(videoUrl)}" frameborder="0" allowfullscreen></iframe>
        </div>
      `

    default:
      return node.content ? renderContent(node.content) : ''
  }
}
```

## Best Practices

### 1. Always Escape HTML

When manually converting to HTML, always escape user content:

```typescript
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
```

### 2. Handle Missing Content Gracefully

```typescript
export function RichTextRenderer({ content }: { content: any }) {
  // Handle null/undefined content
  if (!content) {
    return null
  }

  // Handle empty content
  if (isRichTextEmpty(content)) {
    return null
  }

  // Render content
  // ...
}
```

### 3. Use Memoization

For client-side rendering, memoize the converted HTML:

```typescript
import { useMemo } from 'react'

export function RichTextRenderer({ content }: { content: any }) {
  const html = useMemo(() => tiptapToHtml(content), [content])

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
```

### 4. Optimize Images

If your rich text includes images, optimize them:

```typescript
case 'image':
  const src = node.attrs?.src || ''
  const alt = node.attrs?.alt || ''

  // Use Next.js Image component
  return `
    <img
      src="${src}"
      alt="${escapeHtml(alt)}"
      loading="lazy"
      decoding="async"
    />
  `
```

### 5. Server-Side Rendering

For better performance and SEO, render HTML on the server:

```typescript
// Server Component (Next.js App Router)
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  const html = tiptapToHtml(post.content.body) // Server-side conversion

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
```

Benefits:
- No client-side JavaScript needed
- Faster initial page load
- Better SEO
- Works without JavaScript

### 6. Type Safety

Define TypeScript types for your content:

```typescript
interface TiptapDoc {
  type: 'doc'
  content?: TiptapNode[]
}

interface TiptapNode {
  type: string
  attrs?: Record<string, any>
  content?: TiptapNode[]
  marks?: TiptapMark[]
  text?: string
}

interface TiptapMark {
  type: string
  attrs?: Record<string, any>
}

export function tiptapToHtml(doc: TiptapDoc): string {
  // Now type-safe!
}
```

### 7. Error Handling

Wrap rendering in error boundaries:

```typescript
'use client'

import { ErrorBoundary } from 'react-error-boundary'

export function SafeRichTextRenderer({ content }: { content: any }) {
  return (
    <ErrorBoundary fallback={<div>Failed to render content</div>}>
      <RichTextRenderer content={content} />
    </ErrorBoundary>
  )
}
```

## Performance Comparison

| Method | Bundle Size | Initial Load | SEO | No-JS Support |
|--------|-------------|--------------|-----|---------------|
| Tiptap React | ~50KB | Slower | Good | No |
| Manual HTML | 0KB | Fastest | Excellent | Yes |
| Tiptap Vue | ~50KB | Slower | Good | No |

**Recommendation**: Use manual HTML conversion for server-side rendering and best performance. Use Tiptap renderer for client-side rendering with interactive features.

## Need Help?

- Check [Tiptap Documentation](https://tiptap.dev/) for advanced features
- See [HEADLESS_GRAPHQL_GUIDE.md](./HEADLESS_GRAPHQL_GUIDE.md) for GraphQL queries
- Contact support if you encounter issues
