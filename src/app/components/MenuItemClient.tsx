'use client'

/**
 * Client-side Menu Item Component
 * Handles hover interactions for dropdowns
 * Supports full color configuration including hover and scroll-based reverse states
 */

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { MenuItem as MenuItemType } from '@/lib/frontspace-client'
import type { MenuColors } from './HamburgerMenu'

interface MenuItemProps {
  item: MenuItemType
  colors?: MenuColors
  textColor?: string // Legacy prop
}

export function MenuItemClient({ item, colors, textColor }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  // Check if reverseHeaderColors is set on parent header (for immediate color application)
  // Also listen for pageHeaderSettingsChange events for dynamic updates
  const [reverseHeaderColors, setReverseHeaderColors] = useState(false)

  // Track scroll for color changes (transparent header support)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    // Check reverseHeaderColors from parent header
    const updateReverseColors = () => {
      const header = document.querySelector('.global-header-template')
      if (header) {
        const reverseColors = header.getAttribute('data-reverse-header-colors') === 'true'
        const isTransparent = header.getAttribute('data-header-transparent') === 'true'
        setReverseHeaderColors(reverseColors && isTransparent)
      }
    }

    // Check initial state
    updateReverseColors()

    // Listen for page settings changes
    const handlePageSettingsChange = (event: CustomEvent<{ reverseHeaderColors: boolean }>) => {
      const header = document.querySelector('.global-header-template')
      const isTransparent = header?.getAttribute('data-header-transparent') === 'true'
      setReverseHeaderColors(event.detail.reverseHeaderColors && isTransparent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('pageHeaderSettingsChange', handlePageSettingsChange as EventListener)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('pageHeaderSettingsChange', handlePageSettingsChange as EventListener)
    }
  }, [])

  // Memoize handlers to prevent memory leaks
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (hasChildren) {
      setIsOpen(true)
    }
  }, [hasChildren])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (hasChildren) {
      setIsOpen(false)
    }
  }, [hasChildren])

  // Determine current colors based on scroll state and reverseHeaderColors
  // When scrolled OR reverseHeaderColors is true, use reverse colors (for transparent headers)
  const shouldUseReverseColors = reverseHeaderColors || scrolled

  const currentTextColor = shouldUseReverseColors
    ? (colors?.reverseTextColor || colors?.textColor || textColor || 'inherit')
    : (colors?.textColor || textColor || 'inherit')

  const currentHoverTextColor = shouldUseReverseColors
    ? (colors?.reverseHoverTextColor || colors?.hoverTextColor || currentTextColor)
    : (colors?.hoverTextColor || currentTextColor)

  const currentHoverBgColor = shouldUseReverseColors
    ? (colors?.reverseHoverBackgroundColor || colors?.hoverBackgroundColor || 'transparent')
    : (colors?.hoverBackgroundColor || 'transparent')

  // Determine the URL based on link_type
  let href = '#'
  if (item.type === 'internal' && item.url) {
    href = item.url
  } else if (item.type === 'external' && item.url) {
    href = item.url
  } else if (item.url) {
    href = item.url
  }

  const baseStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: isHovered ? currentHoverTextColor : currentTextColor,
    backgroundColor: isHovered ? currentHoverBgColor : 'transparent',
    padding: '0.5rem 1rem',
    display: 'block',
    transition: 'color 0.2s ease, background-color 0.2s ease',
    cursor: 'pointer',
  }

  const linkProps = {
    href,
    target: item.openInNewWindow ? '_blank' : '_self',
    rel: item.openInNewWindow ? 'noopener noreferrer' : undefined,
    style: baseStyle,
    className: 'menu-item',
  }

  return (
    <li
      style={{ position: 'relative', zIndex: isOpen ? 1001 : 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="menu-item-wrapper"
    >
      {hasChildren ? (
        // If has children, render as span (dropdown trigger)
        <span style={baseStyle} className="menu-item">
          <span>{item.label}</span>
        </span>
      ) : item.type === 'internal' ? (
        <Link {...linkProps}>
          <span>{item.label}</span>
        </Link>
      ) : (
        <a {...linkProps}>
          <span>{item.label}</span>
        </a>
      )}

      {hasChildren && (
        <ul
          style={{
            display: isOpen ? 'block' : 'none',
            position: 'absolute',
            top: '100%',
            left: 0,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
            borderRadius: '0.5rem',
            overflow: 'hidden',
          }}
          data-menu-label={item.label}
          data-is-open={isOpen}
        >
          {item.children!.map((child) => (
            <SubmenuItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

/**
 * Submenu item component with hover state
 */
function SubmenuItem({ item }: { item: MenuItemType }) {
  const [isHovered, setIsHovered] = useState(false)

  let childHref = '#'
  if (item.type === 'internal' && item.url) {
    childHref = item.url
  } else if (item.type === 'external' && item.url) {
    childHref = item.url
  } else if (item.url) {
    childHref = item.url
  }

  const childStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#333',
    padding: '0.75rem 1rem',
    display: 'block',
    backgroundColor: isHovered ? '#f3f4f6' : 'transparent',
    transition: 'background-color 0.2s ease',
  }

  const childLinkProps = {
    href: childHref,
    target: item.openInNewWindow ? '_blank' : '_self',
    rel: item.openInNewWindow ? 'noopener noreferrer' : undefined,
    className: 'submenu-item',
    style: childStyle,
  }

  return (
    <li
      style={{ borderBottom: '1px solid #f0f0f0' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.type === 'internal' ? (
        <Link {...childLinkProps}>
          {item.label}
        </Link>
      ) : (
        <a {...childLinkProps}>
          {item.label}
        </a>
      )}
    </li>
  )
}
