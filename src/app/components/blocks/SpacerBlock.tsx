/**
 * Spacer Block Component
 *
 * Renders vertical spacing
 * Height is controlled by block styles (height property)
 */

import React from 'react'

interface SpacerBlockProps {
  blockId: string
}

export default function SpacerBlock({ blockId }: SpacerBlockProps) {
  return (
    <div
      className={`spacer-block block-${blockId}`}
      data-block-id={blockId}
    />
  )
}
