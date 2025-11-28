/**
 * Video Block Component
 *
 * Renders video iframes from Frontspace CMS
 * Supports YouTube, Vimeo, and other iframe-based video embeds
 */

import React from 'react'

export interface Block {
  id: string
  type: string
  content: any
  styles?: Record<string, any>
  responsiveStyles?: Record<string, Record<string, any>>
}

interface VideoBlockProps {
  block: Block
  blockId: string
}

// Helper function to convert YouTube watch URLs to embed URLs
function convertToEmbedUrl(url: string): string {
  if (!url) return url

  // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const youtubeWatchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (youtubeWatchMatch) {
    return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}`
  }

  // Vimeo URL: https://vimeo.com/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // Already an embed URL or other iframe-compatible URL
  return url
}

export default function VideoBlock({ block, blockId }: VideoBlockProps) {
  console.log('VideoBlock received:', { block, blockId })
  console.log('VideoBlock content:', JSON.stringify(block.content, null, 2))

  // Try different possible field names for the video URL
  const {
    iframeUrl,
    src,
    url,
    videoUrl,
    embedUrl,
    externalUrl,
    allowFullScreen = true,
    autoplay = false,
    loop = false,
    muted = false,
    controls = true,
    width,
    height
  } = block.content

  // Use the first available URL field
  const rawVideoSrc = iframeUrl || embedUrl || externalUrl || src || url || videoUrl

  if (!rawVideoSrc) {
    console.warn('VideoBlock: No video URL found in content. Available fields:', Object.keys(block.content))
    return null
  }

  // Convert to embed URL if needed
  const videoSrc = convertToEmbedUrl(rawVideoSrc)

  console.log('VideoBlock: Raw URL:', rawVideoSrc)
  console.log('VideoBlock: Embed URL:', videoSrc)

  // Add URL parameters for YouTube/Vimeo if needed
  let finalVideoSrc = videoSrc
  if (videoSrc.includes('youtube.com/embed/')) {
    const params = new URLSearchParams()
    if (autoplay) params.set('autoplay', '1')
    if (loop) params.set('loop', '1')
    if (muted) params.set('mute', '1')
    if (!controls) params.set('controls', '0')

    const paramString = params.toString()
    if (paramString) {
      finalVideoSrc = `${videoSrc}?${paramString}`
    }
  }

  return (
    <div
      className={`video-block block-${blockId}`}
      data-block-id={blockId}
    >
      <div className="relative w-full aspect-[16/9]">
        <iframe
          src={finalVideoSrc}
          width={width || "100%"}
          height={height || "100%"}
          loading="lazy"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={allowFullScreen ?? undefined}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
