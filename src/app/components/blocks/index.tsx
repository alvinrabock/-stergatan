/**
 * Blocks Index
 *
 * Central export point for all Frontspace block components.
 * Import blocks from here for cleaner imports throughout the app.
 *
 * Usage:
 * import { AccordionBlock, TextBlock, ImageBlock } from '@/components/blocks'
 */

// Basic block types
export { default as TextBlock } from './TextBlock'
export { default as ImageBlock } from './ImageBlock'
export { default as ButtonBlock } from './ButtonBlock'
export { default as ContainerBlock } from './ContainerBlock'
export { default as SpacerBlock } from './SpacerBlock'
export { default as DividerBlock } from './DividerBlock'
export { default as TextareaBlock } from './TextareaBlock'

// Complex block types
export { default as AccordionBlock } from './AccordionBlock'
export { default as FormBlock } from './FormBlock'
export { default as MenuBlock } from './MenuBlock'
export { default as MapBlockWrapper } from './MapBlockWrapper'
export { default as PostListBlock } from './PostListBlock'
export { default as CustomComponentBlock } from './CustomComponentBlock'
