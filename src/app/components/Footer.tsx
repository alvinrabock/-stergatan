/**
 * Footer Component
 * Renders footer from Frontspace CMS using BlockRenderer
 */

import { BlockRenderer } from './BlockRenderer';
import type { Footer as FooterType } from '@/lib/frontspace/types';

interface FooterProps {
  footer: FooterType;
}

export function Footer({ footer }: FooterProps) {
  const blocks = footer.content?.blocks || [];
  const settings = footer.footerSettings;

  // Apply footer settings from CMS if available
  const footerStyle: React.CSSProperties = {
    backgroundColor: settings?.background || undefined,
    padding: settings?.padding || undefined,
  };

  return (
    <footer style={footerStyle}>
      {blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} />
      ) : (
        <div className="p-4 text-center text-gray-500">
          No footer content
        </div>
      )}
    </footer>
  );
}
