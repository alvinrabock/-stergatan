"use client"

import React from 'react';
import { SportomediaMatchEvent } from '@/lib/Superadmin/fetchSportomediaMatch';
import { FootballIcon } from '@/app/components/Icons/FootballIcon';
import GoalIcon from '@/app/components/Icons/GoalIcon';
import MedicalIcon from '@/app/components/Icons/MedicalIcon';
import RedCard from '@/app/components/Icons/RedCard';
import YellowCard from '@/app/components/Icons/YellowCard';
import WhistleIcon from '@/app/components/Icons/WhistleIcon';
import FlagIcon from '@/app/components/Icons/FlagIcon';

// Generic player type that works with both Sportomedia and lineup data
interface LineupPlayerForEvents {
    givenName: string;
    surName: string;
    image?: string;
    imageHalf200?: string;
    imageFull750?: string;
}

interface LiverapporteringNewProps {
    events: SportomediaMatchEvent[];
    homeTeamName: string;
    visitingTeamName: string;
    homeTeamLogo?: string;
    visitingTeamLogo?: string;
    onVideoClick?: (videoUrl: string) => void;
    homeLineup?: LineupPlayerForEvents[];
    awayLineup?: LineupPlayerForEvents[];
}

const LiverapporteringNew: React.FC<LiverapporteringNewProps> = ({
    events,
    onVideoClick,
    homeLineup = [],
    awayLineup = []
}) => {
    // Helper function to find player image by name
    const findPlayerImage = (playerName: string, isHomeTeam: boolean): string | undefined => {
        const lineup = isHomeTeam ? homeLineup : awayLineup;

        if (!lineup || lineup.length === 0) {
            return undefined;
        }

        // Try to match by full name or surname
        const player = lineup.find((p: any) => {
            const givenName = p.givenName || '';
            const surname = p.surName || '';
            const fullName = `${givenName} ${surname}`.toLowerCase();
            const searchName = playerName.toLowerCase();
            return fullName.includes(searchName) || searchName.includes(surname.toLowerCase());
        });

        return player?.image;
    };
    const getEventIcon = (type: string) => {
        const iconClass = "w-6 h-6 fill-white";

        switch (type) {
            case 'GOAL':
                return <GoalIcon className={iconClass} />;
            case 'SHOT':
            case 'SHOT_ON_TARGET':
                return <FootballIcon className={iconClass} />;
            case 'WARNING':
                return <YellowCard className="w-4 h-6" />;
            case 'RED_CARD':
                return <RedCard className="w-4 h-6" />;
            case 'OFFSIDE':
                return <FlagIcon className={iconClass} />;
            case 'SUBSTITUTION':
                return <MedicalIcon className={iconClass} />;
            case 'START':
            case 'PERIOD_RESULT':
                return <WhistleIcon className={iconClass} />;
            default:
                return <FootballIcon className={iconClass} />;
        }
    };

    const getEventCircleClass = () => {
        return 'bg-custom_dark_dark_red border-2 border-custom_dark_red';
    };

    // Check if event should show video (skip for shots and offsides)
    const shouldShowVideo = (event: SportomediaMatchEvent) => {
        if (!event.video) return false;
        const skipTypes = ['SHOT', 'SHOT_ON_TARGET', 'OFFSIDE'];
        return !skipTypes.includes(event.type);
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="relative">
                {/* Vertical line through center */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-custom_dark_red -translate-x-1/2"></div>

                {events.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        Inga händelser att visa
                    </div>
                ) : (
                    <div className="space-y-8">
                        {events.map((event, index) => {
                            const isHomeEvent = event.byHomeTeam === true;
                            const isAwayEvent = event.byHomeTeam === false;
                            const isCenterEvent = event.type === 'PERIOD_RESULT' || event.type === 'START';

                            // Center events (period results, kickoff)
                            if (isCenterEvent) {
                                return (
                                    <div key={index} className="relative flex justify-center">
                                        {/* Icon in center */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center ${getEventCircleClass()}`}>
                                            {getEventIcon(event.type)}
                                        </div>

                                        {/* Event content centered */}
                                        <div className="mt-16 text-center bg-custom_dark_dark_red px-6 py-4 rounded-lg max-w-md border-2 border-custom_dark_red">
                                            {(event.type === 'GOAL' || event.type === 'PERIOD_RESULT') ? (
                                                <div className="flex flex-wrap items-center justify-center gap-3">
                                                    <span className="text-custom_red text-2xl font-bold">
                                                        {event.homeTeamScore} - {event.visitingTeamScore}
                                                    </span>
                                                    <span className="text-white font-semibold text-lg">
                                                        {event.description}
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className="text-white font-semibold text-lg">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            // Home team events (left side)
                            if (isHomeEvent) {
                                return (
                                    <div key={index} className="relative grid grid-cols-2 gap-0">
                                        {/* Content on left */}
                                        <div className="flex items-center justify-end pr-[50px]">
                                            <div className="text-right">
                                                {/* Event type */}
                                                {event.typeString && (
                                                    <p className="text-white text-xs font-semibold uppercase mb-2">
                                                        {event.typeString}
                                                    </p>
                                                )}

                                                {/* Player name with score for goals */}
                                                {event.playerName && (
                                                    <div className="flex items-center justify-end mb-1">
                                                        {event.type === 'GOAL' && (
                                                            <span className="text-white text-lg font-bold mr-2">
                                                                {event.homeTeamScore} - {event.visitingTeamScore}
                                                            </span>
                                                        )}
                                                        <p className="text-white font-semibold text-lg">
                                                            {event.playerName}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Description */}
                                                <p className="text-gray-300 text-sm mb-2">
                                                    {event.description}
                                                </p>

                                                {/* Video button for goals */}
                                                {event.type === 'GOAL' && shouldShowVideo(event) && onVideoClick && (
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => onVideoClick(event.video!.embedVideoUrl)}
                                                            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                            </svg>
                                                            <span>Visa video</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right side empty */}
                                        <div></div>

                                        {/* Icon in center */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 top-0 z-10 w-12 h-12 rounded-full flex items-center justify-center ${getEventCircleClass()}`}>
                                            {event.type === 'GOAL' && event.playerName ? (
                                                (() => {
                                                    const playerImage = findPlayerImage(event.playerName, true);
                                                    return playerImage ? (
                                                        <img
                                                            src={playerImage}
                                                            alt={event.playerName}
                                                            className="w-full h-full object-cover rounded-full p-0.5"
                                                        />
                                                    ) : getEventIcon(event.type);
                                                })()
                                            ) : getEventIcon(event.type)}
                                        </div>

                                    </div>
                                );
                            }

                            // Away team events (right side)
                            if (isAwayEvent) {
                                return (
                                    <div key={index} className="relative grid grid-cols-2 gap-0">
                                        {/* Left side empty */}
                                        <div></div>

                                        {/* Content on right */}
                                        <div className="flex items-center justify-start pl-[50px]">
                                            <div className="text-left">
                                                {/* Event type */}
                                                {event.typeString && (
                                                    <p className="text-white text-xs font-semibold uppercase mb-2">
                                                        {event.typeString}
                                                    </p>
                                                )}

                                                {/* Player name with score for goals */}
                                                {event.playerName && (
                                                    <div className="flex items-center justify-start mb-1">
                                                        <p className="text-white font-semibold text-lg">
                                                            {event.playerName}
                                                        </p>
                                                        {event.type === 'GOAL' && (
                                                            <span className="text-white text-lg font-bold ml-2">
                                                                {event.homeTeamScore} - {event.visitingTeamScore}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Description */}
                                                <p className="text-gray-300 text-sm mb-2">
                                                    {event.description}
                                                </p>

                                                {/* Video button for goals */}
                                                {event.type === 'GOAL' && shouldShowVideo(event) && onVideoClick && (
                                                    <div className="flex justify-start">
                                                        <button
                                                            onClick={() => onVideoClick(event.video!.embedVideoUrl)}
                                                            className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors text-sm"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                            </svg>
                                                            <span>Visa video</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Icon in center */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 top-0 z-10 w-12 h-12 rounded-full flex items-center justify-center ${getEventCircleClass()}`}>
                                            {event.type === 'GOAL' && event.playerName ? (
                                                (() => {
                                                    const playerImage = findPlayerImage(event.playerName, false);
                                                    return playerImage ? (
                                                        <img
                                                            src={playerImage}
                                                            alt={event.playerName}
                                                            className="w-full h-full object-cover rounded-full p-0.5"
                                                        />
                                                    ) : getEventIcon(event.type);
                                                })()
                                            ) : getEventIcon(event.type)}
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiverapporteringNew;

// Helper exports for MatchClient
export const shouldShowVideoHelper = (event: SportomediaMatchEvent) => {
    if (!event.video) return false;
    const skipTypes = ['SHOT', 'SHOT_ON_TARGET', 'OFFSIDE'];
    return !skipTypes.includes(event.type);
};

export const getEventsWithVideos = (events: SportomediaMatchEvent[]) => {
    return events.filter(event => shouldShowVideoHelper(event));
};
