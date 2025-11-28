"use client";

import React, { useEffect, useMemo, useState } from "react";
import MiniMatchCard from "@/app/components/Match/MiniMatchCard";
import MiniMatchCardSkeleton from "@/app/components/Skeletons/MiniMatchCardSkeleton";
import { MatchCardData } from "@/types";
import { getMatches } from "@/lib/fetchMatches";
import { useLeagueData } from "@/lib/hooks/useLeagueData";
import { Button } from "./ui/Button";
import Link from "next/link";

export default function SenastSpeladeMatcher() {
    const [matches, setMatches] = useState<MatchCardData[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Use shared league data hook
    const { data: leagueData, loading: leagueLoading, error: leagueError } = useLeagueData();

    useEffect(() => {
        async function fetchData() {
            // Wait for league data to load
            if (leagueLoading || !leagueData) {
                return;
            }

            try {
                const { teamId, leagues } = leagueData;

                // Get current year for latest season
                const currentYear = new Date().getFullYear().toString();

                // Get leagues from latest season (current year)
                const latestSeasonLeagues = leagues.filter((l) => l.seasonYear === currentYear);

                // If no leagues for current year, use most recent season
                const seasonsAvailable = [...new Set(leagues.map((l) => l.seasonYear))].sort((a, b) => Number(b) - Number(a));
                const targetSeason = latestSeasonLeagues.length > 0 ? currentYear : seasonsAvailable[0];
                const targetLeagues = leagues.filter((l) => l.seasonYear === targetSeason);

                if (targetLeagues.length === 0) {
                    setError("Inga ligor hittades för aktuell säsong.");
                    setMatches([]);
                    return;
                }

                // Extract league IDs and use the first league's team ID
                const leagueIds = targetLeagues.map((l) => String(l.leagueId));
                const smcTeamId = targetLeagues[0]?.ostersTeamId || teamId;

                if (!smcTeamId) {
                    setError("Ogiltigt lag-ID.");
                    setMatches([]);
                    return;
                }

                const data = await getMatches(leagueIds, smcTeamId, smcTeamId);

                const filteredMatches = data
                    .filter((match) => match.status === "Over")
                    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

                setMatches(filteredMatches);
            } catch (err) {
                console.error("Error fetching played matches:", err);
                setError("Kunde inte ladda matcher.");
                setMatches([]);
            }
        }

        fetchData();
    }, [leagueLoading, leagueData]);

    // Memoized 4 latest played matches
    const latestPlayedMatches = useMemo(() => {
        return matches.slice(0, 4);
    }, [matches]);

    return (
        <div className="flex flex-col gap-4 w-full rounded-md">
            <h2 className="text-3xl font-bold mb-4 text-left text-white">Senast spelade matcher</h2>

            {(matches.length === 0 && !error && !leagueError) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <MiniMatchCardSkeleton key={i} />
                    ))}
                </div>
            ) : (error || leagueError) ? (
                <div className="bg-red-500 text-white p-4 rounded-md text-center">{error || leagueError}</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {latestPlayedMatches.map((match) => (
                        <MiniMatchCard
                            key={match.matchId}
                            match={match}
                            colorTheme="red"
                        />
                    ))}
                </div>
            )}

            <Button variant="outline" className="text-left w-fit">
                <Link href="/matcher">Visa alla matcher</Link>
            </Button>
        </div>
    );
}
