/**
 * Button Block Component for Headless Frontend
 *
 * Renders clickable buttons with links and proper styles
 * Supports all link types: internal, external, email, phone, anchor
 */

import React from 'react'
import Link from 'next/link'
import { isInternalUrl, resolveInternalLinkUrl, generateAdvancedBlockCSS, Block } from '@/lib/block-utils'

interface ButtonBlockProps {
  block: Block
  blockId: string
}

export default function ButtonBlock({ block, blockId }: ButtonBlockProps) {
  const { text, link } = block.content

  // Generate responsive CSS (same as public-block-renderer.tsx)
  const { css: responsiveCSS, className: blockClassName } = generateAdvancedBlockCSS(block, {
    includeGlobal: false,
    prefix: 'button-block'
  })

  // Resolve link URL based on type
  const resolveLink = () => {
    if (!link) return null

    switch (link.type) {
      case 'internal':
        return resolveInternalLinkUrl(link)
      case 'external':
        return link.url || null
      case 'email':
        return link.url ? `mailto:${link.url}` : null
      case 'phone':
        return link.url ? `tel:${link.url}` : null
      case 'anchor':
        return link.url || null
      default:
        return link.url || null
    }
  }

  const href = resolveLink()

  // Inject the responsive CSS
  const styleElement = responsiveCSS ? (
    <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
  ) : null

  // No link - render as button
  if (!href) {
    return (
      <>
        {styleElement}
        <button
          className={blockClassName}
          data-block-id={blockId}
          type="button"
        >
          {text || 'Button'}
        </button>
      </>
    )
  }

  // Internal link - use Next.js Link
  if (link.type === 'internal' && isInternalUrl(href)) {
    const linkProps = link.openInNewWindow
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : {}

    return (
      <>
        {styleElement}
        <Link
          href={href}
          {...linkProps}
          style={{ display: 'contents' }}
        >
          <button className={blockClassName} data-block-id={blockId}>
            {text || 'Button'}
          </button>
        </Link>
      </>
    )
  }

  // External/email/phone/anchor - use regular anchor tag
  const linkProps = link.openInNewWindow
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <>
      {styleElement}
      <a
        href={href}
        {...linkProps}
        style={{ display: 'contents' }}
      >
        <button className={blockClassName} data-block-id={blockId}>
          {text || 'Button'}
        </button>
      </a>
    </>
  )
}
