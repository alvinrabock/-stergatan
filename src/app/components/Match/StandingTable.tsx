"use client";

import React, { useEffect, useState } from "react";
import { TeamStanding } from "@/types";
import { fetchStandings } from "@/lib/fetchStandings";

interface StandingsTableProps {
    leagueId: number;
    homeTeamId: number | undefined;
    awayTeamId: number | undefined;
}

const StandingsTable = ({ leagueId, homeTeamId, awayTeamId }: StandingsTableProps) => {
    const [standings, setStandings] = useState<TeamStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previousLeagueId, setPreviousLeagueId] = useState<number | null>(null);
    const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (leagueId !== previousLeagueId) {
            const getStandings = async () => {
                try {
                    const data: TeamStanding[] = await fetchStandings(String(leagueId));
                    setStandings(data);
                } catch (error) {
                    const err = error instanceof Error ? error.message : "An unexpected error occurred.";
                    console.error("Error fetching standings:", err);
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };

            getStandings();
            setPreviousLeagueId(leagueId);
        }
    }, [leagueId, previousLeagueId]);

    const truncateTeamName = (name: string, maxLength: number = 20) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength - 3) + "...";
    };

    const toggleTeamExpansion = (teamId: string) => {
        setExpandedTeams(prev => {
            const newSet = new Set(prev);
            if (newSet.has(teamId)) {
                newSet.delete(teamId);
            } else {
                newSet.add(teamId);
            }
            return newSet;
        });
    };

    return (
        <div className="w-full">
            {error && <div className="text-center text-red-500 p-4">{error}</div>}

            {/* No data available message */}
            {!loading && standings.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
                    <h5 className="text-xl md:text-2xl font-semibold text-custom-dark-red">
                        Ingen tabell tillgänglig
                    </h5>
                </div>
            )}

            {/* Only render table if data exists */}
            {standings.length > 0 && !loading && (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full rounded-t-lg overflow-hidden shadow-sm">
                            <thead className="text-gray-800 bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-3 text-left text-sm font-medium">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium min-w-0">Team</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">Pts</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">W</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">D</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">L</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">GD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((team) => {
                                    const teamId = Number(team.teamId);
                                    const homeId = Number(homeTeamId);
                                    const awayId = Number(awayTeamId);
                                    const isSelectedTeam = teamId === homeId || teamId === awayId;
                                    const isExpanded = expandedTeams.has(team.teamId);
                                    const teamName = team["team-name"];
                                    const needsTruncation = teamName.length > 25;

                                    return (
                                        <tr
                                            key={team.teamId}
                                            className={`text-center even:bg-slate-50 odd:bg-white transition-colors ${
                                                isSelectedTeam 
                                                    ? "bg-red-50 border-l-4 border-red-400 shadow-sm" 
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-3 py-3 font-medium text-sm">{team.position}</td>
                                            <td className="px-4 py-3 text-left min-w-0">
                                                <div className="flex items-center">
                                                    <span 
                                                        className={`font-medium text-gray-800 text-sm ${
                                                            needsTruncation ? 'cursor-pointer hover:text-custom-red' : ''
                                                        }`}
                                                        onClick={() => needsTruncation && toggleTeamExpansion(team.teamId)}
                                                        title={needsTruncation ? teamName : undefined}
                                                    >
                                                        {isExpanded || !needsTruncation ? teamName : truncateTeamName(teamName, 25)}
                                                    </span>
                                                    {needsTruncation && (
                                                        <button
                                                            onClick={() => toggleTeamExpansion(team.teamId)}
                                                            className="ml-2 text-custom-red hover:text-custom-dark-red text-xs"
                                                        >
                                                            {isExpanded ? '−' : '+'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 font-semibold text-sm">{team.points}</td>
                                            <td className="px-3 py-3 font-medium text-sm">{team.wins}</td>
                                            <td className="px-3 py-3 font-medium text-sm">{team.draws}</td>
                                            <td className="px-3 py-3 font-medium text-sm">{team.losses}</td>
                                            <td className="px-3 py-3 font-medium text-sm text-gray-800">
                                                {team["goal-differential"] > 0 ? '+' : ''}{team["goal-differential"]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Horizontal Scroll Table */}
                    <div className="lg:hidden overflow-x-auto">
                        <table className="min-w-full rounded-t-lg overflow-hidden shadow-sm">
                            <thead className="text-gray-800 bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-3 text-left text-sm font-medium whitespace-nowrap">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap min-w-[160px]">Team</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap">Pts</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap">W</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap">D</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap">L</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium whitespace-nowrap">GD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((team) => {
                                    const teamId = Number(team.teamId);
                                    const homeId = Number(homeTeamId);
                                    const awayId = Number(awayTeamId);
                                    const isSelectedTeam = teamId === homeId || teamId === awayId;
                                    const isExpanded = expandedTeams.has(team.teamId);
                                    const teamName = team["team-name"];
                                    const needsTruncation = teamName.length > 20;

                                    return (
                                        <tr
                                            key={team.teamId}
                                            className={`text-center even:bg-slate-50 odd:bg-white transition-colors ${
                                                isSelectedTeam 
                                                    ? "bg-red-50 border-l-4 border-red-400 shadow-sm" 
                                                    : ""
                                            }`}
                                        >
                                            <td className="px-3 py-3 font-medium text-sm text-gray-800">{team.position}</td>
                                            <td className="px-4 py-3 text-left min-w-0">
                                                <div className="flex items-center">
                                                    <span 
                                                        className={`font-medium text-gray-800 text-sm whitespace-nowrap ${
                                                            needsTruncation ? 'cursor-pointer hover:text-custom-red' : ''
                                                        }`}
                                                        onClick={() => needsTruncation && toggleTeamExpansion(team.teamId)}
                                                        title={needsTruncation ? teamName : undefined}
                                                    >
                                                        {isExpanded || !needsTruncation ? teamName : truncateTeamName(teamName, 20)}
                                                    </span>
                                                    {needsTruncation && (
                                                        <button
                                                            onClick={() => toggleTeamExpansion(team.teamId)}
                                                            className="ml-2 text-custom-red hover:text-custom-dark-red text-xs flex-shrink-0"
                                                        >
                                                            {isExpanded ? '−' : '+'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 font-semibold text-sm text-gray-800">{team.points}</td>
                                            <td className="px-3 py-3 font-medium text-sm text-gray-800">{team.wins}</td>
                                            <td className="px-3 py-3 font-medium text-sm text-gray-800">{team.draws}</td>
                                            <td className="px-3 py-3 font-medium text-sm text-gray-800">{team.losses}</td>
                                            <td className="px-3 py-3 font-medium text-sm text-gray-800">
                                                {team["goal-differential"] > 0 ? '+' : ''}{team["goal-differential"]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Loading State */}
            {loading && (
                <>
                    {/* Desktop Loading */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full rounded-t-lg overflow-hidden">
                            <thead className="text-gray-800 bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-3 text-left text-sm font-medium">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Team</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">Pts</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">W</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">D</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">L</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">GD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((_, index) => (
                                    <tr key={index} className="animate-pulse even:bg-slate-50 odd:bg-white">
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded"></div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-8 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-8 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Loading */}
                    <div className="lg:hidden overflow-x-auto">
                        <table className="min-w-full rounded-t-lg overflow-hidden">
                            <thead className="text-gray-800 bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-3 text-left text-sm font-medium">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Team</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">Pts</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">W</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">D</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">L</th>
                                    <th className="px-3 py-3 text-center text-sm font-medium">GD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(10)].map((_, index) => (
                                    <tr key={index} className="animate-pulse even:bg-slate-50 odd:bg-white">
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded"></div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-8 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="h-4 w-8 bg-gray-300 rounded mx-auto"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

// Properly typed memoized component
const MemoizedStandingsTable = React.memo<StandingsTableProps>(StandingsTable);

export default StandingsTable;
export { MemoizedStandingsTable };