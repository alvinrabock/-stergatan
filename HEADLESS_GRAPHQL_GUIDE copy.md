# Headless GraphQL API Guide

This guide explains how to use the **actual GraphQL API** to fetch data from your Frontspace CMS in a headless frontend application.

## Table of Contents

1. [Overview](#overview)
2. [GraphQL Endpoint](#graphql-endpoint)
3. [Authentication](#authentication)
4. [Schema Overview](#schema-overview)
5. [Queries](#queries)
6. [Mutations](#mutations)
7. [Client Setup](#client-setup)
8. [Complete Examples](#complete-examples)
9. [Webhook Integration](#webhook-integration)
10. [Best Practices](#best-practices)

## Overview

The Frontspace CMS provides a GraphQL API for:
- Fetching pages with blocks and page settings
- Querying posts (custom post types)
- Accessing headers and footers
- Retrieving menus with hierarchical structure
- Fetching forms and submitting form data
- Getting store settings

### Benefits of GraphQL

- **Fetch exactly what you need** - Request only the fields you want
- **Single endpoint** - All data accessible from one URL
- **Strongly typed** - Built-in schema validation and documentation
- **Nested queries** - Fetch related data in a single request

## GraphQL Endpoint

### Base URL
```
https://your-domain.com/api/graphql
```

### HTTP Method
```
POST /api/graphql
```

### Required Headers
```http
Content-Type: application/json
x-store-id: your-store-id-uuid
Authorization: Bearer your-api-key
```

## Authentication

### API Key Setup

1. Go to your store settings in the admin dashboard
2. Enable **Headless Mode**
3. Generate an **API Key**
4. Use the API key in the Authorization header

### Example Request Headers
```javascript
const headers = {
  'Content-Type': 'application/json',
  'x-store-id': 'abc123-store-id',
  'Authorization': 'Bearer sk_live_abc123...'
}
```

**Important**: Both the `x-store-id` header and `Authorization` header with API key are **required** for all requests.

## Schema Overview

### Core Types

```graphql
type Query {
  # Pages
  pages(storeId: String!): [Page!]!
  page(storeId: String!, slug: String!): Page
  pageById(storeId: String!, id: String!): Page

  # Headers & Footers
  header(storeId: String!): Header
  footer(storeId: String!): Footer

  # Posts (Custom Post Types)
  posts(storeId: String!, postTypeSlug: String, postTypeId: String): [Post!]!
  post(storeId: String!, postTypeSlug: String, postTypeId: String, slug: String!): Post
  postById(storeId: String!, id: String!): Post

  # Menus
  menus(storeId: String!): [Menu!]!
  menu(storeId: String!, id: String!): Menu
  menuBySlug(storeId: String!, slug: String!): Menu
  menuItems(storeId: String!, menuId: String!): [MenuItem!]!

  # Forms
  forms(storeId: String!): [Form!]!
  form(storeId: String!, id: String!): Form

  # Store Settings
  storeSettings(storeId: String!): StoreSettings
}

type Page {
  id: ID!
  title: String!
  slug: String!
  content: PageContent!
  status: String!
  created_at: String!
  updated_at: String!
  published_at: String
}

type PageContent {
  blocks: [Block!]!
  pageSettings: PageSettings
}

type Block {
  id: String!
  type: String!
  content: JSON
  styles: JSON
  responsiveStyles: JSON
}

type PageSettings {
  seoTitle: String
  seoDescription: String
  ogImage: String
}

type Post {
  id: ID!
  title: String!
  slug: String!
  content: JSON!
  postType: PostType!
  status: String!
  sort_order: Int!
  store_id: String!
  store: Store
  created_at: String!
  updated_at: String!
  published_at: String
  scheduled_publish_at: String
  scope: String!
  shared_store_ids: [String!]!

  # Generic relation field resolvers
  relatedPost(fieldSlug: String!): Post
  relatedPosts(fieldSlug: String!): [Post!]
  relation(field: String!): RelationResult
}

type PostType {
  id: ID!
  name: String!
  slug: String!
  icon: String
  scheduling_enabled: Boolean
  has_archive: Boolean
  store_id: String
  enable_sharing: Boolean
  shared_store_ids: [String!]
}

type Store {
  id: ID!
  name: String!
  domain: String
}

union RelationResult = SingleRelation | MultipleRelations

type SingleRelation {
  post: Post
}

type MultipleRelations {
  posts: [Post!]!
}

type Header {
  id: ID!
  name: String!
  content: GlobalContent!
  headerSettings: HeaderSettings
  conditions: GlobalConditions
}

type Footer {
  id: ID!
  name: String!
  content: GlobalContent!
  conditions: GlobalConditions
}

type GlobalContent {
  blocks: [Block!]!
}

type HeaderSettings {
  position: String
  background: String
  shadow: Boolean
  colorOnScroll: String
  backgroundColorOnScroll: String
  logoOnScroll: String
  logoMode: String
}

type GlobalConditions {
  visibility: String
  pages: [String!]
  pageTypes: [String!]
  devices: [String!]
}

type Menu {
  id: ID!
  name: String!
  slug: String!
  store_id: String!
  created_at: String!
  updated_at: String
  items: [MenuItem!]!
}

type MenuItem {
  id: ID!
  menu_id: String!
  title: String!
  link_type: String!
  url: String
  slug: String
  page_id: String
  page: Page
  target: String
  css_class: String
  parent_id: String
  sort_order: Int!
  is_active: Boolean!
  created_at: String!
  children: [MenuItem!]!
}

type Form {
  id: ID!
  name: String!
  status: String!
  fields: [FormField!]!
  email_settings: FormEmailSettings
  created_at: String!
  updated_at: String
}

type FormField {
  name: String!
  label: String!
  type: String!
  required: Boolean!
  placeholder: String
  options: [String!]
}

type FormEmailSettings {
  send_to_type: String
  to_email: String
  form_email_field: String
  subject: String
  send_confirmation_to_user: Boolean
  confirmation_subject: String
  confirmation_title: String
  confirmation_message: String
}

type StoreSettings {
  id: ID!
  name: String!
  domain: String
  favicon: String
}

scalar JSON
```

### Mutations

```graphql
type Mutation {
  submitForm(
    storeId: String!
    formId: String!
    formData: JSON!
    userAgent: String
    ipAddress: String
  ): FormSubmissionResponse!
}

type FormSubmissionResponse {
  success: Boolean!
  message: String!
}
```

## Queries

### Fetching Pages

#### Get All Published Pages
```graphql
query GetPages($storeId: String!) {
  pages(storeId: $storeId) {
    id
    title
    slug
    status
    created_at
    updated_at
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
```

Variables:
```json
{
  "storeId": "your-store-id"
}
```

#### Get Single Page by Slug
```graphql
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
  }
}
```

Variables:
```json
{
  "storeId": "your-store-id",
  "slug": "about"
}
```

### Fetching Posts (Custom Post Types)

#### Get All Posts for a Post Type
```graphql
query GetPosts($storeId: String!, $postTypeSlug: String!) {
  posts(storeId: $storeId, postTypeSlug: $postTypeSlug) {
    id
    title
    slug
    content
    status
    created_at
    postType {
      id
      name
      slug
      icon
    }
  }
}
```

Variables:
```json
{
  "storeId": "your-store-id",
  "postTypeSlug": "blog-posts"
}
```

#### Get Single Post by Slug
```graphql
query GetPost($storeId: String!, $postTypeSlug: String!, $slug: String!) {
  post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
    id
    title
    slug
    content
    created_at
    updated_at
    postType {
      id
      name
      slug
    }
  }
}
```

#### Get Post with Relations Populated
```graphql
query GetPostById($storeId: String!, $id: String!) {
  postById(storeId: $storeId, id: $id) {
    id
    title
    slug
    content  # Relations are populated in content field
    postType {
      name
      slug
    }
  }
}
```

**Note**: `postById` automatically populates all relation fields in the content, while `post` and `posts` return raw UUIDs.

#### Using Dynamic Relation Fields
```graphql
query GetPostWithRelations($storeId: String!, $postTypeSlug: String!, $slug: String!) {
  post(storeId: $storeId, postTypeSlug: $postTypeSlug, slug: $slug) {
    id
    title
    slug

    # Use the generic relation resolver
    relation(field: "author") {
      ... on SingleRelation {
        post {
          id
          title
          slug
        }
      }
      ... on MultipleRelations {
        posts {
          id
          title
          slug
        }
      }
    }

    # Or use specific field resolvers
    relatedPost(fieldSlug: "author") {
      id
      title
      slug
    }

    relatedPosts(fieldSlug: "categories") {
      id
      title
      slug
    }
  }
}
```

### Fetching Headers and Footers

#### Get Header
```graphql
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
```

#### Get Footer
```graphql
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
    conditions {
      visibility
      pages
      pageTypes
      devices
    }
  }
}
```

### Fetching Menus

#### Get All Menus
```graphql
query GetMenus($storeId: String!) {
  menus(storeId: $storeId) {
    id
    name
    slug
    items {
      id
      title
      link_type
      url
      slug
      target
      css_class
      page {
        id
        slug
        title
      }
      children {
        id
        title
        link_type
        url
        slug
        target
        children {
          id
          title
          link_type
          url
        }
      }
    }
  }
}
```

#### Get Menu by Slug
```graphql
query GetMenuBySlug($storeId: String!, $slug: String!) {
  menuBySlug(storeId: $storeId, slug: $slug) {
    id
    name
    slug
    items {
      id
      title
      link_type
      url
      slug
      page {
        id
        slug
        title
      }
      children {
        id
        title
        link_type
        url
        slug
      }
    }
  }
}
```

### Fetching Forms

#### Get All Forms
```graphql
query GetForms($storeId: String!) {
  forms(storeId: $storeId) {
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
      subject
      send_confirmation_to_user
      confirmation_subject
      confirmation_message
    }
  }
}
```

#### Get Single Form
```graphql
query GetForm($storeId: String!, $id: String!) {
  form(storeId: $storeId, id: $id) {
    id
    name
    fields {
      name
      label
      type
      required
      placeholder
      options
    }
  }
}
```

### Fetching Store Settings

```graphql
query GetStoreSettings($storeId: String!) {
  storeSettings(storeId: $storeId) {
    id
    name
    domain
    favicon
  }
}
```

## Mutations

### Submit Form

```graphql
mutation SubmitForm(
  $storeId: String!
  $formId: String!
  $formData: JSON!
  $userAgent: String
  $ipAddress: String
) {
  submitForm(
    storeId: $storeId
    formId: $formId
    formData: $formData
    userAgent: $userAgent
    ipAddress: $ipAddress
  ) {
    success
    message
  }
}
```

Variables:
```json
{
  "storeId": "your-store-id",
  "formId": "form-id",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  },
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

## Client Setup

### Apollo Client (React)

```bash
npm install @apollo/client graphql
```

```javascript
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'https://your-domain.com/api/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-store-id': 'your-store-id',
      'Authorization': 'Bearer your-api-key',
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <YourApp />
    </ApolloProvider>
  )
}
```

### URQL (React/Vue/Svelte)

```bash
npm install @urql/core graphql
```

```javascript
import { createClient } from '@urql/core'

const client = createClient({
  url: 'https://your-domain.com/api/graphql',
  fetchOptions: () => {
    return {
      headers: {
        'x-store-id': 'your-store-id',
        'Authorization': 'Bearer your-api-key',
      },
    }
  },
})
```

### graphql-request (Lightweight)

```bash
npm install graphql-request graphql
```

```javascript
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('https://your-domain.com/api/graphql', {
  headers: {
    'x-store-id': 'your-store-id',
    'Authorization': 'Bearer your-api-key',
  },
})

// Usage
const query = `
  query GetPages($storeId: String!) {
    pages(storeId: $storeId) {
      id
      title
      slug
    }
  }
`

const data = await client.request(query, { storeId: 'your-store-id' })
```

### Vanilla Fetch

```javascript
async function fetchGraphQL(query, variables = {}) {
  const response = await fetch('https://your-domain.com/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-store-id': 'your-store-id',
      'Authorization': 'Bearer your-api-key',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await response.json()

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors)
    throw new Error(json.errors[0].message)
  }

  return json.data
}

// Usage
const data = await fetchGraphQL(`
  query GetPage($storeId: String!, $slug: String!) {
    page(storeId: $storeId, slug: $slug) {
      title
      content {
        blocks {
          id
          type
          content
        }
      }
    }
  }
`, {
  storeId: 'your-store-id',
  slug: 'about'
})
```

## Complete Examples

### Next.js with Apollo Client

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-store-id': process.env.NEXT_PUBLIC_STORE_ID!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

// app/[slug]/page.tsx
import { gql } from '@apollo/client'
import { client } from '@/lib/apollo-client'
import { BlockRenderer } from '@/components/BlockRenderer'

const GET_PAGE = gql`
  query GetPage($storeId: String!, $slug: String!) {
    page(storeId: $storeId, slug: $slug) {
      id
      title
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
`

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data } = await client.query({
    query: GET_PAGE,
    variables: {
      storeId: process.env.NEXT_PUBLIC_STORE_ID!,
      slug: params.slug,
    },
  })

  return {
    title: data.page.content.pageSettings?.seoTitle || data.page.title,
    description: data.page.content.pageSettings?.seoDescription,
    openGraph: {
      title: data.page.content.pageSettings?.seoTitle || data.page.title,
      description: data.page.content.pageSettings?.seoDescription,
      images: data.page.content.pageSettings?.ogImage ? [data.page.content.pageSettings.ogImage] : [],
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { data } = await client.query({
    query: GET_PAGE,
    variables: {
      storeId: process.env.NEXT_PUBLIC_STORE_ID!,
      slug: params.slug,
    },
  })

  return (
    <div>
      <h1>{data.page.title}</h1>
      {data.page.content.blocks.map((block: any) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
```

### Remix with graphql-request

```typescript
// app/lib/graphql.server.ts
import { GraphQLClient } from 'graphql-request'

export const graphqlClient = new GraphQLClient(
  process.env.GRAPHQL_URL!,
  {
    headers: {
      'x-store-id': process.env.STORE_ID!,
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
  }
)

// app/routes/$slug.tsx
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { graphqlClient } from '~/lib/graphql.server'
import { gql } from 'graphql-request'

const GET_PAGE = gql`
  query GetPage($storeId: String!, $slug: String!) {
    page(storeId: $storeId, slug: $slug) {
      id
      title
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
`

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const data = await graphqlClient.request(GET_PAGE, {
    storeId: process.env.STORE_ID!,
    slug: params.slug,
  })

  return json(data)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.page.content.pageSettings?.seoTitle || data.page.title },
    {
      name: 'description',
      content: data.page.content.pageSettings?.seoDescription,
    },
    {
      property: 'og:image',
      content: data.page.content.pageSettings?.ogImage,
    },
  ]
}

export default function PageRoute() {
  const { page } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{page.title}</h1>
      {page.content.blocks.map((block: any) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
```

### Vue/Nuxt with URQL

```vue
<!-- composables/useGraphQL.ts -->
<script setup lang="ts">
import { createClient, fetchExchange } from '@urql/core'

const client = createClient({
  url: import.meta.env.VITE_GRAPHQL_URL,
  exchanges: [fetchExchange],
  fetchOptions: () => ({
    headers: {
      'x-store-id': import.meta.env.VITE_STORE_ID,
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
  }),
})

export function useGraphQL() {
  return { client }
}
</script>

<!-- pages/[slug].vue -->
<script setup lang="ts">
import { useGraphQL } from '~/composables/useGraphQL'
import { gql } from '@urql/core'

const route = useRoute()
const { client } = useGraphQL()

const GET_PAGE = gql`
  query GetPage($storeId: String!, $slug: String!) {
    page(storeId: $storeId, slug: $slug) {
      id
      title
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
        }
      }
    }
  }
`

const { data } = await client.query(GET_PAGE, {
  storeId: import.meta.env.VITE_STORE_ID,
  slug: route.params.slug,
})

useHead({
  title: data.page.content.pageSettings?.seoTitle || data.page.title,
  meta: [
    { name: 'description', content: data.page.content.pageSettings?.seoDescription },
  ],
})
</script>

<template>
  <div>
    <h1>{{ data.page.title }}</h1>
    <BlockRenderer
      v-for="block in data.page.content.blocks"
      :key="block.id"
      :block="block"
    />
  </div>
</template>
```

## Webhook Integration

Set up webhooks to invalidate your frontend cache when content changes:

### Next.js ISR Revalidation

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Verify webhook signature (recommended in production)
  const signature = request.headers.get('x-webhook-signature')
  // ... verify signature ...

  if (body.type === 'page.updated' || body.type === 'page.created') {
    const slug = body.data.slug
    revalidatePath(`/${slug}`)
    return NextResponse.json({ revalidated: true, path: `/${slug}` })
  }

  if (body.type === 'page.deleted') {
    // Clear all pages
    revalidatePath('/')
    return NextResponse.json({ revalidated: true })
  }

  return NextResponse.json({ message: 'No revalidation needed' })
}
```

### Remix Resource Route

```typescript
// app/routes/api.revalidate.tsx
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { clearCache } from '~/lib/cache.server'

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json()

  if (body.type === 'page.updated') {
    await clearCache(`page:${body.data.slug}`)
    return json({ cleared: true })
  }

  return json({ message: 'No cache clear needed' })
}
```

## Best Practices

### 1. Use Fragments for Reusable Fields

```graphql
fragment PageFields on Page {
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
}

query GetPage($storeId: String!, $slug: String!) {
  page(storeId: $storeId, slug: $slug) {
    ...PageFields
  }
}
```

### 2. Request Only What You Need

❌ **Don't fetch all fields:**
```graphql
query {
  pages(storeId: "abc") {
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
    created_at
    updated_at
  }
}
```

✅ **Fetch only what you use:**
```graphql
query {
  pages(storeId: "abc") {
    slug
    title
  }
}
```

### 3. Use Variables Instead of String Interpolation

❌ **Don't interpolate:**
```javascript
const query = `
  query {
    page(storeId: "${storeId}", slug: "${slug}") {
      title
    }
  }
`
```

✅ **Use variables:**
```javascript
const query = `
  query GetPage($storeId: String!, $slug: String!) {
    page(storeId: $storeId, slug: $slug) {
      title
    }
  }
`
const variables = { storeId, slug }
```

### 4. Handle Errors Properly

```javascript
try {
  const data = await client.request(query, variables)
  return data
} catch (error) {
  if (error.response?.errors) {
    console.error('GraphQL Errors:', error.response.errors)
    // Handle specific error types
    error.response.errors.forEach(err => {
      if (err.message.includes('not found')) {
        // Handle 404
      } else if (err.message.includes('unauthorized')) {
        // Handle auth error
      }
    })
  }
  throw error
}
```

### 5. Implement Caching

```javascript
// Next.js with fetch cache
const data = await fetch('https://your-domain.com/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-store-id': storeId,
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ query, variables }),
  next: { revalidate: 3600 }, // Cache for 1 hour
})
```

### 6. Use TypeScript for Type Safety

Generate types from your GraphQL schema:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
```

```yaml
# codegen.yml
schema: https://your-domain.com/api/graphql
documents: './src/**/*.graphql'
generates:
  ./src/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
```

Then use generated types:

```typescript
import { GetPageQuery, GetPageQueryVariables } from '@/generated/graphql'

const data: GetPageQuery = await client.request(GET_PAGE, variables)
```

## Troubleshooting

### Error: "x-store-id header is required"

Make sure you're sending the `x-store-id` header in all requests:

```javascript
headers: {
  'x-store-id': 'your-store-id-uuid'
}
```

### Error: "Authorization header with Bearer token is required"

Make sure you're sending the API key:

```javascript
headers: {
  'Authorization': 'Bearer your-api-key'
}
```

### Error: "Headless mode is not enabled for this store"

1. Go to store settings in the admin dashboard
2. Enable "Headless Mode"
3. Generate an API key

### Error: "Invalid API key"

1. Verify the API key is correct
2. Make sure you're using the correct store ID
3. Regenerate the API key if needed

### Query returns null or empty

1. Check that content is published (status = 'published')
2. Verify the slug/id is correct
3. Make sure the store ID matches

## Need Help?

- Check the GraphQL Playground at `https://your-domain.com/api/graphql` for interactive documentation
- Review error messages in the response for specific issues
- Contact support if you encounter persistent issues
