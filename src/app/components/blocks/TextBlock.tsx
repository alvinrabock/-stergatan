/**
 * Text Block Component
 *
 * Renders rich text content from Frontspace CMS
 * Uses htmlTag from CMS to render proper semantic HTML (h1, h2, p, etc.)
 * If htmlTag is not provided, infers it based on font size
 */

import React from 'react'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface TextBlockProps {
  block: Block
  blockId: string
}

/**
 * Strip inline styles from HTML content
 * Removes style attributes while preserving other HTML structure
 */
function stripInlineStyles(html: string): string {
  return html.replace(/\s+style="[^"]*"/gi, '')
}

export default function TextBlock({ block, blockId }: TextBlockProps) {
  const rawText = block.content.text || ''
  // Strip inline styles from CMS content to use only block styles
  const text = stripInlineStyles(rawText)
  let htmlTag = block.content.htmlTag

  // If htmlTag is not provided by CMS, infer it from font size
  if (!htmlTag && block.styles?.fontSize) {
    const fontSize = parseInt(block.styles.fontSize)
    if (fontSize >= 40) {
      htmlTag = 'h1'
    } else if (fontSize >= 32) {
      htmlTag = 'h2'
    } else if (fontSize >= 28) {
      htmlTag = 'h3'
    } else if (fontSize >= 24) {
      htmlTag = 'h4'
    } else if (fontSize >= 20) {
      htmlTag = 'h5'
    } else if (fontSize >= 18) {
      htmlTag = 'h6'
    } else {
      htmlTag = 'p'
    }
  } else if (!htmlTag) {
    htmlTag = 'p'
  }

  // Create the element with the specified HTML tag
  const Element = htmlTag as keyof React.JSX.IntrinsicElements

  return (
    <Element
      className={`text-block block-${blockId} leading-relaxed`}
      data-block-id={blockId}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}
