'use client';

import React from 'react';
import Image from 'next/image';
import { lineupPlayer, MatchLineup } from '@/types';

interface Props {
    lineupData: MatchLineup | null;
}

const PlayerStats: React.FC<Props> = ({ lineupData }) => {
    // Show loading skeleton while data is being fetched
    if (!lineupData) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <h3 className="text-lg sm:text-2xl font-semibold mb-6 uppercase text-left">
                            <div className="h-7 bg-gray-700 rounded w-32"></div>
                        </h3>
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
        );
    }

    const allPlayers = [
        ...(lineupData.homeTeamLineup?.starting || []),
        ...(lineupData.homeTeamLineup?.substitutes || []),
        ...(lineupData.visitingTeamLineup?.starting || []),
        ...(lineupData.visitingTeamLineup?.substitutes || []),
    ] as lineupPlayer[];

    if (allPlayers.length === 0) {
        return <p className="text-center text-red-500">Inga spelare hittades.</p>;
    }

    // Helper function to safely get numeric value
    const safeGetNumber = (value: string | number | boolean | null | undefined): number => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'boolean') return value ? 1 : 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    // Helper function to check if a player has valid data for a stat
    const hasValidStat = (player: lineupPlayer, statKey: keyof lineupPlayer): boolean => {
        const value = player[statKey];
        return value !== null && value !== undefined && value !== '' && safeGetNumber(value) > 0;
    };

    // Find players with valid stats
    const playersWithDistance = allPlayers.filter(player => hasValidStat(player, 'distance'));
    const playersWithSpeed = allPlayers.filter(player => hasValidStat(player, 'maxSpeed'));
    const playersWithShots = allPlayers.filter(player => hasValidStat(player, 'shots'));

    // Find top stats only among players with valid data
    const topDistance = playersWithDistance.length > 0 
        ? playersWithDistance.reduce((prev, current) =>
            safeGetNumber(current.distance) > safeGetNumber(prev.distance) ? current : prev
        ) : null;

    const topSpeed = playersWithSpeed.length > 0
        ? playersWithSpeed.reduce((prev, current) =>
            safeGetNumber(current.maxSpeed) > safeGetNumber(prev.maxSpeed) ? current : prev
        ) : null;

    const topShots = playersWithShots.length > 0
        ? playersWithShots.reduce((prev, current) =>
            safeGetNumber(current.shots) > safeGetNumber(prev.shots) ? current : prev
        ) : null;

    // If no valid data at all, don't render the component
    if (!topDistance && !topSpeed && !topShots) {
        return null;
    }

    const Card = ({
        title,
        player,
        stat,
        isEmpty = false,
    }: {
        title: React.ReactNode;
        player: lineupPlayer | null;
        stat: string;
        isEmpty?: boolean;
    }) => {
        if (isEmpty || !player) {
            return (
                <div>
                    <h3 className="text-lg sm:text-2xl font-semibold mb-6 uppercase text-left">
                        {title}
                    </h3>
                    <div className="flex flex-row items-center md:flex-col md:items-center gap-4 md:gap-0">
                        {/* Empty placeholder */}
                        <div className="relative flex-shrink-0 w-16 h-16 md:w-[130px] md:h-[130px] rounded-full md:rounded-none overflow-hidden bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs md:text-sm">Ingen bild</span>
                        </div>
                        <div className="bg-gray-300 flex flex-row items-center justify-between gap-4 px-3 py-2 rounded-md w-full shadow-sm">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Ingen data <br />
                                    tillgänglig
                                </p>
                            </div>
                            <p className="text-gray-600 text-right font-bold text-sm">-</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Safe fallbacks for player data
        const playerImage = player.image || '/default-player.png'; // You should have a default player image
        const givenName = player.givenName || 'Okänd';
        const surName = player.surName || 'Spelare';

        return (
            <div>
                <h3 className="text-lg sm:text-2xl font-semibold mb-6 uppercase text-left">
                    {title}
                </h3>

                {/* flex-row on mobile, flex-col on md+ */}
                <div className="flex flex-row items-center md:flex-col md:items-center shrink grow gap-4 md:gap-0">
                    {/* Player image - circular on mobile only */}
                    <div className="relative flex-shrink-0 w-16 h-16 md:w-[130px] md:h-[130px] rounded-full md:rounded-none overflow-hidden">
                        <Image
                            src={playerImage}
                            alt={`${givenName} ${surName}`}
                            fill
                            sizes="(max-width: 768px) 64px, 130px"
                            className="object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = '/default-player.png';
                            }}
                        />
                    </div>

                    {/* Card content */}
                    <div className="bg-custom-dark-red flex flex-row items-center justify-between gap-4 px-3 py-2 rounded-md w-full shadow-sm">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {givenName} <br />
                                {surName}
                            </p>
                        </div>
                        <p className="text-white text-right font-bold text-sm">{stat}</p>
                    </div>
                </div>
            </div>
        );
    };

    // Format stat values safely
    const formatDistance = (distance: string | number | boolean | null | undefined): string => {
        const value = safeGetNumber(distance);
        return value > 0 ? `${value} meter` : '-';
    };

    const formatSpeed = (speed: string | number | boolean | null | undefined): string => {
        const value = safeGetNumber(speed);
        return value > 0 ? `${value} km/h` : '-';
    };

    const formatShots = (shots: string | number | boolean | null | undefined): string => {
        const value = safeGetNumber(shots);
        return value > 0 ? `${value} skott` : '-';
    };

    // Calculate grid columns based on how many cards we have
    const cardsToShow = [topDistance, topSpeed, topShots].filter(Boolean).length;
    const gridClass = `grid grid-cols-1 ${cardsToShow === 1 ? 'md:grid-cols-1' : cardsToShow === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 mt-6`;

    return (
        <div className={gridClass}>
            {topDistance && (
                <Card
                    title={
                        <>
                            Längsta <span className="hidden md:inline"><br /></span> distans
                        </>
                    }
                    player={topDistance}
                    stat={formatDistance(topDistance?.distance)}
                    isEmpty={false}
                />
            )}
            {topSpeed && (
                <Card
                    title={
                        <>
                            Snabbast <span className="hidden md:inline"><br /></span> spelare
                        </>
                    }
                    player={topSpeed}
                    stat={formatSpeed(topSpeed?.maxSpeed)}
                    isEmpty={false}
                />
            )}
            {topShots && (
                <Card
                    title={
                        <>
                            Flest <span className="hidden md:inline"><br /></span> skott
                        </>
                    }
                    player={topShots}
                    stat={formatShots(topShots?.shots)}
                    isEmpty={false}
                />
            )}
        </div>
    );
};

export default PlayerStats;