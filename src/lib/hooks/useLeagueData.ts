"use client";

import { useState, useEffect } from 'react';

interface LeagueData {
  teamId: string;
  leagues: Array<{
    leagueId: string;
    seasonYear: string;
    ostersTeamId?: string;
  }>;
}

interface CachedResponse {
  data: LeagueData | null;
  timestamp: number;
}

// In-memory cache with 30-second expiry
let cachedLeagueData: CachedResponse | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

// Track ongoing fetch promise to prevent duplicate requests
let ongoingFetch: Promise<LeagueData | null> | null = null;

async function fetchLeagueData(): Promise<LeagueData | null> {
  // Check if we have valid cached data
  if (cachedLeagueData && (Date.now() - cachedLeagueData.timestamp) < CACHE_DURATION) {
    console.log('✅ Using cached league data');
    return cachedLeagueData.data;
  }

  // If there's an ongoing fetch, wait for it instead of creating a new one
  if (ongoingFetch) {
    console.log('⏳ Waiting for ongoing league data fetch');
    return ongoingFetch;
  }

  // Start a new fetch
  console.log('🔄 Fetching fresh league data');
  ongoingFetch = (async () => {
    try {
      const response = await fetch('/api/discover-leagues');
      const cacheData = await response.json();

      if (!cacheData.success || !cacheData.data) {
        ongoingFetch = null;
        return null;
      }

      const leagueData = cacheData.data;

      // Update cache
      cachedLeagueData = {
        data: leagueData,
        timestamp: Date.now(),
      };

      ongoingFetch = null;
      return leagueData;
    } catch (error) {
      console.error('Error fetching league data:', error);
      ongoingFetch = null;
      return null;
    }
  })();

  return ongoingFetch;
}

export function useLeagueData() {
  const [data, setData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const leagueData = await fetchLeagueData();

        if (!mounted) return;

        if (!leagueData) {
          setError("Kunde inte ladda ligainformation.");
          setData(null);
        } else {
          setData(leagueData);
          setError(null);
        }
      } catch {
        if (!mounted) return;
        setError("Ett fel uppstod vid laddning av data.");
        setData(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
