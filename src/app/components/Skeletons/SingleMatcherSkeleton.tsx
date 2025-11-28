import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper'

const SingleMatcherSkeleton = () => {
    return (
        <div className="w-full overflow-hidden min-h-screen bg-custom_dark_dark_red">
            {/* Hero Section */}
            <div className="relative flex flex-row items-center justify-center w-full h-[70vh]">
                {/* Content */}
                <div className="relative z-10 text-white w-full px-4 sm:px-0">
                    <MaxWidthWrapper>
                        <div className="flex flex-row items-center justify-center gap-2">
                            {/* Home Team */}
                            <div className="flex flex-col-reverse gap-1 md:flex-row items-center justify-center text-center md:text-right md:justify-end flex-1">
                                <div>
                                    <div className="w-16 sm:w-24 md:w-32 lg:w-40 h-4 sm:h-5 md:h-6 lg:h-8 bg-gray-700 animate-pulse mb-1 rounded"></div>
                                    <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-700 animate-pulse rounded mx-auto md:mx-0 md:ml-auto"></div>
                                </div>
                                <div className="w-12 sm:w-20 h-12 sm:h-20 mx-4 relative">
                                    <div className="w-full h-full bg-gray-700 animate-pulse rounded-full"></div>
                                </div>
                            </div>

                            {/* Center Content - Score/Date/Loading */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center justify-center px-6 py-3">
                                    {/* Main content (score or date) */}
                                    <div className="w-20 sm:w-24 h-8 sm:h-12 md:h-16 bg-gray-700 animate-pulse rounded-lg mb-2"></div>

                                    {/* Secondary content (time or match phase) */}
                                    <div className="flex flex-row gap-4 justify-center items-center">
                                        <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-700 animate-pulse rounded"></div>
                                        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-700 animate-pulse rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col gap-2 md:flex-row items-center justify-center text-center md:text-left md:justify-start flex-1">
                                <div className="w-12 sm:w-20 h-12 sm:h-20 mx-4 relative">
                                    <div className="w-full h-full bg-gray-700 animate-pulse rounded-full"></div>
                                </div>
                                <div>
                                    <div className="w-16 sm:w-24 md:w-32 lg:w-40 h-4 sm:h-5 md:h-6 lg:h-8 bg-gray-700 animate-pulse mb-1 rounded"></div>
                                    <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-700 animate-pulse rounded mx-auto md:mx-0"></div>
                                </div>
                            </div>
                        </div>
                    
                        
                    </MaxWidthWrapper>
                </div>
            </div>

            {/* Tab Bar Section */}
            <MaxWidthWrapper>
                <div className="pt-6 pb-20">
                    <div className="w-full mt-[-55px] z-10 relative">
                        {/* Tab List Skeleton */}
                        <div className="w-full justify-evenly rounded-xl overflow-hidden px-2 py-4 sm:px-8 sm:py-4 bg-custom_dark_red gap-2 flex">
                            {/* Tab Button Skeletons */}
                            {[
                                { label: "Laguppställning", width: "w-28" },
                                { label: "Liverapportering", width: "w-32" },
                                { label: "Statistik", width: "w-20" },
                                { label: "Tabell", width: "w-16" }
                            ].map((tab, index) => (
                                <div
                                    key={index}
                                    className="
                                        relative transition-all duration-200 border-b-2 border-transparent
                                        hover:bg-custom_red/20 rounded-xl
                                        text-xs sm:text-[15px] text-center whitespace-nowrap px-4 py-2
                                        shadow-none text-white font-bold
                                        flex items-center justify-center gap-2
                                        bg-gray-700 rounded
                                    "
                                    style={{
                                        animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 bg-gray-600 rounded"
                                        style={{
                                            animation: 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                        }}
                                    ></div> {/* Icon placeholder */}
                                    <div
                                        className={`${tab.width} h-4 bg-gray-600 rounded`}
                                        style={{
                                            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                        }}
                                    ></div> {/* Text placeholder */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    )
}

export default SingleMatcherSkeleton