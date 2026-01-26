"use server";

import { Player } from "@/types";

// Server-side cache for player data
const playersCache = new Map<string, { data: Player | null; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes - player rosters don't change frequently

export const fetchTeamPlayers = async (
  leagueId: string | number,
  teamId: string | number
): Promise<Player | null> => {
  const apiSecret = process.env.SMC_SECRET;

  if (!apiSecret) {
    console.error("SMC_SECRET is missing.");
    return null;
  }

  // Check cache first
  const cacheKey = `players_${leagueId}_${teamId}`;
  const cached = playersCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const apiUrl = `https://smc-api.telenor.no/leagues/${leagueId}/teams/${teamId}/players`;

  const headers = {
    'Authorization': apiSecret,
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(apiUrl, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`Error fetching team players: ${response.statusText}`);
    }
    const data = await response.json();

    // Cache the result
    playersCache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
