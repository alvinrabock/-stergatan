import React from 'react'

const LiveDataSkeleton = () => {
    return (
        <div className="w-full max-w-6xl mx-auto py-6">
            <div className="relative">
                {/* Vertical center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 -translate-x-1/2"></div>

                <div className="space-y-8">
                    {/* Center event skeleton (kickoff/halftime) */}
                    <div className="relative flex justify-center animate-pulse">
                        {/* Circle skeleton */}
                        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-gray-700"></div>

                        {/* Content box skeleton */}
                        <div className="mt-16 bg-gray-800 px-6 py-4 rounded-lg max-w-md border-2 border-gray-700 w-80">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
                        </div>
                    </div>

                    {/* Home team event skeleton (left side) */}
                    <div className="relative grid grid-cols-2 gap-0 animate-pulse">
                        {/* Content on left */}
                        <div className="flex items-center justify-end pr-[50px]">
                            <div className="text-right space-y-2 w-64">
                                <div className="h-3 bg-gray-700 rounded w-20 ml-auto"></div>
                                <div className="h-5 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 ml-auto"></div>
                            </div>
                        </div>

                        {/* Right side empty */}
                        <div></div>

                        {/* Circle skeleton in center */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-12 h-12 rounded-full bg-gray-700"></div>
                    </div>

                    {/* Away team event skeleton (right side) */}
                    <div className="relative grid grid-cols-2 gap-0 animate-pulse">
                        {/* Left side empty */}
                        <div></div>

                        {/* Content on right */}
                        <div className="flex items-center justify-start pl-[50px]">
                            <div className="text-left space-y-2 w-64">
                                <div className="h-3 bg-gray-700 rounded w-20"></div>
                                <div className="h-5 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            </div>
                        </div>

                        {/* Circle skeleton in center */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-12 h-12 rounded-full bg-gray-700"></div>
                    </div>

                    {/* Another home team event */}
                    <div className="relative grid grid-cols-2 gap-0 animate-pulse">
                        <div className="flex items-center justify-end pr-[50px]">
                            <div className="text-right space-y-2 w-64">
                                <div className="h-3 bg-gray-700 rounded w-16 ml-auto"></div>
                                <div className="h-5 bg-gray-700 rounded w-4/5 ml-auto"></div>
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                            </div>
                        </div>
                        <div></div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-12 h-12 rounded-full bg-gray-700"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveDataSkeleton