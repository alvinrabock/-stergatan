// components/Match/OptimizedGoalDisplay.tsx
"use client"
import React from 'react';

interface ProcessedGoal {
    id: string;
    isHomeTeam: boolean;
    isAwayTeam: boolean;
    timeDisplay: string;
    playerName: string;
    eventScore: string;
}

interface OptimizedGoalDisplayProps {
    goals: ProcessedGoal[];
    loading?: boolean;
    error?: string | null;
}

const GoalDisplay: React.FC<OptimizedGoalDisplayProps> = ({
    goals,
    loading = false,
    error = null
}) => {
    if (loading) {
        return <div className="skeleton-loader w-full mt-6" />;
    }
    
    if (error) {
        return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
    }
    
    if (goals.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col w-full mt-6">
            {goals.map((goal) => (
                <div key={goal.id} className="flex flex-col items-center mb-2 text-white w-full">
                    <div className="flex flex-row items-center justify-between w-full gap-2.5 text-xs md:text-sm">
                        {/* Home team time (left side) */}
                        {goal.isHomeTeam ? (
                            <div className="flex items-center justify-end w-[calc(50%-35px)]">
                                <p className="text-right text-gray-400">{goal.timeDisplay}</p>
                                <p className="text-white ml-2 text-right">{goal.playerName}</p>
                            </div>
                        ) : (
                            <div className="w-[calc(50%-35px)]"></div>
                        )}

                        {/* Score (centered) */}
                        <p className="text-sm text-center text-white w-[50px]">
                            {goal.eventScore}
                        </p>

                        {/* Away team time (right side) */}
                        {goal.isAwayTeam ? (
                            <div className="flex items-center w-[calc(50%-35px)]">
                                <p className="text-white mr-2">{goal.playerName}</p>
                                <p className="text-left text-gray-400">{goal.timeDisplay}</p>
                            </div>
                        ) : (
                            <div className="w-[calc(50%-35px)]"></div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GoalDisplay;