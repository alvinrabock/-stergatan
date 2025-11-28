"use server";

import { Player } from "@/types";

export const fetchTeamPlayers = async (
  leagueId: string | number,
  teamId: string | number
): Promise<Player | null> => {
  const apiUrl = `https://smc-api.telenor.no/leagues/${leagueId}/teams/${teamId}/players`;

  const apiSecret = process.env.SMC_SECRET;

  if (!apiSecret) {
    console.error("SMC_SECRET is missing.");
    return null;
  }

  const headers = {
    'Authorization': apiSecret,
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(apiUrl, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`Error fetching team players: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
