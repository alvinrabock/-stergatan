/**
 * Global Header Component
 * Renders header from Frontspace CMS using BlockRenderer
 * Server component that wraps GlobalHeaderClient for scroll behavior
 * Supports reverseHeaderColors from page settings for transparent headers
 */

import { BlockRenderer } from './BlockRenderer';
import { GlobalHeaderClient } from './GlobalHeaderClient';
import type { Header as HeaderType } from '@/lib/frontspace/types';

interface GlobalHeaderProps {
  header: HeaderType;
  reverseHeaderColors?: boolean;
}

export async function GlobalHeader({ header, reverseHeaderColors = false }: GlobalHeaderProps) {
  const blocks = header.content?.blocks || [];
  const settings = header.headerSettings;

  // Get scroll colors from first container block if available (overrides header settings)
  const firstContainer = blocks.find((b) => b.type === 'container');
  const blockScrollColors = firstContainer?.responsiveStyles?.colorOnScroll?.desktop;
  const blockScrollBgColor = firstContainer?.responsiveStyles?.backgroundColorOnScroll?.desktop;

  // Merge block-level scroll colors with header settings
  const mergedSettings = {
    ...settings,
    colorOnScroll: blockScrollColors || settings?.colorOnScroll,
    backgroundColorOnScroll: blockScrollBgColor || settings?.backgroundColorOnScroll,
  };

  return (
    <GlobalHeaderClient settings={mergedSettings} reverseHeaderColors={reverseHeaderColors}>
      {blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} />
      ) : (
        <div className="p-4 text-center text-gray-500">
          No header content
        </div>
      )}
    </GlobalHeaderClient>
  );
}
