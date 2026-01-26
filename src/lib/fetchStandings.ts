"use server"

// Server-side cache for standings data
const standingsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes - standings don't change frequently

export async function fetchStandings(leagueId: string) {
    const apiSecret = process.env.SMC_SECRET;

    // Check if API credentials are missing
    if (!apiSecret) {
      throw new Error("SMC_SECRET is missing! Check your .env file.");
    }

    // Check cache first
    const cacheKey = `standings_${leagueId}`;
    const cached = standingsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const url = `https://smc-api.telenor.no/leagues/${leagueId}/standings`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Authorization": apiSecret,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch standings");
    }

    const data = await res.json();

    // Cache the result
    standingsCache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }
  