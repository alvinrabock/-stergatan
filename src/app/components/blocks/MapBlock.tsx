'use client'

import dynamic from 'next/dynamic'

// Dynamically import Map component (client-side only)
const Map = dynamic(() => import('@/app/components/Map'), { ssr: false })

interface Marker {
  lat: number
  lng: number
  title: string
  isCenter?: boolean
}

interface MapBlockProps {
  id: string
  markers: Marker[]
  zoom?: number
  width?: string
  height?: string
  tileProvider?: string
  className?: string
}

export default function MapBlock({ id, markers, zoom = 10, width, height, tileProvider = 'openstreetmap', className }: MapBlockProps) {
  if (markers.length === 0) {
    return (
      <div id={id} className={className} style={{ padding: '20px', textAlign: 'center', border: '1px dashed #ccc' }}>
        <p>Map: No markers defined</p>
      </div>
    )
  }

  return <Map id={id} markers={markers} zoom={zoom} width={width} height={height} tileProvider={tileProvider} className={className} />
}
