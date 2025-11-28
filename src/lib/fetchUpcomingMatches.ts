"use server";

import { MatchCardData } from "@/types";
import { GetSelectedGames } from "./apollo/fetchTeam/GetSelectedGamesAction";

// Cache for API responses (5 minutes)
const cache = new Map<string, { data: SMCMatch[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Optimized date formatter with memoization
const dateFormatCache = new Map<string, string>();
const formatDate = (date?: string): string => {
  if (!date || date === "metapemushapi") return "";
  
  if (dateFormatCache.has(date)) {
    return dateFormatCache.get(date)!;
  }
  
  try {
    const formatted = new Date(date).toISOString();
    dateFormatCache.set(date, formatted);
    return formatted;
  } catch {
    dateFormatCache.set(date, "");
    return "";
  }
};

// Define proper types for API responses
interface SMCMatch {
  "match-id": number;
  kickoff: string;
  "modified-date": string;
  status: string;
  "arena-name": string;
  "league-id": string;
  "home-team": string;
  "away-team": string;
  "round-number": number;
  "goals-home": number;
  "goals-away": number;
}

export async function getUpcomingMatches(
  leagueIds: string[],
  homeTeamId?: string,
  awayTeamId?: string
): Promise<MatchCardData[]> {
  console.time('Total getUpcomingMatches');

  const apiSecret = process.env.SMC_SECRET;

  if (!apiSecret) {
    throw new Error("SMC_SECRET is missing! Check your .env file.");
  }

  // Pre-create headers object with caching
  const headers = {
    "Authorization": apiSecret,
    "Accept": "application/json",
    "Cache-Control": "max-age=300", // 5 minutes
  };

  // Optimized fetch function with caching and better error handling
  const fetchMatches = async (url: string): Promise<SMCMatch[]> => {
    // Check cache first
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for: ${url}`);
      return cached.data;
    }

    console.time(`API Request: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as SMCMatch[];
      
      // Cache the response
      cache.set(url, { data, timestamp: Date.now() });
      
      console.timeEnd(`API Request: ${url}`);
      return data;
    } catch (error) {
      console.timeEnd(`API Request: ${url}`);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout for ${url}`);
      }
      throw error;
    }
  };

  // Build URLs more efficiently - single request per league with client-side filtering
  const buildUrls = (leagueIds: string[]) => {
    return leagueIds.map(leagueId => {
      const baseUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches`;
      // Add query parameters to limit results and improve performance
      return `${baseUrl}?limit=100&sort=kickoff`;
    });
  };

  // Start GraphQL fetch early (parallel with API calls)
  console.time('GraphQL GetSelectedGames');
  const selectedMatchesPromise = GetSelectedGames()
    .then(result => {
      console.timeEnd('GraphQL GetSelectedGames');
      return result;
    })
    .catch(error => {
      console.timeEnd('GraphQL GetSelectedGames');
      console.warn('GetSelectedGames failed:', error);
      return [];
    });

  // Fetch all matches for all leagues in parallel
  console.time('All API Requests');
  const urls = buildUrls(leagueIds);
  const allFetchPromises = urls.map(url => 
    fetchMatches(url).catch(error => {
      console.error(`Failed to fetch from ${url}:`, error);
      return []; // Return empty array on error to prevent Promise.all from failing
    })
  );

  const [allMatchResults, selectedMatches] = await Promise.all([
    Promise.all(allFetchPromises),
    selectedMatchesPromise
  ]);
  console.timeEnd('All API Requests');

  console.time('Data Processing');

  // Flatten and filter matches in one pass
  const matchMap = new Map<number, SMCMatch>();
  const now = new Date().getTime();
  
  for (const matches of allMatchResults) {
    for (const match of matches) {
      // Client-side filtering for team IDs if specified
      const matchesTeamFilter = 
        (!homeTeamId && !awayTeamId) || 
        (homeTeamId && match["home-team"].includes(homeTeamId.toString())) ||
        (awayTeamId && match["away-team"].includes(awayTeamId.toString()));
      
      if (matchesTeamFilter) {
        // Only include recent and upcoming matches to reduce processing
        const kickoffTime = new Date(match.kickoff).getTime();
        const isRecentOrUpcoming = kickoffTime > now - (7 * 24 * 60 * 60 * 1000); // Last 7 days
        
        if (isRecentOrUpcoming) {
          matchMap.set(match["match-id"], match);
        }
      }
    }
  }

  // Build ticket URL map efficiently
  const ticketURLMap = new Map<number, string>();
  if (selectedMatches && Array.isArray(selectedMatches)) {
    for (const team of selectedMatches) {
      if (team?.selectedMatches && Array.isArray(team.selectedMatches)) {
        for (const match of team.selectedMatches) {
          if (
            match &&
            typeof match === 'object' &&
            'matchId' in match &&
            'ticketURL' in match &&
            typeof match.matchId === 'number' &&
            typeof match.ticketURL === 'string'
          ) {
            ticketURLMap.set(match.matchId, match.ticketURL);
          }
        }
      }
    }
  }

  // Convert to array and categorize matches efficiently
  const matches = Array.from(matchMap.values());
  const scheduledMatches: MatchCardData[] = [];
  const completedMatches: MatchCardData[] = [];
  
  // Process matches with early termination optimization
  for (const match of matches) {
    const formattedMatch: MatchCardData = {
      matchId: match["match-id"],
      kickoff: formatDate(match.kickoff),
      modifiedDate: new Date(match["modified-date"]).toLocaleString(),
      status: match["status"],
      arenaName: match["arena-name"] || "Unknown Arena",
      leagueId: typeof match["league-id"] === 'string' ? match["league-id"] : String(match["league-id"]),
      homeTeam: match["home-team"] || "Unknown Team",
      awayTeam: match["away-team"] || "Unknown Team",
      roundNumber: match["round-number"] || 0,
      goalsHome: Math.max(0, match["goals-home"] || 0),
      goalsAway: Math.max(0, match["goals-away"] || 0),
      ticketURL: ticketURLMap.get(match["match-id"]) || "",
    };

    if (match.status === "Scheduled") {
      scheduledMatches.push(formattedMatch);
    } else if (match.status === "Over") {
      completedMatches.push(formattedMatch);
    }
  }

  // Sort only the matches we need
  scheduledMatches.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  completedMatches.sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

  // Combine results efficiently
  const result = [...scheduledMatches.slice(0, 5)];
  if (result.length < 5) {
    result.push(...completedMatches.slice(0, 5 - result.length));
  }

  console.timeEnd('Data Processing');
  console.timeEnd('Total getUpcomingMatches');

  return result.slice(0, 5);
}

// Cleanup function to prevent memory leaks
export function clearMatchCache() {
  cache.clear();
  dateFormatCache.clear();
}

// Optional: Auto-cleanup old cache entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);