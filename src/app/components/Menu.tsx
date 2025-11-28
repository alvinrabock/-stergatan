/**
 * Menu Component
 * Server component that fetches and renders navigation menus
 * Supports full color configuration including hover and reverse states
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
}

export async function Menu({
  menuId,
  orientation = 'horizontal',
  alignment = 'left',
  colors,
  textColor,
  className = ''
}: MenuProps) {
  // Fetch menu data from Frontspace API
  const menu = await client.getMenu(menuId)

  if (!menu || !menu.items || menu.items.length === 0) {
    return null
  }

  // Use colors.textColor or fallback to legacy textColor prop
  const effectiveTextColor = colors?.textColor || textColor

  return (
    <nav
      className={`menu ${className}`}
      style={{ color: effectiveTextColor || 'inherit', position: 'relative' }}
    >
      <ul
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          justifyContent:
            alignment === 'center' ? 'center' :
            alignment === 'right' ? 'flex-end' :
            'flex-start',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: '1rem',
          position: 'relative',
        }}
      >
        {menu.items.map((item) => (
          <MenuItemClient key={item.id} item={item} colors={colors} textColor={effectiveTextColor} />
        ))}
      </ul>
    </nav>
  )
}
