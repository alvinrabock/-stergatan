/**
 * Menu Utilities
 * Server-side functions for menu rendering
 */

/**
 * Generate CSS for showing/hiding menu based on breakpoint
 */
export function generateHamburgerBreakpointCSS(blockId: string, breakpoint: string): string {
  if (breakpoint === 'mobile') {
    return `
      .regular-menu-${blockId} { display: flex; }
      .hamburger-wrapper-${blockId} { display: none; }
      @media (max-width: 767px) {
        .regular-menu-${blockId} { display: none !important; }
        .hamburger-wrapper-${blockId} { display: block; }
      }
    `
  }

  if (breakpoint === 'tablet') {
    return `
      .regular-menu-${blockId} { display: flex; }
      .hamburger-wrapper-${blockId} { display: none; }
      @media (max-width: 1023px) {
        .regular-menu-${blockId} { display: none !important; }
        .hamburger-wrapper-${blockId} { display: block; }
      }
    `
  }

  if (breakpoint === 'desktop') {
    return `
      .regular-menu-${blockId} { display: none !important; }
      .hamburger-wrapper-${blockId} { display: block; }
    `
  }

  return ''
}
