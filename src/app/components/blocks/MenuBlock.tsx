/**
 * Menu Block Component
 *
 * Renders navigation menu using the Menu component
 * Supports hamburger/mobile menu with responsive breakpoints
 * Fetches menu data from Frontspace CMS
 * Uses CSS classes and CSS variables for CMS-driven styling
 */

import React from 'react'
import { Menu } from '@/app/components/Menu'
import { HamburgerMenu } from '@/app/components/HamburgerMenu'
import type { MenuItem as HamburgerMenuItem, HamburgerSettings, MenuColors } from '@/app/components/HamburgerMenu'
import { generateHamburgerBreakpointCSS } from '@/lib/menu-utils'
import client from '@/lib/frontspace-client'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface MenuBlockProps {
  block: Block
  blockId: string
}

/**
 * Generate base CSS for menu items
 * These are the static styles that don't need to be inline
 */
function generateMenuBaseCSS(blockId: string): string {
  return `
    .block-${blockId} .menu-item-wrapper {
      position: relative;
      z-index: 1;
    }
    .block-${blockId} .menu-item-wrapper.is-open {
      z-index: 1001;
    }
    .block-${blockId} .menu-item {
      text-decoration: none;
      display: block;
      transition: color 0.2s ease, background-color 0.2s ease;
      cursor: pointer;
    }
    .block-${blockId} .submenu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      list-style: none;
      margin: 0;
      padding: 0;
      background-color: var(--submenu-bg, #ffffff);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 200px;
      z-index: 1000;
      border-radius: var(--submenu-border-radius, 0.5rem);
      overflow: hidden;
    }
    .block-${blockId} .submenu.is-open {
      display: block;
    }
    .block-${blockId} .submenu-item-wrapper {
      border-bottom: 1px solid var(--submenu-border-color, #f0f0f0);
    }
    .block-${blockId} .submenu-item-wrapper:last-child {
      border-bottom: none;
    }
    .block-${blockId} .submenu-item {
      text-decoration: none;
      color: var(--submenu-text-color, #333);
      padding: var(--submenu-item-padding, 0.75rem 1rem);
      display: block;
      transition: background-color 0.2s ease;
    }
  `
}

export default async function MenuBlock({ block, blockId }: MenuBlockProps) {
  const content = block.content || {}
  const orientation = content.orientation || 'horizontal'
  const alignment = content.alignment || 'left'
  const colors: MenuColors = content.colors || {}
  const hamburgerSettings: HamburgerSettings | undefined = content.hamburgerSettings

  // If no selectedMenuId, return null
  if (!content.selectedMenuId) {
    return null
  }

  // Fetch menu data
  const menu = await client.getMenu(content.selectedMenuId)

  if (!menu || !menu.items || menu.items.length === 0) {
    return null
  }

  // Transform menu items to HamburgerMenuItem format
  const menuItems: HamburgerMenuItem[] = menu.items.map((item: any) => ({
    id: item.id,
    label: item.label,
    type: item.type || 'internal',
    url: item.url,
    pageSlug: item.pageSlug,
    openInNewWindow: item.openInNewWindow,
    children: item.children?.map((child: any) => ({
      id: child.id,
      label: child.label,
      type: child.type || 'internal',
      url: child.url,
      pageSlug: child.pageSlug,
      openInNewWindow: child.openInNewWindow,
      children: child.children?.map((grandchild: any) => ({
        id: grandchild.id,
        label: grandchild.label,
        type: grandchild.type || 'internal',
        url: grandchild.url,
        pageSlug: grandchild.pageSlug,
        openInNewWindow: grandchild.openInNewWindow,
      })),
    })),
  }))

  // Generate breakpoint CSS if hamburger is enabled
  const breakpointCSS = hamburgerSettings?.enabled
    ? generateHamburgerBreakpointCSS(blockId, hamburgerSettings.breakpoint)
    : ''

  // Generate base menu CSS
  const menuBaseCSS = generateMenuBaseCSS(blockId)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: menuBaseCSS + breakpointCSS }} />

      <div
        className={`menu-block block-${blockId}`}
        data-block-id={blockId}
      >
        {/* Regular Menu (hidden on mobile/tablet based on hamburger breakpoint) */}
        <div className={hamburgerSettings?.enabled ? `regular-menu-${blockId}` : ''}>
          <Menu
            menuId={content.selectedMenuId}
            orientation={orientation}
            alignment={alignment}
            colors={colors}
            className={`block-${blockId}`}
            blockId={blockId}
          />
        </div>

        {/* Hamburger Menu (shown on mobile/tablet based on breakpoint) */}
        {hamburgerSettings?.enabled && (
          <div className={`hamburger-wrapper-${blockId}`}>
            <HamburgerMenu
              settings={hamburgerSettings}
              menuItems={menuItems}
              colors={colors}
              blockId={blockId}
            />
          </div>
        )}
      </div>
    </>
  )
}
