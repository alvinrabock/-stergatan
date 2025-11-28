import React from "react";
import { Card } from "../ui/card";

const PlayerStatsCardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2].map((_, index) => (
        <Card key={index} className="p-4 border-t-2 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>

          <div className="flex space-x-2 mb-4">
            <div className="h-5 bg-green-300 rounded px-3 w-24"></div>
            <div className="h-5 bg-blue-300 rounded px-3 w-24"></div>
          </div>

          <ul className="space-y-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="flex justify-between">
                <span className="h-4 bg-gray-300 rounded w-1/2"></span>
                <span className="h-4 bg-gray-300 rounded w-1/4"></span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-4 gap-2 my-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-1 rounded-md bg-gray-200 w-full h-12"></div>
            ))}
          </div>

          <div className="h-2 bg-gray-300 rounded-full w-full my-3"></div>
          <div className="flex justify-between">
            <span className="h-4 bg-gray-300 rounded w-1/3"></span>
            <span className="h-4 bg-gray-300 rounded w-1/3"></span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PlayerStatsCardSkeleton;
