/**
 * Image Block Component
 *
 * Renders images from Frontspace CMS
 * Uses regular <img> tags to support dynamic image sources
 * Supports border radius and other inline styling properties from block.styles
 */

import React from 'react'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface ImageBlockProps {
  block: Block
  blockId: string
}

export default function ImageBlock({ block, blockId }: ImageBlockProps) {
  const { src, alt, link, logoOnScroll } = block.content

  if (!src) return null

  // The CSS styles are applied via the block-${blockId} class
  // The image should fill its container and inherit border-radius via overflow:hidden
  const imageElement = (
    <img
      src={src}
      alt={alt || 'Image'}
      className="w-full h-full object-cover"
    />
  )

  const content = link?.url ? (
    <a href={link.url} target={link.target || '_self'} className="block w-full h-full">
      {imageElement}
    </a>
  ) : imageElement

  return (
    <div
      className={`image-block block-${blockId} overflow-hidden`}
      data-block-id={blockId}
      data-logo-on-scroll={logoOnScroll || undefined}
    >
      {content}
    </div>
  )
}
