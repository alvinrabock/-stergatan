import React from 'react'

const LiveStatsSkeleton = () => {
    return (
        <div className="w-full p-6 space-y-4 rounded-md text-white animate-pulse">
            {/* Match Clock & Attendees + Possession Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left Section */}
                <div className='flex flex-col gap-2'>
                    {/* Match Time & Attendance */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-10">
                        {/* Match Time */}
                        <div className="border-b pb-2 border-white/20">
                            <div className="h-6 sm:h-8 bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-8 sm:h-10 bg-gray-600 rounded w-16"></div>
                        </div>

                        {/* Attendance */}
                        <div className="border-b pb-2 border-white/20">
                            <div className="h-6 sm:h-8 bg-gray-700 rounded w-20 mb-2"></div>
                            <div className="h-8 sm:h-10 bg-gray-600 rounded w-20"></div>
                        </div>
                    </div>

                    {/* Player Stats Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i}>
                                <div className="h-7 bg-gray-700 rounded w-32 mb-6"></div>
                                <div className="flex flex-row items-center md:flex-col md:items-center gap-4 md:gap-0">
                                    {/* Image skeleton */}
                                    <div className="relative flex-shrink-0 w-16 h-16 md:w-[130px] md:h-[130px] rounded-full md:rounded-none overflow-hidden bg-gray-700"></div>
                                    {/* Card skeleton */}
                                    <div className="bg-gray-700 flex flex-row items-center justify-between gap-4 px-3 py-2 rounded-md w-full shadow-sm">
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-gray-600 rounded w-20"></div>
                                            <div className="h-4 bg-gray-600 rounded w-16"></div>
                                        </div>
                                        <div className="h-5 bg-gray-600 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section - Possession Chart */}
                <div className="bg-custom_dark_red text-white border-none rounded-lg p-6">
                    <div className="pb-2">
                        <div className="h-8 sm:h-10 bg-gray-700 rounded w-40 mb-4"></div>
                    </div>
                    <div className="space-y-6">
                        {/* Team Legend */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-gray-700"></div>
                                <div className="h-4 bg-gray-700 rounded w-24"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 bg-gray-700 rounded w-24"></div>
                                <div className="h-4 w-4 rounded-full bg-gray-700"></div>
                            </div>
                        </div>

                        {/* First Half Bar */}
                        <div>
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="relative h-8 w-full bg-gray-700 rounded-full"></div>
                        </div>

                        {/* Second Half Bar */}
                        <div>
                            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="relative h-8 w-full bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Logos Header */}
            <div className='w-full flex flex-row justify-between border-b border-white/20 pb-4 mt-20'>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    <div className="hidden sm:flex h-6 bg-gray-700 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-6 bg-gray-700 rounded w-32"></div>
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                </div>
            </div>

            {/* Stats Sections */}
            <div className='flex flex-col gap-10'>
                {/* Shots Accuracy */}
                <div className="w-full mb-8">
                    <div className="h-6 sm:h-8 bg-gray-700 rounded w-24 mx-auto mb-4"></div>
                    <div className="flex gap-10">
                        {/* Home team */}
                        <div className="flex flex-col flex-1">
                            <div className="h-5 bg-gray-700 rounded w-3/4 ml-auto mb-2"></div>
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-700"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-700 rounded w-24"></div>
                                <div className="h-4 bg-gray-700 rounded w-16"></div>
                            </div>
                        </div>

                        {/* Away team */}
                        <div className="flex flex-col flex-1">
                            <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-700"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-700 rounded w-24"></div>
                                <div className="h-4 bg-gray-700 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Corners */}
                <div className="mb-8">
                    <div className="h-6 sm:h-8 bg-gray-700 rounded w-24 mx-auto mb-4"></div>
                    <div className="relative h-2 w-full bg-gray-700 rounded-full mb-2"></div>
                    <div className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                    </div>
                </div>

                {/* Fouls */}
                <div className="mb-8">
                    <div className="h-6 sm:h-8 bg-gray-700 rounded w-20 mx-auto mb-4"></div>
                    <div className="relative h-2 w-full bg-gray-700 rounded-full mb-2"></div>
                    <div className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                    </div>
                </div>

                {/* Yellow Cards */}
                <div className="mb-8">
                    <div className="h-6 sm:h-8 bg-gray-700 rounded w-28 mx-auto mb-4"></div>
                    <div className='w-full flex justify-between mb-2'>
                        <div className="h-6 w-6 bg-gray-700 rounded"></div>
                        <div className="h-6 w-6 bg-gray-700 rounded"></div>
                    </div>
                    <div className="relative h-2 w-full bg-gray-700 rounded-full mb-2"></div>
                    <div className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                    </div>
                </div>

                {/* Offsides */}
                <div className="mb-8">
                    <div className="h-6 sm:h-8 bg-gray-700 rounded w-28 mx-auto mb-4"></div>
                    <div className="relative h-2 w-full bg-gray-700 rounded-full mb-2"></div>
                    <div className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                        <div className="h-5 bg-gray-700 rounded w-8"></div>
                    </div>
                </div>

                {/* Distance */}
                <div className="space-y-6">
                    <div className="h-6 sm:h-8 bg-gray-700 rounded w-28 mx-auto mb-8"></div>
                    <div className="relative h-2 w-full bg-gray-700 rounded-full"></div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {/* Home team */}
                        <div className="text-left space-y-2">
                            <div className="h-5 bg-gray-700 rounded w-32"></div>
                            <div className="h-4 bg-gray-700 rounded w-28"></div>
                            <div className="h-4 bg-gray-700 rounded w-28"></div>
                        </div>

                        {/* Away team */}
                        <div className="text-right space-y-2">
                            <div className="h-5 bg-gray-700 rounded w-32 ml-auto"></div>
                            <div className="h-4 bg-gray-700 rounded w-28 ml-auto"></div>
                            <div className="h-4 bg-gray-700 rounded w-28 ml-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveStatsSkeleton
