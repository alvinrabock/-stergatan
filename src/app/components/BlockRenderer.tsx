/**
 * Block Renderer
 *
 * Main component for rendering Frontspace CMS blocks
 * Supports all block types with responsive styles, nested children, and visibility
 */

import React from 'react'
import { generateBlockCSS, generateVisibilityCSS, isHiddenOnAllDevices, type BlockVisibility } from '@/lib/block-utils'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
  visibility?: BlockVisibility
}

interface BlockRendererProps {
  blocks: Block[]
}

/**
 * Main renderer component - renders an array of blocks
 */
export async function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {await Promise.all(blocks.map(async (block) => (
        <BlockComponent key={block.id} block={block} />
      )))}
    </>
  )
}

/**
 * Individual block component - routes to specific block type
 */
async function BlockComponent({ block }: { block: Block }) {
  // Skip rendering entirely if hidden on all devices
  if (isHiddenOnAllDevices(block.visibility)) {
    return null
  }

  // Use the block ID directly from CMS (already has 'block-' prefix)
  const blockId = block.id
  const css = generateBlockCSS(blockId, block.styles, block.responsiveStyles)
  const visibilityCSS = generateVisibilityCSS(blockId, block.visibility)
  const combinedCSS = [css, visibilityCSS].filter(Boolean).join('\n')

  return (
    <>
      {combinedCSS && <style key={`style-${blockId}`} dangerouslySetInnerHTML={{ __html: combinedCSS }} />}
      {await renderBlock(block, blockId)}
    </>
  )
}

/**
 * Render specific block type
 */
async function renderBlock(block: Block, blockId: string) {
  switch (block.type) {
    case 'container': {
      const { default: ContainerBlock } = await import('@/app/components/blocks/ContainerBlock')
      return <ContainerBlock block={block} blockId={blockId} />
    }

    case 'text': {
      const { default: TextBlock } = await import('@/app/components/blocks/TextBlock')
      return <TextBlock block={block} blockId={blockId} />
    }

    case 'image': {
      const { default: ImageBlock } = await import('@/app/components/blocks/ImageBlock')
      return <ImageBlock block={block} blockId={blockId} />
    }

    case 'button': {
      const { default: ButtonBlock } = await import('@/app/components/blocks/ButtonBlock')
      return <ButtonBlock block={block} blockId={blockId} />
    }

    case 'accordion': {
      const { default: AccordionBlock } = await import('@/app/components/blocks/AccordionBlock')
      return <AccordionBlock block={block} blockId={blockId} />
    }

    case 'spacer': {
      const { default: SpacerBlock } = await import('@/app/components/blocks/SpacerBlock')
      return <SpacerBlock blockId={blockId} />
    }

    case 'divider': {
      const { default: DividerBlock } = await import('@/app/components/blocks/DividerBlock')
      return <DividerBlock blockId={blockId} />
    }

    case 'form': {
      const { default: FormBlock } = await import('@/blocks/FormBlock/Component')
      return <FormBlock block={block} blockId={blockId} />
    }

    case 'textarea': {
      const { default: TextareaBlock } = await import('@/app/components/blocks/TextareaBlock')
      return <TextareaBlock block={block} blockId={blockId} />
    }

    case 'menu': {
      const { default: MenuBlock } = await import('@/app/components/blocks/MenuBlock')
      return <MenuBlock block={block} blockId={blockId} />
    }

    case 'map':
      return <MapBlockRenderer block={block} blockId={blockId} />

    case 'custom': {
      const { default: CustomComponentBlock } = await import('@/app/components/blocks/CustomComponentBlock')
      return <CustomComponentBlock block={block} blockId={blockId} />
    }

    case 'post-list': {
      const { default: PostListBlock } = await import('@/app/components/blocks/PostListBlock')
      return <PostListBlock block={block} blockId={blockId} />
    }

    case 'video': {
      const { default: VideoBlock } = await import('@/app/components/blocks/VideoBlock')
      return <VideoBlock block={block} blockId={blockId} />
    }

    default:
      console.warn(`Unknown block type: ${block.type}`)
      return null
  }
}

/**
 * Map Block - renders interactive Leaflet map with markers
 * Supports width and height from block.content for dimension control
 */
async function MapBlockRenderer({ block, blockId }: { block: Block; blockId: string }) {
  const content = block.content || {}
  const markers = content.markers || []
  const zoom = content.zoom || 10
  const width = content.width
  const height = content.height
  const tileProvider = content.tileProvider || 'openstreetmap'

  // Dynamically import MapBlock to avoid tainting this module with 'use client'
  const { default: MapBlock } = await import('@/app/components/blocks/MapBlockWrapper')

  return <MapBlock id={blockId} markers={markers} zoom={zoom} width={width} height={height} tileProvider={tileProvider} className={`map-block ${blockId}`} />
}

