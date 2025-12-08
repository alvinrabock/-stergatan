'use client'

/**
 * Hamburger Menu Component
 * Mobile/responsive menu with slide-out drawer
 * Supports scroll-based color changes for transparent headers
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export interface MenuItem {
  id: string
  label: string
  type: 'internal' | 'external' | 'none'
  url?: string
  pageSlug?: string
  openInNewWindow?: boolean
  children?: MenuItem[]
}

export interface HamburgerSettings {
  enabled: boolean
  breakpoint: 'mobile' | 'tablet' | 'desktop'
  mobileMenuId?: string
  iconColor?: string
  reverseIconColor?: string
  drawerBgColor?: string
  drawerTextColor?: string
  hoverBgColor?: string
  drawerWidth?: string
  overlayOpacity?: string
  fontSize?: string
}

export interface MenuColors {
  textColor?: string
  backgroundColor?: string
  hoverTextColor?: string
  hoverBackgroundColor?: string
  borderColor?: string
  reverseTextColor?: string
  reverseBackgroundColor?: string
  reverseHoverTextColor?: string
  reverseHoverBackgroundColor?: string
  reverseBorderColor?: string
}

interface HamburgerMenuProps {
  settings: HamburgerSettings
  menuItems: MenuItem[]
  colors?: MenuColors
  blockId: string
}

export function HamburgerMenu({ settings, menuItems, colors, blockId: _blockId }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Track scroll state for icon color changes
  // Also check if reverseHeaderColors is set on the parent header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if reverseHeaderColors is set on parent header (for immediate color application)
  // Also listen for pageHeaderSettingsChange events for dynamic updates
  const [reverseHeaderColors, setReverseHeaderColors] = useState(false)
  useEffect(() => {
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

    window.addEventListener('pageHeaderSettingsChange', handlePageSettingsChange as EventListener)
    return () => {
      window.removeEventListener('pageHeaderSettingsChange', handlePageSettingsChange as EventListener)
    }
  }, [])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }, [])

  const closeDrawer = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Determine icon color based on scroll state and reverseHeaderColors
  // If reverseHeaderColors is true OR user has scrolled, use reverse colors
  const shouldUseReverseColors = reverseHeaderColors || scrolled
  const iconColor = shouldUseReverseColors
    ? settings.reverseIconColor || colors?.reverseTextColor || '#000000'
    : settings.iconColor || colors?.textColor || '#ffffff'

  // Drawer styles
  const drawerBgColor = settings.drawerBgColor || '#ffffff'
  const drawerTextColor = settings.drawerTextColor || '#000000'
  const hoverBgColor = settings.hoverBgColor || '#f3f4f6'
  const drawerWidth = settings.drawerWidth || '320px'
  const overlayOpacity = settings.overlayOpacity || '0.5'
  const fontSize = settings.fontSize || '16px'

  const getItemHref = (item: MenuItem): string => {
    if (item.type === 'internal' && item.url) {
      return item.url
    } else if (item.type === 'external' && item.url) {
      return item.url
    } else if (item.url) {
      return item.url
    }
    return '#'
  }

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const href = getItemHref(item)
    const paddingLeft = `${1.5 + depth * 1}rem`

    return (
      <li key={item.id}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(item.id)}
              className="hamburger-menu-item w-full text-left flex items-center justify-between transition-colors"
              style={{
                color: drawerTextColor,
                fontSize,
                padding: '0.875rem 1.5rem',
                paddingLeft,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBgColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span>{item.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isExpanded && (
              <ul className="list-none m-0 p-0">
                {item.children!.map(child => renderMenuItem(child, depth + 1))}
              </ul>
            )}
          </>
        ) : (
          item.type === 'internal' ? (
            <Link
              href={href}
              onClick={closeDrawer}
              className="hamburger-menu-item block transition-colors"
              style={{
                color: drawerTextColor,
                fontSize,
                padding: '0.875rem 1.5rem',
                paddingLeft,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBgColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </Link>
          ) : (
            <a
              href={href}
              target={item.openInNewWindow ? '_blank' : '_self'}
              rel={item.openInNewWindow ? 'noopener noreferrer' : undefined}
              onClick={closeDrawer}
              className="hamburger-menu-item block transition-colors"
              style={{
                color: drawerTextColor,
                fontSize,
                padding: '0.875rem 1.5rem',
                paddingLeft,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBgColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </a>
          )
        )}
      </li>
    )
  }

  return (
    <>
      {/* Hamburger Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hamburger-menu-button p-2 focus:outline-none transition-colors duration-300"
        style={{
          color: iconColor,
          // Use CSS custom property as fallback for header scroll behavior
          ['--hamburger-color' as string]: iconColor,
        }}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: 'inherit' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] transition-opacity"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          }}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-[10001] transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          width: drawerWidth,
          maxWidth: '90vw',
          backgroundColor: drawerBgColor,
          boxShadow: isOpen ? '-4px 0 12px rgba(0, 0, 0, 0.15)' : 'none',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={closeDrawer}
            className="p-2 focus:outline-none"
            style={{ color: drawerTextColor }}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <ul className="list-none m-0 p-0">
            {menuItems.map(item => renderMenuItem(item))}
          </ul>
        </nav>
      </div>
    </>
  )
}
