"use server";

import { PlayerStats } from "@/types";

const apiKey = process.env.SMC_KEY;
const apiSecret = process.env.SMC_SECRET;

if (!apiKey || !apiSecret) {
  console.error("SMC API credentials are missing! Check your .env file.");
  throw new Error("SMC API credentials are missing!");
}

export const fetchMatchPlayerStats = async (
  leagueId: string | number,
  matchId: string | number,
  showHomeTeam: boolean = false,
  showAwayTeam: boolean = true
): Promise<PlayerStats | null> => {
  const apiUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches/${matchId}/live-tracking/stats/individual`;

  // Build the query string
  const queryParams = new URLSearchParams({
    showHomeTeam: showHomeTeam.toString(),
    showAwayTeam: showAwayTeam.toString(),
  }).toString();

  if (!apiSecret) {
    console.error("SMC_SECRET is missing.");
    return null;
  }

  const headers = {
    'Authorization': apiSecret,
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(`${apiUrl}?${queryParams}`, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`Error fetching stats: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
