'use client';

/**
 * Global Header Client Component
 * Handles scroll behavior and dynamic styling for the header
 * Reads --color-on-scroll and --background-color-on-scroll CSS variables from container blocks
 */

import { useEffect, useRef, useState } from 'react';
import type { HeaderSettings } from '@/lib/frontspace/types';

interface GlobalHeaderClientProps {
  settings?: HeaderSettings;
  children: React.ReactNode;
  reverseHeaderColors?: boolean;
}

export function GlobalHeaderClient({ settings, children, reverseHeaderColors: initialReverseColors = false }: GlobalHeaderClientProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [reverseHeaderColors, setReverseHeaderColors] = useState(initialReverseColors);

  // Default to transparent and sticky for overlay behavior
  const isTransparent = settings?.background === 'transparent' || !settings?.background;
  const isSticky = settings?.position === 'sticky' || !settings?.position;
  const isFixed = settings?.position === 'fixed';

  // Listen for page header settings changes (from PageHeaderSettings component)
  useEffect(() => {
    const handlePageSettingsChange = (event: CustomEvent<{ reverseHeaderColors: boolean }>) => {
      setReverseHeaderColors(event.detail.reverseHeaderColors);
    };

    window.addEventListener('pageHeaderSettingsChange', handlePageSettingsChange as EventListener);
    return () => {
      window.removeEventListener('pageHeaderSettingsChange', handlePageSettingsChange as EventListener);
    };
  }, []);

  // Handle scroll behavior - reads CSS variables from container blocks
  // reverseHeaderColors: Apply reverse text colors immediately (without scroll) for transparent headers
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);

      const header = headerRef.current;
      if (!header) return;

      // Get scroll colors from first container block's CSS variables
      const firstContainer = header.querySelector('.container-block') as HTMLElement;
      const colorOnScroll = firstContainer
        ? getComputedStyle(firstContainer).getPropertyValue('--color-on-scroll').trim()
        : settings?.colorOnScroll;
      const bgColorOnScroll = firstContainer
        ? getComputedStyle(firstContainer).getPropertyValue('--background-color-on-scroll').trim()
        : settings?.backgroundColorOnScroll;

      // Get logo on scroll from image block data attribute
      const logoBlock = header.querySelector('[data-logo-on-scroll]') as HTMLElement;
      const logoOnScroll = logoBlock?.dataset.logoOnScroll;

      // KEY LOGIC for reverseHeaderColors:
      // - Text colors apply if: reverseHeaderColors is true (page setting) OR user has scrolled
      // - Background colors ONLY apply when scrolled (never immediately)
      // - Logo swap happens when reverseHeaderColors is true OR user has scrolled
      const shouldApplyReverseTextColors = isTransparent ? (reverseHeaderColors || scrolled) : scrolled;
      const shouldApplyBackground = scrolled;
      const shouldSwapLogo = isTransparent ? (reverseHeaderColors || scrolled) : scrolled;

      if (shouldApplyBackground) {
        // Apply background color on scroll
        if (bgColorOnScroll) {
          header.style.backgroundColor = bgColorOnScroll;
        }
        header.classList.add('scrolled');
      } else {
        // Reset to transparent
        header.style.backgroundColor = 'transparent';
        header.classList.remove('scrolled');
      }

      if (shouldApplyReverseTextColors) {
        // Apply text color on scroll to all text elements
        if (colorOnScroll) {
          header.querySelectorAll('a span, .menu-item span, nav a').forEach((el) => {
            (el as HTMLElement).style.color = colorOnScroll;
          });
          // Note: hamburger-menu-button color is managed by HamburgerMenu component's own scroll state
        }
      } else {
        // Reset text colors
        header.querySelectorAll('a span, .menu-item span, nav a').forEach((el) => {
          (el as HTMLElement).style.color = '';
        });
        // Note: hamburger-menu-button color is managed by HamburgerMenu component's own scroll state
      }

      // Handle logo switching - only on actual scroll, NOT on reverseHeaderColors
      if (shouldSwapLogo && logoOnScroll) {
        const logoImg = logoBlock?.querySelector('img') as HTMLImageElement;
        if (logoImg) {
          if (!logoImg.dataset.originalSrc) {
            logoImg.dataset.originalSrc = logoImg.src;
          }
          logoImg.src = logoOnScroll;
        }
      } else if (!shouldSwapLogo && logoOnScroll) {
        // Reset logo
        const logoImg = logoBlock?.querySelector('img') as HTMLImageElement;
        if (logoImg && logoImg.dataset.originalSrc) {
          logoImg.src = logoImg.dataset.originalSrc;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state immediately

    return () => window.removeEventListener('scroll', handleScroll);
  }, [settings, reverseHeaderColors, isTransparent]);

  // Build inline styles
  // For transparent headers, use fixed positioning to overlay content (like hero sections)
  // For solid backgrounds, use sticky so it stays in document flow
  const headerStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  };

  // Only use sticky for non-transparent headers
  if (!isTransparent && !isFixed) {
    headerStyle.position = 'sticky';
    delete headerStyle.left;
    delete headerStyle.right;
  }

  const className = [
    'global-header-template',
    'w-full',
    isScrolled ? 'scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header
      ref={headerRef}
      style={headerStyle}
      className={className}
      data-header-transparent={isTransparent ? 'true' : 'false'}
      data-reverse-header-colors={reverseHeaderColors ? 'true' : 'false'}
      data-position={settings?.position}
      data-background={settings?.background}
    >
      {children}
    </header>
  );
}
