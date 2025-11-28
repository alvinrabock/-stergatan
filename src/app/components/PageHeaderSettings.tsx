'use client'

/**
 * Page Header Settings Component
 * Allows pages to communicate settings to the global header
 * Currently supports reverseHeaderColors for transparent headers
 */

import { useEffect } from 'react'

interface PageHeaderSettingsProps {
  reverseHeaderColors?: boolean
}

export function PageHeaderSettings({ reverseHeaderColors = false }: PageHeaderSettingsProps) {
  useEffect(() => {
    // Find the global header and update its data attribute
    const header = document.querySelector('.global-header-template')
    if (header) {
      header.setAttribute('data-reverse-header-colors', reverseHeaderColors ? 'true' : 'false')

      // Dispatch a custom event so header client can react immediately
      window.dispatchEvent(new CustomEvent('pageHeaderSettingsChange', {
        detail: { reverseHeaderColors }
      }))
    }

    // Cleanup: reset to false when component unmounts (page navigation)
    return () => {
      const header = document.querySelector('.global-header-template')
      if (header) {
        header.setAttribute('data-reverse-header-colors', 'false')
        window.dispatchEvent(new CustomEvent('pageHeaderSettingsChange', {
          detail: { reverseHeaderColors: false }
        }))
      }
    }
  }, [reverseHeaderColors])

  // This component renders nothing - it only manages the header state
  return null
}
