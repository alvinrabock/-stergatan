import React from "react"

const MiniMatchCardSkeleton = () => {
  return (
    <div className="p-4 relative rounded-lg flex flex-col gap-4 items-center justify-center bg-white/10 text-white animate-pulse">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-start justify-center gap-2 w-full">
          {/* Home team */}
          <div className="flex flex-col w-20 items-center text-center gap-1">
            <div className="p-2 aspect-square rounded-lg flex items-center justify-center bg-gray-200">
              <div className="w-12 h-12 bg-white/20 rounded-full" />
            </div>
            <div className="w-12 h-3 bg-white/30 rounded" />
          </div>

          {/* Match Info */}
          <div className="flex flex-col items-center justify-center py-2 text-center gap-1">
            <div className="w-20 h-6 bg-white/30 rounded" />
            <div className="w-16 h-4 bg-white/20 rounded" />
          </div>

          {/* Away team */}
          <div className="flex flex-col w-20 items-center text-center gap-1">
            <div className="p-2 aspect-square rounded-lg flex items-center justify-center bg-gray-200">
              <div className="w-12 h-12 bg-white/20 rounded-full" />
            </div>
            <div className="w-12 h-3 bg-white/30 rounded" />
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="w-full px-4">
        <div className="h-10 w-full bg-white/30 rounded" />
      </div>
    </div>
  )
}

export default MiniMatchCardSkeleton
