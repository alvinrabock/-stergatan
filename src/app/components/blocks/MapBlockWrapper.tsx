'use client'

import dynamic from 'next/dynamic'

// Dynamically import MapBlock (client-side only)
// Map component is in app/components/ folder
const MapBlock = dynamic(() => import('@/app/components/Map'), { ssr: false })

export default MapBlock
