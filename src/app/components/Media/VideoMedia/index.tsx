'use client'

import React, { useEffect, useRef } from 'react'
import type { Props as MediaProps } from '../types'
import { getServerSideURL } from '@/utils/getURL'
import { cn } from '@/lib/utils'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // Handle the suspended video scenario (you might want to show fallback here)
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename } = resource

    return (
      <video
        autoPlay
        className={cn(videoClassName, 'absolute inset-0 w-full h-full object-cover')}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={`${getServerSideURL()}/api/media/file/${filename}`} />
      </video>
    )
  }

  return null
}