/**
 * Frontspace Block Renderer
 * Simple renderer for Frontspace CMS blocks
 */

import React from 'react'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface BlockRendererProps {
  blocks: Block[]
}

/**
 * Main renderer component - renders an array of blocks
 */
export async function FrontspaceBlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return <div className="p-8 text-center text-gray-500">No content blocks</div>
  }

  return (
    <>
      {blocks.map((block) => (
        <BlockComponent key={block.id} block={block} />
      ))}
    </>
  )
}

/**
 * Individual block component - routes to specific block type
 */
function BlockComponent({ block }: { block: Block }) {
  const blockId = block.id

  return (
    <div id={blockId} data-block-type={block.type} className="frontspace-block">
      {renderBlock(block, blockId)}
    </div>
  )
}

/**
 * Render specific block type
 */
function renderBlock(block: Block, blockId: string) {
  switch (block.type) {
    case 'container':
      return <ContainerBlock block={block} blockId={blockId} />

    case 'text':
      return <TextBlock block={block} blockId={blockId} />

    case 'image':
      return <ImageBlock block={block} blockId={blockId} />

    case 'button':
      return <ButtonBlock block={block} blockId={blockId} />

    default:
      console.warn(`Unknown Frontspace block type: ${block.type}`)
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            Unknown block type: <code>{block.type}</code>
          </p>
          <pre className="text-xs mt-2 text-gray-600">
            {JSON.stringify(block.content, null, 2)}
          </pre>
        </div>
      )
  }
}

/**
 * Container Block - holds child blocks
 */
function ContainerBlock({ block, blockId }: { block: Block; blockId: string }) {
  const content = block.content || {}
  const children = content.children || []

  return (
    <div className={`container-block block-${blockId}`}>
      {children.length > 0 && (
        <>
          {children.map((childBlock: Block) => (
            <BlockComponent key={childBlock.id} block={childBlock} />
          ))}
        </>
      )}
    </div>
  )
}

/**
 * Text Block - rich text content
 */
function TextBlock({ block, blockId }: { block: Block; blockId: string }) {
  const text = block.content?.text || ''

  return (
    <div
      className={`text-block block-${blockId}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

/**
 * Image Block - renders images
 */
function ImageBlock({ block, blockId }: { block: Block; blockId: string }) {
  const { src, alt, width, height } = block.content || {}

  if (!src) return null

  return (
    <div className={`image-block block-${blockId}`}>
      <img
        src={src}
        alt={alt || ''}
        style={{
          width: width || '100%',
          height: height || 'auto',
        }}
      />
    </div>
  )
}

/**
 * Button Block - clickable buttons with links
 */
function ButtonBlock({ block, blockId }: { block: Block; blockId: string }) {
  const { text, link } = block.content || {}

  if (!link?.url) {
    return (
      <button className={`button-block block-${blockId}`} type="button">
        {text || 'Button'}
      </button>
    )
  }

  return (
    <a href={link.url} className={`button-block block-${blockId}`}>
      {text || 'Button'}
    </a>
  )
}
