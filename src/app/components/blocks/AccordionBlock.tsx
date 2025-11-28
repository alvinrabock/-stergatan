'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionBlockProps {
  block: {
    id: string;
    content: {
      items?: AccordionItem[];
      dividerColor?: string;
      titleBackgroundColor?: string;
      titleTextColor?: string;
      contentBackgroundColor?: string;
      contentTextColor?: string;
      iconColor?: string;
    };
    styles?: Record<string, any>;
  };
  blockId: string;
}

export default function AccordionBlock({ block, blockId }: AccordionBlockProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const items = block.content.items || [];
  const {
    dividerColor = '#e5e7eb',
    titleBackgroundColor = 'transparent',
    titleTextColor,
    contentBackgroundColor = 'transparent',
    contentTextColor = '#4b5563',
    iconColor,
  } = block.content;

  return (
    <div className={`accordion-block block-${blockId}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            style={{
              borderBottom: isLast ? 'none' : `1px solid ${dividerColor}`,
            }}
          >
            {/* Title Button */}
            <button
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                textAlign: 'left',
                backgroundColor: titleBackgroundColor,
                color: titleTextColor || 'inherit',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (titleBackgroundColor === 'transparent') {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = titleBackgroundColor;
              }}
            >
              <span style={{ fontWeight: 500 }}>{item.title}</span>
              {isOpen ? (
                <ChevronDown
                  style={{
                    width: '20px',
                    height: '20px',
                    color: iconColor || titleTextColor || 'inherit',
                    transition: 'transform 0.3s',
                    flexShrink: 0,
                    marginLeft: '12px',
                  }}
                />
              ) : (
                <ChevronRight
                  style={{
                    width: '20px',
                    height: '20px',
                    color: iconColor || titleTextColor || 'inherit',
                    transition: 'transform 0.3s',
                    flexShrink: 0,
                    marginLeft: '12px',
                  }}
                />
              )}
            </button>

            {/* Content */}
            <div
              style={{
                maxHeight: isOpen ? '2000px' : '0px',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: contentBackgroundColor,
              }}
            >
              <div
                style={{
                  padding: '16px',
                  paddingTop: '0',
                  color: contentTextColor,
                }}
                className="[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:first-child]:mt-0 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mt-3 [&_h4]:mb-2 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:mb-3 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:mb-3 [&_ol]:pl-6 [&_ol]:list-decimal [&_li]:mb-1 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
