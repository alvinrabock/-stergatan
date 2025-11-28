'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { CardBlock } from '@/types';
import Link from 'next/link';
import { Media } from '@/app/components/Media/index';
import { Button } from '@/app/components/ui/Button';

function resolveLinkHref(link: CardBlock['link']): string {
    if (!link) return '#';

    if (link.type === 'custom' && link.url) {
        return link.url;
    }

    if (
        link.type === 'reference' &&
        link.reference &&
        typeof link.reference === 'object' &&
        'relationTo' in link.reference &&
        'value' in link.reference
    ) {
        const slug = typeof link.reference.value === 'string'
            ? link.reference.value
            : link.reference.value?.slug;

        if (!slug) return '#';

        switch (link.reference.relationTo) {
            case 'pages':
                return `/${slug}`;
            case 'posts':
                return `/posts/${slug}`;
            default:
                return '#';
        }
    }

    return '#';
}

export const CardBlockComponent: React.FC<CardBlock> = ({
    layout = 'background',
    image,
    title,
    description,
    link,
    imageAspectRatio = '16/9',
}) => {
    const imageObj = typeof image === 'string' ? null : image;
    
    // Check if there's content to display (title or description)
    const hasContent = title || description;

    if (layout === 'background') {
        const href = resolveLinkHref(link);

        const containerClasses = cn(
            'relative rounded-lg overflow-hidden flex flex-col justify-end text-white',
            '',
            // Square aspect ratio for background layout
            'aspect-square',
            'p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8',
            'w-full box-border',
            link ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-300' : ''
        );

        const CardContent = (
            <div className={containerClasses}>
                {/* Background media */}
                {imageObj && (
                    <>
                        <Media
                            resource={imageObj}
                            fill
                            imgClassName="object-cover absolute inset-0 z-0 w-full h-full"
                        />
                        {/* Conditional gradient overlay - only show if there's content */}
                        {hasContent && (
                            <div className="absolute inset-0 w-full h-full z-1 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        )}
                    </>
                )}

                {/* Foreground content - only render if there's content */}
                {hasContent && (
                    <div className="relative z-10 max-h-full overflow-hidden">
                        {title && (
                            <h3 className={cn(
                                'font-bold text-white leading-tight mb-1',
                                'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
                                'break-words hyphens-auto'
                            )}>
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p className={cn(
                                'text-white/90 leading-relaxed',
                                'text-sm sm:text-sm md:text-base lg:text-base xl:text-lg',
                                'break-words hyphens-auto',
                                'line-clamp-1 sm:line-clamp-2 md:line-clamp-2 lg:line-clamp-3'
                            )}>
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );

        return link ? (
            <Link
                href={href}
                target={link?.newTab ? '_blank' : undefined}
                rel={link?.newTab ? 'noopener noreferrer' : undefined}
                className="w-full block"
            >
                {CardContent}
            </Link>
        ) : CardContent;
    }

    // Stacked layout
    const stackedHref = resolveLinkHref(link);

    return (
        <div className="relative overflow-hidden shadow-lg group transition-transform">
            {/* Image */}
            <div className={cn(
                'relative overflow-hidden',
                // Responsive aspect ratios: 16/9 on mobile, square on desktop  
                'aspect-video'
            )}>
                {imageObj && (
                    <Media
                        resource={imageObj}
                        fill={imageAspectRatio !== 'auto'}
                        imgClassName="object-cover w-full h-full rounded-md"
                    />
                )}
            </div>

            {/* Content */}
            <div className='pt-4'>
                {title && (
                    <h3 className={cn(
                        'font-bold text-white transition-colors leading-tight mb-2',
                        'text-base sm:text-lg md:text-xl lg:text-2xl',
                        'break-words hyphens-auto'
                    )}>
                        {title}
                    </h3>
                )}
                {description && (
                    <p className={cn(
                        'text-white/80 leading-relaxed mb-3',
                        'text-sm sm:text-base',
                        'break-words hyphens-auto'
                    )}>
                        {description}
                    </p>
                )}
                {link && (
                    <Button 
                        asChild 
                        variant="outline" 
                        className="text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4 text-white"
                    >
                        <Link
                            href={stackedHref}
                            target={link?.newTab ? '_blank' : undefined}
                            rel={link?.newTab ? 'noopener noreferrer' : undefined}
                        >
                            {link.label || 'Läs mer'}
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
};