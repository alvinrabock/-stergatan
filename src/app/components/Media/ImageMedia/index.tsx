'use client'

import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import React from 'react'
import type { Props as MediaProps } from '../types'
import { cssVariables } from '@/cssVariables'
import { getServerSideURL } from '@/utils/getURL'
import { cn } from '@/lib/utils'
import { MediaBlock } from '@/types'

const { breakpoints } = cssVariables

// A base64 encoded image to use as a placeholder while the image is loading
const placeholderBlur =
    'data:image/png;base64,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'

// Helper function to remove conflicting CSS classes when CMS styling is present
const getOverrideClassName = (originalClassName: string | undefined, styling: Partial<MediaBlock>) => {
    if (!styling || !originalClassName) return originalClassName

    let className = originalClassName

    // Remove border radius classes if CMS has border radius settings
    if (styling.borderRadiusValue !== undefined || styling.enableBorderRadiusAllSides) {
        className = className
            .replace(/\brounded(-\w+)?\b/g, '') // Remove Tailwind rounded classes
            .replace(/\bborder-radius-\w+\b/g, '') // Remove custom border radius classes
    }

    // Remove padding classes if CMS has padding settings
    if (styling.paddingValue !== undefined || styling.enablePaddingAllSides) {
        className = className
            .replace(/\bp([tblr]?)-\w+\b/g, '') // Remove Tailwind padding classes
    }

    // Remove margin classes if CMS has margin settings
    if (styling.marginValue !== undefined || styling.enableMarginAllSides) {
        className = className
            .replace(/\bm([tblr]?)-\w+\b/g, '') // Remove Tailwind margin classes
    }

    // Clean up extra spaces
    return className.replace(/\s+/g, ' ').trim()
}

// Helper function to build CSS styles from CMS styling fields
const buildInlineStyles = (styling: Partial<MediaBlock>) => {
    if (!styling) return {}

    const styles: Record<string, string | number> = {}

    // Background and text colors
    if (styling.backgroundColor) {
        styles.backgroundColor = styling.backgroundColor
    }
    if (styling.textColor) {
        styles.color = styling.textColor
    }

    // Width and height
    if (styling.widthValue) {
        const unit = styling.widthUnit === 'percent' ? '%' : styling.widthUnit || 'px'
        styles.width = `${styling.widthValue}${unit}`
    }
    if (styling.heightValue && styling.heightValue !== 'auto') {
        const unit = styling.heightUnit === 'percent' ? '%' : styling.heightUnit || 'px'
        styles.height = `${styling.heightValue}${unit}`
    }

    // Padding
    if (styling.enablePaddingAllSides) {
        if (styling.paddingTop) styles.paddingTop = `${styling.paddingTop}px`
        if (styling.paddingRight) styles.paddingRight = `${styling.paddingRight}px`
        if (styling.paddingBottom) styles.paddingBottom = `${styling.paddingBottom}px`
        if (styling.paddingLeft) styles.paddingLeft = `${styling.paddingLeft}px`
    } else if (styling.paddingValue) {
        const unit = styling.paddingUnit === 'percent' ? '%' : styling.paddingUnit || 'px'
        styles.padding = `${styling.paddingValue}${unit}`
    }

    // Margin
    if (styling.enableMarginAllSides) {
        if (styling.marginTop) styles.marginTop = `${styling.marginTop}px`
        if (styling.marginRight) styles.marginRight = `${styling.marginRight}px`
        if (styling.marginBottom) styles.marginBottom = `${styling.marginBottom}px`
        if (styling.marginLeft) styles.marginLeft = `${styling.marginLeft}px`
    } else if (styling.marginValue) {
        const unit = styling.marginUnit === 'percent' ? '%' : styling.marginUnit || 'px'
        styles.margin = `${styling.marginValue}${unit}`
    }

    // Border radius - override any default rounded styles
    if (styling.enableBorderRadiusAllSides) {
        // When individual sides are set, clear any default border radius first
        styles.borderRadius = '0'
        if (styling.borderRadiusTopLeft) {
            styles.borderTopLeftRadius = `${styling.borderRadiusTopLeft}px`
        }
        if (styling.borderRadiusTopRight) {
            styles.borderTopRightRadius = `${styling.borderRadiusTopRight}px`
        }
        if (styling.borderRadiusBottomRight) {
            styles.borderBottomRightRadius = `${styling.borderRadiusBottomRight}px`
        }
        if (styling.borderRadiusBottomLeft) {
            styles.borderBottomLeftRadius = `${styling.borderRadiusBottomLeft}px`
        }
    } else if (styling.borderRadiusValue) {
        const unit = styling.borderRadiusUnit === 'percent' ? '%' : styling.borderRadiusUnit || 'px'
        styles.borderRadius = `${styling.borderRadiusValue}${unit}`
    } else if (styling.borderRadiusValue === '0' || styling.borderRadiusValue === '') {
        // Explicitly remove border radius if set to 0 or empty
        styles.borderRadius = '0'
    }

    // Position and layout
    if (styling.position && styling.position !== 'static') {
        styles.position = styling.position
    }
    if (styling.overflow && styling.overflow !== 'visible') {
        styles.overflow = styling.overflow
    }
    if (styling.zIndex) {
        styles.zIndex = styling.zIndex
    }

    return styles
}

// Update your MediaProps interface to include styling
interface ExtendedMediaProps extends MediaProps {
    styling?: Partial<MediaBlock> // Use proper MediaBlock type
}

export const ImageMedia: React.FC<ExtendedMediaProps> = (props) => {
    const {
        alt: altFromProps,
        fill,
        imgClassName,
        priority,
        resource,
        size: sizeFromProps,
        src: srcFromProps,
        loading: loadingFromProps,
        styling, // Add this
    } = props

    let width: number | undefined
    let height: number | undefined
    let alt = altFromProps
    let src: StaticImageData | string = srcFromProps || ''

    if (!src && resource && typeof resource === 'object') {
        const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

        // Only set dimensions if they are valid numbers, otherwise return null to hide the image
        if (fullWidth && fullHeight && typeof fullWidth === 'number' && typeof fullHeight === 'number') {
            width = fullWidth
            height = fullHeight
            alt = altFromResource || ''

            const cacheTag = resource.updatedAt

            src = `${getServerSideURL()}${url}?${cacheTag}`
        } else {
            // Return null to prevent rendering images with invalid dimensions
            return null
        }
    }

    const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

    // NOTE: this is used by the browser to determine which image to download at different screen sizes
    const sizes = sizeFromProps
        ? sizeFromProps
        : Object.entries(breakpoints)
            .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
            .join(', ')

    // Build inline styles from CMS styling fields
    const inlineStyles = buildInlineStyles(styling || {})
    
    // Get className with conflicting classes removed
    const cleanedClassName = getOverrideClassName(imgClassName, styling || {})
    
    // Check if any styling is actually applied
    const hasStyling = styling && Object.keys(inlineStyles).length > 0

    return (
        <picture 
            style={{
                ...inlineStyles,
                // Only apply containment styles when CMS styling is present
                ...(hasStyling && {
                    overflow: 'hidden',
                    display: 'block',
                    position: 'relative',
                    width: inlineStyles.width || 'auto',
                    height: inlineStyles.height || 'auto',
                }),
            }}
        >
            <NextImage
                alt={alt || ''}
                className={cn(cleanedClassName)}
                fill={fill}
                height={!fill ? height : undefined}
                placeholder="blur"
                blurDataURL={placeholderBlur}
                priority={priority}
                quality={100}
                loading={loading}
                sizes={sizes}
                src={src}
                width={!fill ? width : undefined}
                style={{
                    // Apply border radius to match container (only when styling exists)
                    ...(hasStyling && {
                        borderRadius: inlineStyles.borderRadius || undefined,
                        borderTopLeftRadius: inlineStyles.borderTopLeftRadius || undefined,
                        borderTopRightRadius: inlineStyles.borderTopRightRadius || undefined,
                        borderBottomRightRadius: inlineStyles.borderBottomRightRadius || undefined,
                        borderBottomLeftRadius: inlineStyles.borderBottomLeftRadius || undefined,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block',
                    }),
                }}
            />
        </picture>
    )
}