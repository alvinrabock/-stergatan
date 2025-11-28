'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Post } from '@/types';
import NyheterItem from '../Nyheter/nyheterItem';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import type { Swiper as SwiperType } from 'swiper';

export type Props = {
  posts: Post[];
  isLoading?: boolean;
};

// Skeleton component for individual slides
const SkeletonSlide = () => (
  <div className="h-full bg-gray-200 rounded-lg animate-pulse">
    <div className="aspect-video bg-gray-300 rounded-t-lg mb-4"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-4/5"></div>
      </div>
    </div>
  </div>
);

// Hook to get current slides per view based on screen size - matches Swiper breakpoints exactly
const useResponsiveSlides = () => {
  const [slidesPerView, setSlidesPerView] = useState(1.1);

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      // Match the exact breakpoints from Swiper config
      if (width >= 1024) setSlidesPerView(3);
      else if (width >= 768) setSlidesPerView(2.5);
      else if (width >= 500) setSlidesPerView(1.5);
      else setSlidesPerView(1.1); // 320px and up
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  return slidesPerView;
};

export const CollectionArchive: React.FC<Props> = ({ posts, isLoading = false }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const slidesPerView = useResponsiveSlides();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show skeleton during loading or before mount
  const showSkeleton = isLoading || !isMounted || !posts?.length;

  // Generate skeleton slides based on exact responsive slides per view
  const generateSkeletonSlides = () => {
    // Use Math.ceil to handle decimal values like 1.1, 1.5, 2.5
    const numberOfSlides = Math.ceil(slidesPerView);
    return Array.from({ length: numberOfSlides }, (_, index) => (
      <SwiperSlide key={`skeleton-${index}`}>
        <SkeletonSlide />
      </SwiperSlide>
    ));
  };

  return (
    <div className={cn()}>
      <div className="relative overflow-visible mb-8">
        {/* Custom Navigation Buttons */}
        <button
          ref={prevRef}
          className="swiper-played-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-0"
          aria-label="Föregående"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          ref={nextRef}
          className="swiper-played-button-next absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-0"
          aria-label="Nästa"
        >
          <ArrowRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          onBeforeInit={(swiper: SwiperType) => {
            if (typeof swiper.params.navigation !== 'boolean' && swiper.params.navigation) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            320: { slidesPerView: 1.1 },
            500: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3 },
          }}
        >
          {showSkeleton ? (
            generateSkeletonSlides()
          ) : (
            posts.map((post, index) => (
              <SwiperSlide key={index}>
                <div className="h-full text-white">
                  <NyheterItem post={post} />
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>

      <div className="flex justify-start">
        <Link href="/nyheter" className="text-white w-full">
          <Button variant="outline" className="w-full">
            Visa alla nyheter
          </Button>
        </Link>
      </div>
    </div>
  );
};