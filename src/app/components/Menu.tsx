/**
 * Menu Component
 * Server component that fetches and renders navigation menus
 * Supports full color configuration including hover and reverse states
 * Uses CSS classes instead of inline styles for better CMS integration
 */

import client from '@/lib/frontspace-client'
import { MenuItemClient } from './MenuItemClient'
import type { MenuColors } from './HamburgerMenu'

interface MenuProps {
  menuId: string
  orientation?: 'horizontal' | 'vertical'
  alignment?: 'left' | 'center' | 'right'
  colors?: MenuColors
  textColor?: string // Legacy prop - use colors instead
  className?: string
  blockId?: string
}

export async function Menu({
  menuId,
  orientation = 'horizontal',
  alignment = 'left',
  colors,
  textColor,
  className = '',
  blockId
}: MenuProps) {
  // Fetch menu data from Frontspace API
  const menu = await client.getMenu(menuId)

  if (!menu || !menu.items || menu.items.length === 0) {
    return null
  }

  // Use colors.textColor or fallback to legacy textColor prop
  const effectiveTextColor = colors?.textColor || textColor

  // Generate unique menu ID for CSS scoping
  const menuClass = blockId ? `menu-${blockId}` : `menu-${menuId}`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .${menuClass} {
          position: relative;
        }
        .${menuClass} .menu-list {
          display: flex;
          flex-direction: ${orientation === 'vertical' ? 'column' : 'row'};
          justify-content: ${alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start'};
          list-style: none;
          margin: 0;
          padding: var(--padding-top, 0) var(--padding-right, 0) var(--padding-bottom, 0) var(--padding-left, 0);
          gap: var(--menu-gap, 1rem);
          position: relative;
        }
      `}} />
      <nav
        className={`menu ${menuClass} ${className}`}
        style={{ color: effectiveTextColor || 'inherit' }}
      >
        <ul className="menu-list">
          {menu.items.map((item) => (
            <MenuItemClient key={item.id} item={item} colors={colors} textColor={effectiveTextColor} />
          ))}
        </ul>
      </nav>
    </>
  )
}
