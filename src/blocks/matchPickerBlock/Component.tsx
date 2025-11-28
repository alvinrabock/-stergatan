'use client'

import React, { useEffect, useState } from 'react'
import type { Lag, MatchCardData, MatchPickerBlock as MatchPickerBlockProps } from '@/types'
import { getMatches } from '@/lib/fetchMatches'
import { fetchTeamsWithSMC } from '@/lib/apollo/fetchTeam/fetchTeamForMatchesAction'
import MatchCard from '@/app/components/Match/MatchCard'
import { MatchCardSkeleton } from '@/app/components/Skeletons/MatchCardSkeleton'

export const MatchPickerBlock: React.FC<MatchPickerBlockProps> = ({
    selectedSingleMatchId,
}) => {
    const [matches, setMatches] = useState<MatchCardData[]>([])
    const [_teamsWithSEF, setTeamsWithSEF] = useState<Lag[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const fetchedTeams = await fetchTeamsWithSMC()
                if (!fetchedTeams || fetchedTeams.length === 0) {
                    setError('Inga SEF-lag hittades.')
                    return
                }

                setTeamsWithSEF(fetchedTeams)

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


                const leagueIds = Array.from(leagueIdsSet).map(String)
                const smcTeamId = fetchedTeams[0]?.smcTeamId
                if (!smcTeamId) {
                    setError('Ogiltigt smcTeamId.')
                    return
                }

                const matchesData = await getMatches(leagueIds, smcTeamId, smcTeamId)
                setMatches(matchesData)
            } catch (err) {
                console.error('Fel vid hämtning av matcher:', err)
                setError('Kunde inte ladda matcher.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const selectedMatch = selectedSingleMatchId
        ? matches.find((match) => match.matchId === Number(selectedSingleMatchId))
        : undefined


    return (
        <>
            {error ? (
                <p className="text-red-600">{error}</p>
            ) : loading ? (
                <MatchCardSkeleton />
            ) : !selectedMatch ? (
                <p>Ingen match vald eller kunde inte hitta match.</p>
            ) : (
                <MatchCard
                    match={selectedMatch}
                    colorTheme="red"
                />
            )}
        </>
    )
}
