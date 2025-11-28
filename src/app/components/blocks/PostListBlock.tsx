/**
 * Post List Block - Displays a list of posts from any custom post type
 * Fetches posts on the server side from Frontspace CMS and renders them based on configuration
 */

import React from 'react'
import Link from 'next/link'
import { getClientSafe } from '@/lib/get-client-safe'

interface Post {
  id: string
  title: string
  slug: string
  published_at?: string
  sort_order?: number
  content?: Record<string, any>
}

interface PostListBlockProps {
  block: {
    id: string
    content: {
      postTypeSlug: string
      urlPattern: string
      layout?: 'list' | 'grid' | 'cards'
      limit?: number
      displayFields?: Record<string, boolean>
    }
    styles?: Record<string, any>
  }
  blockId: string
}

function generateUrl(slug: string, urlPattern: string) {
  return urlPattern.replace('{slug}', slug).replace('{id}', slug)
}

function renderCustomField(post: Post, fieldKey: string, displayFields: Record<string, boolean>) {
  // Skip standard fields
  const standardFields = ['title', 'excerpt', 'featured_image', 'published_at']
  if (standardFields.includes(fieldKey)) {
    return null
  }

  // Only display if enabled and has value
  if (displayFields[fieldKey] && post.content?.[fieldKey]) {
    const value = post.content[fieldKey]
    const label = fieldKey.replace(/_/g, ' ')

    return (
      <div key={fieldKey} className="text-sm mb-1">
        <span className="font-medium capitalize">{label}: </span>
        {typeof value === 'object' ? JSON.stringify(value) : value}
      </div>
    )
  }

  return null
}

export async function PostListBlock({ block, blockId }: PostListBlockProps) {
  const {
    postTypeSlug,
    urlPattern,
    layout = 'grid',
    limit = 12,
    displayFields = {
      title: true,
      excerpt: false,
      featured_image: true,
      published_at: true
    }
  } = block.content

  let posts: Post[] = []
  let error: string | null = null

  try {
    // Use safe client that detects tenant at runtime
    const client = await getClientSafe()

    // Get storeId from the client instance
    const storeId = client.storeId

    const data = await client.query<{ posts: Post[] }>(`
      query GetPosts($storeId: String!, $postTypeSlug: String!) {
        posts(storeId: $storeId, postTypeSlug: $postTypeSlug) {
          id
          title
          slug
          published_at
          sort_order
          content
        }
      }
    `, {
      storeId,
      postTypeSlug
    })

    // Apply limit
    posts = (data.posts || []).slice(0, limit)
  } catch (err) {
    console.error('Error fetching posts:', err)
    error = 'Failed to load posts.'
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600" data-block-id={blockId}>
        <p>{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-8 text-center text-gray-600" data-block-id={blockId}>
        <p>No posts found</p>
      </div>
    )
  }

  const containerClass = layout === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'space-y-4'

  // Remove padding from block styles
  const { padding: _padding, ...stylesWithoutPadding } = block.styles || {}

  return (
    <div
      className={`post-list-block block-${blockId} ${containerClass}`}
      data-block-id={blockId}
      style={stylesWithoutPadding}
    >
      {posts.map((post) => {
        // Extract excerpt and featured_image from content field
        const excerpt = post.content?.excerpt || post.content?.beskrivning || post.content?.description
        const featuredImage = post.content?.featured_image || post.content?.omslagsbild || post.content?.image
        const imageUrl = typeof featuredImage === 'string' ? featuredImage : featuredImage?.url

        return (
          <Link
            key={post.id}
            href={generateUrl(post.slug, urlPattern)}
            className={`block hover:opacity-80 transition-opacity underline ${
              layout === 'cards' ? 'border border-gray-200 rounded-lg p-4 hover:shadow-lg' : ''
            }`}
          >
            {displayFields.featured_image && imageUrl && (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}

            {displayFields.title !== false && (
              <p className="text-lg mb-2">{post.title}</p>
            )}

            {displayFields.excerpt && excerpt && (
              <p className="text-gray-600 text-sm mb-2">{excerpt}</p>
            )}

            {/* Render custom fields */}
            {post.content && Object.keys(displayFields).map((fieldKey) =>
              renderCustomField(post, fieldKey, displayFields)
            )}

            {displayFields.published_at && post.published_at && (
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export default PostListBlock
