'use client';

import FunStats from '@/app/components/Player/FunStats';
import { fetchSquadData } from '@/lib/Superadmin/fetchSquad';
import { fetchStandings } from '@/lib/Superadmin/fetchStandings';
import { StandingsTeamStats, StandingsTypes, TruppPlayers } from '@/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const getStatValue = (stats: StandingsTeamStats['stats'], statName: string): number => {
    const stat = stats.find((s) => s.name === statName);
    return stat ? stat.value || 0 : 0;
};

const TabellBlock = () => {
    const [teams, setTeams] = useState<StandingsTypes | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [squad, setSquad] = useState<TruppPlayers[]>([]);
    const [loadingSquad, setLoadingSquad] = useState(true);
    const [loadingTeams, setLoadingTeams] = useState(true);

    useEffect(() => {
        const loadStandings = async () => {
            try {
                const data = await fetchStandings();
                const sorted = (data as StandingsTypes)
                    .filter(
                        (team): team is StandingsTeamStats =>
                            !!team &&
                            typeof team.id === 'string' &&
                            typeof team.position === 'number' &&
                            !!team.displayName &&
                            Array.isArray(team.stats)
                    )
                    .sort((a, b) => a.position - b.position);

                setTeams(sorted);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong');
            } finally {
                setLoadingTeams(false);
            }
        };

        loadStandings();
    }, []);

    useEffect(() => {
        const loadSquad = async () => {
            try {
                const data = await fetchSquadData();
                setSquad(data);
            } catch (err) {
                console.error('Error fetching squad data:', err);
            } finally {
                setLoadingSquad(false);
            }
        };

        loadSquad();
    }, []);

    if (error) {
        return (
            <main className="p-6">
                <h1 className="text-xl font-bold mb-4">API Status</h1>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <div className="overflow-x-auto w-full bg-custom_dark_dark_red max-w-[1500px]">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-20">
                <div className="lg:col-span-2 order-2 lg:order-1">
                    {loadingSquad ? (
                        <div className="h-48 w-full animate-pulse bg-custom_dark_red/30 rounded-lg" />
                    ) : (
                        <FunStats players={squad} />
                    )}
                </div>

                <div className="lg:col-span-3 order-1 lg:order-2 overflow-x-auto rounded-xl shadow-md border border-gray-200">
                    <table className="min-w-full text-xs sm:text-sm text-left border-collapse">
                        <thead className="text-white sticky top-0 z-10 border-b">
                            <tr>
                                <th className="px-2 py-2">#</th>
                                <th className="px-2 py-2">Team</th>
                                <th className="px-2 py-2">GP</th>
                                <th className="px-2 py-2">GD</th>
                                <th className="px-2 py-2">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingTeams || !teams
                                ? [...Array(10)].map((_, i) => (
                                    <tr key={i} className="animate-pulse even:bg-custom_dark_red/30">
                                        <td className="px-2 py-2">
                                            <div className="h-4 w-4 bg-gray-600 rounded" />
                                        </td>
                                        <td className="px-2 py-2 flex items-center gap-2">
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full" />
                                            <div className="h-4 w-20 bg-gray-600 rounded" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="h-4 w-6 bg-gray-600 rounded" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="h-4 w-6 bg-gray-600 rounded" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="h-4 w-6 bg-gray-600 rounded" />
                                        </td>
                                    </tr>
                                ))
                                : teams.map((team) => {
                                    const stats = team.stats ?? [];
                                    const gp = getStatValue(stats, 'gp');
                                    const gf = getStatValue(stats, 'gf');
                                    const ga = getStatValue(stats, 'ga');
                                    const pts = getStatValue(stats, 'pts');
                                    const gd = gf - ga;

                                    return (
                                        <tr
                                            key={team.id}
                                            className="even:bg-custom_dark_red/30 transition-colors"
                                        >
                                            <td className="px-2 py-2 font-semibold text-white">
                                                {team.position}
                                            </td>
                                            <td className="flex items-center gap-2 px-2 py-2 text-white">
                                                <Image
                                                    src={team.logoImageUrl}
                                                    alt={team.displayName}
                                                    width={30}
                                                    height={30}
                                                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                                                />
                                                <span>{team.displayName}</span>
                                            </td>
                                            <td className="px-2 py-2 text-white">{gp}</td>
                                            <td
                                                className={`px-2 py-2 font-semibold ${gd > 0
                                                    ? 'text-green-200'
                                                    : gd < 0
                                                        ? 'text-red-200'
                                                        : 'text-white'
                                                    }`}
                                            >
                                                {gd}
                                            </td>
                                            <td className="px-2 py-2 font-bold text-white">{pts}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TabellBlock;
