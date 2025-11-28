/**
 * Container Block Component
 *
 * Layout container that holds child blocks
 * Supports background images, videos, and overlays
 * Can be flex or grid container based on display style
 * Supports clickable containers with link functionality
 */

import React from 'react'
import Link from 'next/link'
import { BlockRenderer } from '@/app/components/BlockRenderer'
import { resolveInternalLinkUrl } from '@/lib/block-utils'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface ContainerBlockProps {
  block: Block
  blockId: string
}

/**
 * Generate background CSS for containers with images and overlays
 */
function generateBackgroundCSS(blockId: string, background: any): string {
  if (!background) return ''

  let css = ''

  // Add position relative for pseudo-elements (::before, ::after)
  // Children get z-index to appear above background/overlay
  css += `
    #${blockId} {
      position: relative;
    }
    #${blockId} > * {
      z-index: 2;
    }
  `

  // Check for responsive backgrounds
  const hasResponsiveBackgrounds = background.desktop || background.tablet || background.mobile

  if (hasResponsiveBackgrounds) {
    // Desktop background
    if (background.desktop) {
      css += generateSingleBackgroundCSS(blockId, background.desktop, 'desktop')
    }

    // Tablet background
    if (background.tablet) {
      css += generateSingleBackgroundCSS(blockId, background.tablet, 'tablet')
    }

    // Mobile background
    if (background.mobile) {
      css += generateSingleBackgroundCSS(blockId, background.mobile, 'mobile')
    }
  } else {
    // Single background for all breakpoints
    css += generateSingleBackgroundCSS(blockId, background, 'all')
  }

  return css
}

/**
 * Generate CSS for a single background (with optional overlay)
 */
function generateSingleBackgroundCSS(
  blockId: string,
  background: any,
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'all'
): string {
  if (!background || background.type === 'none') return ''

  let css = ''
  const mediaQuery = getMediaQueryForBreakpoint(breakpoint)
  const wrapStart = mediaQuery ? `${mediaQuery} {` : ''
  const wrapEnd = mediaQuery ? '}' : ''

  if (background.type === 'image' && background.imageUrl) {
    // Background image using ::before pseudo-element
    css += `${wrapStart}
      #${blockId}::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('${background.imageUrl}');
        background-size: ${background.size || 'cover'};
        background-position: ${background.position || 'center center'};
        background-repeat: ${background.repeat || 'no-repeat'};
        background-attachment: ${background.attachment || 'scroll'};
        z-index: 0;
      }
    ${wrapEnd}`

    // Overlay using ::after pseudo-element
    if (background.overlay && background.overlay.enabled) {
      css += `${wrapStart}
        #${blockId}::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${background.overlay.color};
          opacity: ${background.overlay.opacity};
          z-index: 1;
        }
      ${wrapEnd}`
    }
  }

  return css
}

/**
 * Get media query string for breakpoint
 */
function getMediaQueryForBreakpoint(breakpoint: string): string {
  switch (breakpoint) {
    case 'mobile':
      return '@media (max-width: 767px)'
    case 'tablet':
      return '@media (min-width: 768px) and (max-width: 1023px)'
    case 'desktop':
      return '@media (min-width: 1024px)'
    default:
      return ''
  }
}

export default async function ContainerBlock({ block, blockId }: ContainerBlockProps) {
  const content = block.content || {}

  // Build background object from Frontspace format (backgroundType, backgroundImage, backgroundVideo, etc.)
  const background = content.backgroundType ? {
    type: content.backgroundType,
    imageUrl: content.backgroundImage,
    videoUrl: content.backgroundVideo,
    overlay: {
      enabled: content.overlayEnabled || false,
      color: content.overlayColor || '#000000',
      // Convert percentage (0-100) to decimal (0-1) for CSS opacity
      opacity: content.overlayOpacity ? content.overlayOpacity / 100 : 0.5
    },
    size: content.backgroundSize || 'cover',
    position: content.backgroundPosition || 'center center',
    repeat: content.backgroundRepeat || 'no-repeat',
    attachment: content.backgroundAttachment || 'scroll'
  } : null

  // Generate additional CSS for backgrounds
  const backgroundCSS = generateBackgroundCSS(blockId, background)

  // Determine container type for class names
  const displayType = block.styles?.display || 'flex'
  const containerTypeClass = displayType === 'grid' ? 'grid-container' : 'flex-container'

  // Helper: Get container URL
  const getContainerUrl = (): string => {
    if (!content.link) return ''

    if (content.link.type === 'external') {
      return content.link.url || ''
    } else if (content.link.type === 'internal') {
      return resolveInternalLinkUrl(content.link)
    }
    return ''
  }

  // Helper: Get link attributes
  const getLinkAttributes = () => {
    const url = getContainerUrl()
    const shouldOpenInNewWindow =
      content.link?.openInNewWindow ||
      (content.link?.type === 'external' && url.startsWith('http'))

    return {
      target: shouldOpenInNewWindow ? '_blank' : '_self',
      rel: shouldOpenInNewWindow ? 'noopener noreferrer' : undefined
    }
  }

  // Determine if clickable
  const isClickable = content.clickable && content.link
  const containerUrl = getContainerUrl()
  const linkAttributes = getLinkAttributes()

  // Common container content
  const containerContent = (
    <>
      {/* Video background */}
      {background?.type === 'video' && background.videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src={background.videoUrl} type="video/mp4" />
        </video>
      )}
      {/* Overlay for video */}
      {background?.type === 'video' && background.overlay?.enabled && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: background.overlay.color,
            opacity: background.overlay.opacity,
            zIndex: 1
          }}
        />
      )}
      {content.children && content.children.length > 0 && (
        <BlockRenderer blocks={content.children} />
      )}
    </>
  )

  // Common props for both clickable and non-clickable containers
  const commonProps = {
    id: blockId,
    className: `container-block ${containerTypeClass} block-${blockId} relative`,
    'data-block-id': blockId
  }

  // Render non-clickable container
  if (!isClickable || !containerUrl) {
    return (
      <>
        {backgroundCSS && <style dangerouslySetInnerHTML={{ __html: backgroundCSS }} />}
        <div {...commonProps}>
          {containerContent}
        </div>
      </>
    )
  }

  // Render clickable container
  const isInternal = content.link.type === 'internal'

  if (isInternal) {
    // Use Next.js Link for internal navigation
    return (
      <>
        {backgroundCSS && <style dangerouslySetInnerHTML={{ __html: backgroundCSS }} />}
        <Link
          href={containerUrl}
          {...commonProps}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {containerContent}
        </Link>
      </>
    )
  }

  // External link - use regular <a> tag
  return (
    <>
      {backgroundCSS && <style dangerouslySetInnerHTML={{ __html: backgroundCSS }} />}
      <a
        href={containerUrl}
        target={linkAttributes.target}
        rel={linkAttributes.rel}
        {...commonProps}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {containerContent}
      </a>
    </>
  )
}
