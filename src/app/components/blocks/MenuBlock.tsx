/**
 * Menu Block Component
 *
 * Renders navigation menu using the Menu component
 * Supports hamburger/mobile menu with responsive breakpoints
 * Fetches menu data from Frontspace CMS
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

  return (
    <>
      {breakpointCSS && <style dangerouslySetInnerHTML={{ __html: breakpointCSS }} />}

      <div
        className={`menu-block block-${blockId}`}
        data-block-id={blockId}
        style={{ position: 'relative', overflow: 'visible' }}
      >
        {/* Regular Menu (hidden on mobile/tablet based on hamburger breakpoint) */}
        <div className={hamburgerSettings?.enabled ? `regular-menu-${blockId}` : ''}>
          <Menu
            menuId={content.selectedMenuId}
            orientation={orientation}
            alignment={alignment}
            colors={colors}
            className={`block-${blockId}`}
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
