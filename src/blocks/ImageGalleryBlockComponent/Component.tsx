'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'
import 'swiper/css/keyboard'
import 'swiper/css/mousewheel'
import 'swiper/css/autoplay'

import {
  Navigation,
  Mousewheel,
  Keyboard,
  FreeMode,
  Autoplay, // 👈 import this
} from 'swiper/modules'

import { ImageGalleryBlock } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Media } from '@/app/components/Media/index'

export const ImageGalleryBlockComponent = ({ images }: ImageGalleryBlock) => {
  const [isDragging, setIsDragging] = useState(false)

  const hasOnlyOne = images.length === 1
  if (hasOnlyOne) {
    const imgObj = typeof images[0].image === 'string' ? null : images[0].image
    return (
      <div className="w-full my-8">
        <div className="relative w-full aspect-[16/9]">
          {imgObj && (
            <Media
              resource={imgObj}
              imgClassName="object-cover w-full h-full "
            />
          )}
        </div>
        {images[0].bildtext && (
          <p className="mt-2 text-center text-sm text-gray-400">{images[0].bildtext}</p>
        )}
      </div>
    )
  }

  return (
    <div className="w-full my-8 relative">
      {/* Custom Navigation */}
      <button
        className="swiper-slider-button-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 p-2 bg-white shadow rounded-full disabled:opacity-0"
        aria-label="Previous Slide"
      >
        <ChevronLeft />
      </button>
      <button
        className="swiper-slider-button-next absolute right-2 top-1/2 z-10 -translate-y-1/2 p-2 bg-white shadow rounded-full disabled:opacity-0"
        aria-label="Next Slide"
      >
        <ChevronRight />
      </button>

      <Swiper
        spaceBetween={16}
        navigation={{
          nextEl: '.swiper-slider-button-next',
          prevEl: '.swiper-slider-button-prev',
        }}
        mousewheel={{ enabled: true, forceToAxis: true }}
        keyboard={{ enabled: true }}
        autoplay={{
          delay: 3000, // 👈 change this to your desired interval (in ms)
          disableOnInteraction: false, // 👈 keeps autoplay running after manual swipe
        }}
        modules={[Navigation, Mousewheel, Keyboard, FreeMode, Autoplay]} // 👈 add Autoplay here
        className={`mySwiper ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        breakpoints={{
          500: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1224: { slidesPerView: 3 },
        }}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        {images.map(({ image, bildtext }, index) => {
          const imgObj = typeof image === 'string' ? null : image
          return (
            <SwiperSlide key={index}>
              <div className="relative w-full aspect-[10/9] overflow-hidden rounded-md overflow-hidden">
                {imgObj && (
                  <Media
                    resource={imgObj}
                    fill
                    imgClassName="object-cover"
                  />
                )}
              </div>
              {bildtext && (
                <p className="mt-2 text-center text-sm text-gray-400">{bildtext}</p>
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
