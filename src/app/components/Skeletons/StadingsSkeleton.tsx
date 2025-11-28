import React from 'react';

const StandingsSkeleton = () => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-xs sm:text-sm text-left border-collapse">
          {/* Header */}
          <thead className="text-white sticky top-0 z-10 border-b bg-custom_dark_red">
            <tr>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">#</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap min-w-[160px]">Team</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">GP</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">W</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">D</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">L</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">GF</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">GA</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">GD</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Pts</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Form</th>
            </tr>
          </thead>
          
          {/* Skeleton Rows */}
          <tbody>
            {[...Array(16)].map((_, index) => (
              <tr
                key={index}
                className={`animate-pulse ${
                  index % 2 === 1 ? 'bg-custom_dark_red/30' : 'bg-transparent'
                }`}
              >
                {/* Position */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded"></div>
                </td>
                
                {/* Team */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap min-w-0">
                  <div className="flex items-center gap-2">
                    {/* Team logo skeleton */}
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400 rounded-full flex-shrink-0"></div>
                    {/* Team name skeleton */}
                    <div className="h-4 bg-gray-400 rounded flex-1 max-w-[120px]"></div>
                  </div>
                </td>
                
                {/* GP */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* W */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* D */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* L */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* GF */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* GA */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* GD */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-8 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* Pts */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="h-4 w-6 bg-gray-400 rounded mx-auto"></div>
                </td>
                
                {/* Form */}
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  <div className="flex space-x-0.5 sm:space-x-1">
                    {[...Array(5)].map((_, formIndex) => (
                      <div
                        key={formIndex}
                        className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-400 rounded-full flex-shrink-0"
                      ></div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary statistics skeleton */}
      <div className="mt-4 text-xs text-gray-400 flex gap-4">
        <div className="h-3 w-24 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default StandingsSkeleton;