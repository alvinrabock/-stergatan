"use client";

import React, { useEffect, useState } from "react";
import MatchCard from "@/app/components/Match/MatchCard";
import { Lag, MatchCardData } from "@/types";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { getMatches } from "@/lib/fetchMatches";
import { fetchTeamsWithSMC } from "@/lib/apollo/fetchTeam/fetchTeamForMatchesAction";
import { Button } from "../ui/Button";
import Link from "next/link";

export default function UpcomingMatches() {
    const [matches, setMatches] = useState<MatchCardData[]>([]);
    const [teamsWithSEF, setTeamsWithSEF] = useState<Lag[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const fetchedTeams = await fetchTeamsWithSMC();

                if (!fetchedTeams || fetchedTeams.length === 0) {
                    setError("No SEF teams found");
                    return;
                }

                setTeamsWithSEF(fetchedTeams);

                const leagueIdsSet = new Set<number>();
                fetchedTeams.forEach((team: Lag) => {
                    team.seasons?.forEach((season: NonNullable<Lag["seasons"]>[number]) => {
                        season.tournaments?.forEach((tournament: NonNullable<typeof season.tournaments>[number]) => {
                            const leagueId = tournament.leagueId;
                            if (leagueId) {
                                leagueIdsSet.add(Number(leagueId));
                            }
                        });
                    });
                });
                const leagueIds = Array.from(leagueIdsSet).map(String);

                const smcTeamId = fetchedTeams[0]?.smcTeamId;

                if (!smcTeamId) {
                    setError("Ogiltigt smcTeamId.");
                    setMatches([]);
                    return;
                }

                const homeTeamId = smcTeamId;
                const awayTeamId = smcTeamId;

                const data = await getMatches(leagueIds, homeTeamId, awayTeamId);
                setMatches(data);
            } catch (err) {
                console.error("Error in UpcomingMatches:", err);
                setError("Failed to load matches");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-4 mt-[-200px] mb-20 z-100 relative">
            <MaxWidthWrapper>
                <h2 className="text-2xl font-bold text-white mb-2">Nästa match</h2>

                {loading && <p className="text-white">Laddar matcher...</p>}

                {!loading && !error && matches.length === 0 && (
                    <p className="text-white">Inga kommande matcher tillgängliga.</p>
                )}

                {!loading && !error && matches.length > 0 && teamsWithSEF && (
                    <div className="flex flex-col gap-4">
                        {matches.slice(0, 3).map((match, index) => (
                            <MatchCard
                                key={match.matchId}
                                match={match}
                                colorTheme={index === 0 ? "red" : "outline"}
                            />
                        ))}
                    </div>
                )}

                {!loading && !error && matches.length > 0 && (
                    <Button variant="outline" className="text-white text-left">
                        <Link href="/matcher">Visa alla matcher</Link>
                    </Button>
                )}
            </MaxWidthWrapper>
        </div>
    );
}
