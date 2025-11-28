'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import { Post } from '@/types';
import NyheterItem from '@/app/components/Nyheter/nyheterItem';
import { Button } from './ui/Button';
import Link from 'next/link';

interface SenasteNyheterProps {
    maxPosts?: number;
}

// Skeleton component for individual slides
const SkeletonSlide = () => (
    <div className="h-full bg-gray-700/30 rounded-lg animate-pulse">
        <div className="aspect-video bg-gray-600/50 rounded-t-lg mb-4"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600/50 rounded w-1/2"></div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-600/50 rounded"></div>
                <div className="h-3 bg-gray-600/50 rounded w-4/5"></div>
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

export default function SenasteNyheter({ maxPosts = 3 }: SenasteNyheterProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Refs for navigation
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const slidesPerView = useResponsiveSlides();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);

                // Fetch posts from API
                const response = await fetch(`/api/posts?limit=${maxPosts}`);

                if (!response.ok) {
                    console.error('API response not OK:', response.status, response.statusText);
                    setError('Kunde inte ladda nyheter.');
                    setPosts([]);
                    setIsLoading(false);
                    return;
                }

                const data = await response.json();

                if (!data.success || !data.posts) {
                    setError('Kunde inte ladda nyheter.');
                    setPosts([]);
                    return;
                }

                setPosts(data.posts);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Kunde inte ladda nyheter.');
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [maxPosts]);

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
        <div className="bg-custom_dark_dark_red flex flex-col gap-4 px-4 sm:px-6 w-full py-8 relative overflow-hidden max-w-[1500px] mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-left text-white">
                Senaste nyheter
            </h2>

            {error ? (
                <div className="bg-red-500 text-white p-4 rounded-md text-center">
                    {error}
                </div>
            ) : (
                <>
                    <div className="relative overflow-visible mb-8">
                        {/* Custom Navigation Buttons */}
                        <button
                            ref={prevRef}
                            className="swiper-news-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-0"
                            aria-label="Föregående"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        <button
                            ref={nextRef}
                            className="swiper-news-button-next absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-0"
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
                                    <SwiperSlide key={index} className="!h-auto">
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
                </>
            )}
        </div>
    );
}
