"use client";

import { useState, useEffect } from 'react';
import { fetchSportomediaMatch, SportomediaMatchData } from './Superadmin/fetchSportomediaMatch';

export function useSportomediaMatch(
    league: string | undefined,
    season: string | undefined,
    extMatchId: string | undefined
) {
    const [data, setData] = useState<SportomediaMatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset state when params change
        setLoading(true);
        setError(null);

        // Validate params
        if (!league || !season || !extMatchId) {
            console.log('⚠️ Missing Sportomedia params:', { league, season, extMatchId });
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                console.log('📡 Fetching Sportomedia match data:', { league, season, extMatchId });
                const matchData = await fetchSportomediaMatch({
                    league,
                    season,
                    matchId: extMatchId
                });

                setData(matchData);
                setError(null);
            } catch (err) {
                console.error('❌ Failed to fetch Sportomedia match:', err);
                setError(err instanceof Error ? err.message : 'Failed to load match data');
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [league, season, extMatchId]);

    return { data, loading, error };
}
