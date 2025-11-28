/**
 * Map Component - Stub
 *
 * Placeholder for Leaflet map component.
 * To enable maps, install leaflet: npm install leaflet @types/leaflet
 */

'use client'

interface Marker {
  lat: number
  lng: number
  title: string
  isCenter?: boolean
}

interface MapProps {
  markers?: Marker[]
  zoom?: number
  id?: string
  className?: string
  width?: string | number
  height?: string | number
  tileProvider?: string
}

export default function Map({ markers = [], id, className, width, height }: MapProps) {
  const mapWidth = typeof width === 'number' ? `${width}px` : width || '100%'
  const mapHeight = typeof height === 'number' ? `${height}px` : height || '400px'

  return (
    <div
      id={id}
      className={`map-placeholder ${className || ''}`}
      style={{
        width: mapWidth,
        height: mapHeight,
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        color: '#6b7280'
      }}
    >
      <div className="text-center p-4">
        <p className="font-medium">Map Component</p>
        <p className="text-sm mt-2">
          {markers.length > 0 ? `${markers.length} marker(s)` : 'No markers'}
        </p>
        <p className="text-xs mt-1 opacity-75">
          Install leaflet to enable maps
        </p>
      </div>
    </div>
  )
}
