"use server";

import { LiveStats } from "@/types";

const fetchLiveStats = async (
  leagueId: string | number,
  matchId: string | number
): Promise<LiveStats | null> => {
  // Input validation
  if (!leagueId || !matchId) {
    console.error("Invalid leagueId or matchId provided");
    return null;
  }

  const apiSecret = process.env.SMC_SECRET;

  if (!apiSecret) {
    console.error("SMC_SECRET is missing");
    return null;
  }

  const url = `https://smc-api.telenor.no/leagues/${leagueId}/matches/${matchId}/live-stats`;

  const headers = {
    'Authorization': apiSecret,
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for live stats

  try {
    const response = await fetch(url, { 
      method: 'GET', 
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Live stats not found for match ${matchId} in league ${leagueId}`);
        return null;
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Basic validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data as LiveStats;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Live stats fetch timeout');
        return null;
      }
      console.error(`Live stats fetch error: ${error.message}`);
    } else {
      console.error('Unknown live stats fetch error:', error);
    }
    return null;
  }
};

export default fetchLiveStats;