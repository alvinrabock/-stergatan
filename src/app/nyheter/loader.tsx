'use client';

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';

const NyheterItemSkeleton = () => (
    <div className="animate-pulse group">
        <div className="relative w-full aspect-16/9 mb-4 bg-gray-500 rounded-md" />
        <p className="h-4 bg-gray-500 rounded w-24 mb-2" />
        <div className="h-6 bg-gray-500 rounded w-3/4" />
    </div>
);

const Loader = () => {
    return (
        <div className="w-full py-40 bg-custom_dark_dark_red">
            <MaxWidthWrapper>
                {/* Header Skeleton */}
                <div className="w-full mb-4">
                    <div className="relative w-full h-[30svh] md:h-[50svh] rounded-md overflow-hidden bg-gray-600 animate-pulse" />
                    <div className="block md:hidden mt-4 text-center px-4">
                        <div className="h-10 bg-gray-500 rounded mb-2 mx-auto w-1/3 animate-pulse" />
                        <div className="h-6 bg-gray-500 rounded w-2/3 mx-auto animate-pulse" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-10 text-white">
                    {/* Sidebar Skeleton */}
                    <div className="hidden col-span-1 lg:block col-span-2 p-4 bg-custom_dark_red rounded-lg space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-6 bg-gray-500 rounded w-full animate-pulse"
                            />
                        ))}
                    </div>

                    {/* Content Skeleton */}
                    <div className="col-span-5">
                        {/* Mobile Category Button Skeleton */}
                        <div className="block lg:hidden mb-6">
                            <div className="h-10 w-full bg-gray-500 rounded animate-pulse" />
                        </div>

                        {/* Breadcrumbs Skeleton */}
                        <nav className="mb-4 text-sm text-white/70">
                            <div className="flex gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-4 bg-gray-500 rounded w-20 animate-pulse"
                                    />
                                ))}
                            </div>
                        </nav>

                        {/* Posts Grid Skeleton */}
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <NyheterItemSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    );
}
export default Loader;

