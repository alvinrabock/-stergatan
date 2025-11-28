import React from "react";

export function MatchCardSkeleton() {
    return (
        <div className="animate-pulse rounded-lg p-7 flex flex-col lg:flex-row gap-4 sm:gap-2 items-center justify-between bg-gray-700/30 text-white">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full">
                {/* Teams and match info section */}
                <div className="flex flex-row items-start justify-center gap-2">
                    {/* Home team */}
                    <div className="flex flex-col w-20 gap-2 items-center justify-center text-center">
                        <div className="aspect-square rounded-lg flex items-center justify-center p-2 bg-gray-600">
                            <div className="w-12 h-12 bg-gray-500 rounded" />
                        </div>
                        <div className="h-3 w-16 bg-gray-500 rounded" />
                    </div>

                    {/* Match status/time/score */}
                    <div className="flex flex-col items-center justify-center py-2 text-center">
                        <div className="h-6 w-20 bg-gray-500 rounded mb-1" />
                        <div className="h-4 w-16 bg-gray-400 rounded" />
                    </div>

                    {/* Away team */}
                    <div className="flex flex-col w-20 gap-2 items-center justify-center text-center">
                        <div className="aspect-square rounded-lg flex items-center justify-center p-2 bg-gray-600">
                            <div className="w-12 h-12 bg-gray-500 rounded" />
                        </div>
                        <div className="h-3 w-16 bg-gray-500 rounded" />
                    </div>
                </div>

                {/* Arena and league info */}
                <div className="flex flex-row flex-wrap justify-center items-center sm:items-start md:flex-row md:justify-center md:items-center mx-auto gap-x-4">
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-4 h-4 bg-gray-500 rounded" />
                        <div className="h-4 w-24 bg-gray-500 rounded" />
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-6 h-6 bg-gray-500 rounded" />
                        <div className="h-4 w-32 bg-gray-500 rounded" />
                    </div>
                </div>
            </div>

            {/* Buttons section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-fit">
                <div className="h-10 w-full lg:w-24 bg-gray-600 rounded-md" />
                <div className="h-10 w-full lg:w-24 bg-gray-600 rounded-md" />
            </div>
        </div>
    );
}