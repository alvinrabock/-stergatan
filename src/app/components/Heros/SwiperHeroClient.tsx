'use client'

import React, { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Post } from '@/types'
import { useUIContext } from '@/providers/ui-context'
import MaxWidthWrapper from '../MaxWidthWrapper'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Media } from '../Media'

type SwiperHeroProps = {
  posts: Post[]
}

const SwiperHeroClient: React.FC<SwiperHeroProps> = ({ posts }) => {
  const { setIsHeroVisible } = useUIContext()

  useEffect(() => {
    setIsHeroVisible(true)
    return () => setIsHeroVisible(false)
  }, [setIsHeroVisible])

  return (
    <div className="relative w-full h-[85svh] min-h-[700px]">

      {/* Custom navigation buttons - positioned to avoid text overlap */}
      <button
        className="swiper-hero-button-prev absolute top-1/3 sm:top-1/2 left-2 sm:left-4 z-30 -translate-y-1/2 bg-white/80 hover:bg-white transition rounded-full w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
        aria-label="Previous slide"
      >
        <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      <button
        className="swiper-hero-button-next absolute top-1/3 sm:top-1/2 right-2 sm:right-4 z-30 -translate-y-1/2 bg-white/80 hover:bg-white transition rounded-full w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center shadow-md"
        aria-label="Next slide"
      >
        <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-gray-700" />
      </button>

      {/* Alternative: Bottom navigation dots for mobile */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:hidden">
        {posts.map((_, index) => (
          <button
            key={index}
            className={`swiper-pagination-bullet w-3 h-3 rounded-full transition-all ${index === 0 ? 'bg-white' : 'bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        loop
        effect="fade"
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation={{
          nextEl: '.swiper-hero-button-next',
          prevEl: '.swiper-hero-button-prev',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        className="w-full h-full"
      >
        {posts.map((post) => {
          const youtubeId = post.youtubeLink?.split('v=')[1]?.split('&')[0]
          const youtubeThumbnail = youtubeId
            ? `https://i.ytimg.com/vi/${youtubeId}/hq720.jpg`
            : null

          return (
            <SwiperSlide key={post.id}>
              <div className="relative w-full h-[90svh] min-h-[700px] bg-cover bg-center">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  {post.heroImage ? (
                    <Media
                      resource={post.heroImage}
                      size="(max-width: 768px) 90vw, 33vw"
                      fill
                      imgClassName="w-full h-full object-cover"
                    />
                  ) : youtubeThumbnail ? (
                    <Image
                      src={youtubeThumbnail}
                      alt="YouTube thumbnail"
                      fill
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800" />
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-custom_dark_dark_red via-custom_dark_dark_red/70 to-custom_dark_dark_red/50 pointer-events-none" />

                {/* Hero content with better mobile spacing */}
                <div className="absolute inset-0 z-60 flex items-end justify-center min-h-[700px] pb-60">
                  <MaxWidthWrapper>
                    <div className="flex flex-col text-center w-full relative z-50 justify-center items-center"> {/* add z-50 */}
                      <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight sm:leading-tight lg:leading-[1.2] drop-shadow-md">
                        {post.title}
                      </h1>

                      <Link href={`/nyhet/${post.slug}`}
                        passHref
                        className="flex flex-row text-regular justify-center items-center gap-1 w-fit rounded-md text-white py-3 px-4 border !border-slate-400 border-input bg-transparent hover:bg-accent/10 fill-white outline outline-1 outline-white"
                      >

                        {youtubeId ? 'Titta på video' : 'Läs mer'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                      </Link>

                    </div>
                  </MaxWidthWrapper>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default SwiperHeroClient