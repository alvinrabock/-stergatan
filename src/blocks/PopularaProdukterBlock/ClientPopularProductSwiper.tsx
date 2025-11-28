'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import React from 'react';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import ArrowIcon from '@/app/components/Icons/ArrowIcon';
import ProductCard from '@/app/components/neh-shop/ProductCard';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Navigation,
  Mousewheel,
  Keyboard,
  FreeMode,
  Pagination,
} from 'swiper/modules';

import { Product } from '@/types';

interface ClientPopularProductSwiperProps {
  products: Product[];
}

const ClientPopularProductSwiper: React.FC<ClientPopularProductSwiperProps> = ({ products }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSkeletonCount = () => {
    if (windowWidth >= 1224) return 3;
    if (windowWidth >= 768) return 2;
    return 1;
  };

  const skeletonCount = getSkeletonCount();

  return (
    <div className="w-full py-10 bg-custom_dark_red text-white overflow-hidden">
      <MaxWidthWrapper>
        <div className="flex flex-row gap-4 items-center mb-10">
          <h2 className="text-4xl uppercase font-semibold">Bästsäljare från shoppen</h2>
          <Link
            className="flex flex-row gap-2 items-center"
            target="_blank"
            href="https://ostersifshop.se/"
          >
            Till Östershoppen <ArrowIcon className="w-4 fill-white" />
          </Link>
        </div>

        <div className="mb-8">
          <Swiper
            spaceBetween={30}
            navigation={{
              nextEl: '.swiper-slider-button-next',
              prevEl: '.swiper-slider-button-prev',
            }}
            style={{ overflow: 'visible' }}
            mousewheel={{ enabled: true, forceToAxis: true, sensitivity: 1 }}
            keyboard={{ enabled: true }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
            }}
            modules={[Navigation, Mousewheel, Keyboard, FreeMode, Pagination]}
            className={`mySwiper ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            breakpoints={{
              1224: { slidesPerView: 4 },
              768: { slidesPerView: 2 },
              300: { slidesPerView: 2.2 },
            }}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            {products.length === 0
              ? Array.from({ length: skeletonCount }).map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="animate-pulse bg-gray-200 h-[350px] rounded-md overflow-hidden">
                    <div className="h-3/4 bg-gray-300"></div>
                    <div className="h-1/4 p-4">
                      <div className="w-3/4 h-4 bg-gray-300 mb-2"></div>
                      <div className="w-1/2 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
              : products.map((product) => (
                <SwiperSlide key={product.ID}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Bullet container */}
          <div className="swiper-pagination-custom mt-6 flex justify-center gap-2" />
        </div>

        <div className="flex justify-between">
          <button className="swiper-slider-button-prev w-6 h-6 flex items-center justify-center rounded-full hover:text-gray-300" />
          <button className="swiper-slider-button-next w-6 h-6 flex items-center justify-center rounded-full hover:text-gray-300" />
        </div>
      </MaxWidthWrapper>

      {/* Custom Swiper bullet styles */}
      <style jsx global>{`
  .swiper-pagination-custom .swiper-pagination-bullet {
    width: 12px;
    margin-top: 40px;
    height: 12px;
    background-color: white;
    opacity: 0.4;
    border-radius: 9999px;
    transition: all 0.3s ease-in-out;
  }
  .swiper-pagination-custom .swiper-pagination-bullet-active {
    opacity: 1;
    background-color: white;
    transform: scale(1.25);
  }
`}</style>

    </div>
  );
};

export default ClientPopularProductSwiper;
