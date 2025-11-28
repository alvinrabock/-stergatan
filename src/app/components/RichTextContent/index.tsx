'use client'

import React from 'react'
import { GalleryBlock } from '../GalleryBlock'

interface TiptapMark {
  type: string
  attrs?: Record<string, any>
}

interface TiptapNode {
  type: string
  attrs?: Record<string, any>
  content?: TiptapNode[]
  marks?: TiptapMark[]
  text?: string
}

interface TiptapDoc {
  type: 'doc'
  content?: TiptapNode[]
}

interface RichTextContentProps {
  content: string | TiptapDoc | Record<string, unknown>
  className?: string
}

/**
 * Check if content is Tiptap JSON format
 */
function isTiptapJson(content: string | TiptapDoc | Record<string, unknown>): boolean {
  if (typeof content === 'object' && content !== null && 'type' in content && content.type === 'doc') {
    return true
  }
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content)
      return parsed && parsed.type === 'doc'
    } catch {
      return false
    }
  }
  return false
}

/**
 * Parse Tiptap JSON string to object
 */
function parseTiptapContent(content: string | TiptapDoc | Record<string, unknown>): TiptapDoc | null {
  if (typeof content === 'object' && content !== null) {
    if ('type' in content && content.type === 'doc') {
      return content as TiptapDoc
    }
    return null
  }
  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * Extract YouTube video ID from URL
 */
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  return match ? match[1] : null
}

/**
 * Render text with marks (bold, italic, links, etc.)
 */
function renderTextWithMarks(text: string, marks?: TiptapMark[], key?: string): React.ReactNode {
  if (!marks || marks.length === 0) {
    return text
  }

  let result: React.ReactNode = text

  // Apply marks in order
  marks.forEach((mark, index) => {
    switch (mark.type) {
      case 'bold':
        result = <strong key={`${key}-bold-${index}`}>{result}</strong>
        break
      case 'italic':
        result = <em key={`${key}-italic-${index}`}>{result}</em>
        break
      case 'underline':
        result = <u key={`${key}-underline-${index}`}>{result}</u>
        break
      case 'strike':
        result = <s key={`${key}-strike-${index}`}>{result}</s>
        break
      case 'code':
        result = <code key={`${key}-code-${index}`} className="bg-gray-800 px-1 rounded">{result}</code>
        break
      case 'link':
        result = (
          <a
            key={`${key}-link-${index}`}
            href={mark.attrs?.href || '#'}
            target={mark.attrs?.target || '_blank'}
            rel={mark.attrs?.rel || 'noopener noreferrer'}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {result}
          </a>
        )
        break
    }
  })

  return result
}

/**
 * Render a single Tiptap node
 */
function renderNode(node: TiptapNode, index: number): React.ReactNode {
  const key = `node-${index}`

  switch (node.type) {
    case 'text':
      return renderTextWithMarks(node.text || '', node.marks, key)

    case 'paragraph':
      return (
        <p key={key} className="mb-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </p>
      )

    case 'heading':
      const level = node.attrs?.level || 1
      const headingClasses: Record<number, string> = {
        1: 'text-4xl font-bold mb-4 mt-6',
        2: 'text-3xl font-bold mb-3 mt-5',
        3: 'text-2xl font-bold mb-3 mt-4',
        4: 'text-xl font-bold mb-2 mt-3',
        5: 'text-lg font-bold mb-2 mt-3',
        6: 'text-base font-bold mb-2 mt-2',
      }
      const headingContent = node.content?.map((child, i) => renderNode(child, i))
      const headingClassName = headingClasses[level] || ''
      if (level === 1) return <h1 key={key} className={headingClassName}>{headingContent}</h1>
      if (level === 2) return <h2 key={key} className={headingClassName}>{headingContent}</h2>
      if (level === 3) return <h3 key={key} className={headingClassName}>{headingContent}</h3>
      if (level === 4) return <h4 key={key} className={headingClassName}>{headingContent}</h4>
      if (level === 5) return <h5 key={key} className={headingClassName}>{headingContent}</h5>
      return <h6 key={key} className={headingClassName}>{headingContent}</h6>

    case 'bulletList':
      return (
        <ul key={key} className="list-disc list-inside mb-4 ml-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case 'orderedList':
      return (
        <ol key={key} className="list-decimal list-inside mb-4 ml-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      )

    case 'listItem':
      return (
        <li key={key} className="mb-1">
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-gray-500 pl-4 italic mb-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case 'codeBlock':
      return (
        <pre key={key} className="bg-gray-800 p-4 rounded mb-4 overflow-x-auto">
          <code>
            {node.content?.map((child, i) => renderNode(child, i))}
          </code>
        </pre>
      )

    case 'hardBreak':
      return <br key={key} />

    case 'horizontalRule':
      return <hr key={key} className="my-8 border-gray-600" />

    case 'image':
      return (
        <img
          key={key}
          src={node.attrs?.src || ''}
          alt={node.attrs?.alt || ''}
          title={node.attrs?.title || ''}
          className="max-w-full h-auto rounded-lg my-4"
          loading="lazy"
        />
      )

    case 'videoBlock':
      const videoId = getYouTubeVideoId(node.attrs?.url || '')
      if (videoId) {
        return (
          <div key={key} className="relative pb-[56.25%] w-full mb-6">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              loading="lazy"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        )
      }
      return null

    case 'galleryBlock':
      const images = node.attrs?.images || []
      const displayMode = node.attrs?.displayMode || 'grid'
      return (
        <GalleryBlock
          key={key}
          images={images}
          displayMode={displayMode}
        />
      )

    default:
      // For unknown node types, try to render content if it exists
      if (node.content) {
        return (
          <div key={key}>
            {node.content.map((child, i) => renderNode(child, i))}
          </div>
        )
      }
      return null
  }
}

/**
 * RichTextContent component that renders Tiptap JSON content
 * with support for custom blocks like gallery and video
 */
export function RichTextContent({ content, className }: RichTextContentProps) {
  // Check if content is empty
  if (!content) {
    return null
  }

  // If content is Tiptap JSON, parse and render it
  if (isTiptapJson(content)) {
    const doc = parseTiptapContent(content)
    if (!doc || !doc.content) {
      return null
    }

    return (
      <div className={className}>
        {doc.content.map((node, index) => renderNode(node, index))}
      </div>
    )
  }

  // If content is a string (HTML), render it directly
  if (typeof content === 'string') {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // If content is an unknown object format (like Lexical), try to stringify or return null
  // This handles cases where content is passed but in an unsupported format
  return null
}

export default RichTextContent
