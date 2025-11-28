'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface GalleryImage {
  id: string
  url: string
  name: string
}

interface GalleryBlockProps {
  images: GalleryImage[]
  displayMode: 'grid' | 'swiper'
  className?: string
}

export function GalleryBlock({ images, displayMode, className }: GalleryBlockProps) {
  if (!images || images.length === 0) {
    return null
  }

  // Grid Mode
  if (displayMode === 'grid') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 my-4 ${className || ''}`}>
        {images.map((img, index) => (
          <div key={img.id || index} className="aspect-square overflow-hidden rounded-lg">
            <img
              src={img.url}
              alt={img.name || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    )
  }

  // Swiper/Carousel Mode
  return (
    <div className={`gallery-swiper my-4 ${className || ''}`}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={img.id || index}>
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={img.url}
                alt={img.name || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default GalleryBlock
