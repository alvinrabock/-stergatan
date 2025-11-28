"use client";

import React, { useEffect, useMemo, useState } from "react";
import MatchCard from "@/app/components/Match/MatchCard";
import { Lag, MatchCardData } from "@/types";
import { getMatches } from "@/lib/fetchMatches";
import { fetchTeamsWithSMC } from "@/lib/apollo/fetchTeam/fetchTeamForMatchesAction";
import { Button } from "../ui/Button";
import Link from "next/link";
import { MatchCardSkeleton } from "../Skeletons/MatchCardSkeleton";

export default function SenastSpeladeMatcher() {
    const [matches, setMatches] = useState<MatchCardData[]>([]);
    const [_teamsWithSEF, setTeamsWithSEF] = useState<Lag[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedTeams = await fetchTeamsWithSMC();

                if (!fetchedTeams || fetchedTeams.length === 0) {
                    setError("Inga SEF-lag hittades.");
                    setMatches([]);
                    return;
                }

                setTeamsWithSEF(fetchedTeams);

                const leagueIdsSet = new Set<number>();
                fetchedTeams.forEach((team: Lag) => {
                    team.seasons?.forEach((season) => {
                        season?.tournaments?.forEach((tournament) => {
                            if (tournament?.leagueId) {
                                leagueIdsSet.add(Number(tournament.leagueId));
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
    }, []);

    // ✅ Memoized 4 latest played matches
    const latestPlayedMatches = useMemo(() => {
        return matches.slice(0, 4);
    }, [matches]);

    return (
        <div className="flex flex-col gap-4 p-6 w-full rounded-md">
            <h2 className="text-3xl font-bold mb-8 text-left">Senast spelade matcher</h2>

            {matches.length === 0 && !error ? (
                <div className="flex flex-col gap-4">
                    {[...Array(4)].map((_, i) => (
                        <MatchCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-500 text-white p-4 rounded-md text-center">{error}</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {latestPlayedMatches.map((match) => (
                        <MatchCard
                            key={match.matchId}
                            match={match}
                            colorTheme="outline"
                        />
                    ))}
                </div>
            )}

            <Button variant="outline" className="text-left">
                <Link href="/matcher">Visa alla matcher</Link>
            </Button>
        </div>
    );
}
