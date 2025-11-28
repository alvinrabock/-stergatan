"use server";

import { MatchCardData, MatchEventData } from "@/types";
import { GetSelectedGames } from "./apollo/fetchTeam/GetSelectedGamesAction";
import { getLeagueCache } from "./leagueCache";

// Define the raw match data structure from the API
interface RawMatchData {
  "match-id": number;
  kickoff: string;
  "modified-date": string;
  status: string;
  "arena-name": string;
  "league-id": number;
  "home-team": string;
  "away-team": string;
  "home-engaging-team"?: string;
  "away-engaging-team"?: string;
  "round-number": number;
  "goals-home": number;
  "goals-away": number;
}

// Define the live stats structure from the API
interface RawLiveStats {
  "home-team-score": number;
  "away-team-score": number;
  "match-phase": string;
  "game-clock-in-min": number;
  "actual-start-of-first-half": string;
  "actual-end-of-first-half": string;
  "actual-start-of-second-half": string;
  "actual-end-of-second-half": string;
}

// Define the selected match structure - UPDATED with maxTickets
interface SelectedMatch {
  matchId: number;
  ticketURL: string;
  soldTickets?: number;
  customButtonText?: string;
  customButtonLink?: string;
  maxTickets?: number;
}

interface SelectedTeamData {
  selectedMatches: SelectedMatch[];
}

export async function getMatches(
  leagueIds: string[],
  teamId?: string,
  dateFrom?: string,
  dateTo?: string,
  location?: "home" | "away",
): Promise<MatchCardData[]> {
  const apiSecret = process.env.SMC_SECRET;

  if (!apiSecret) {
    throw new Error("SMC_SECRET is missing! Check your .env file.");
  }

  const headers = {
    "Authorization": apiSecret,
    "Accept": "application/json",
  };

  // Helper function to get Östers IF's team ID from the league cache
  const getOstersTeamIdFromCache = async (leagueId: string): Promise<string | null> => {
    try {
      const cache = await getLeagueCache();
      if (!cache) {
        console.warn(`⚠️  League cache not found - run cache refresh at /new-smc/admin`);
        return null;
      }

      const league = cache.leagues.find(l => l.leagueId === leagueId);
      if (!league) {
        console.warn(`⚠️  League ${leagueId} not found in cache`);
        return null;
      }

      if (!league.ostersTeamId) {
        console.warn(`⚠️  No team ID stored for league ${leagueId} - cache needs refresh`);
        return null;
      }

      console.log(`💾 Using cached team ID for league ${leagueId}: ${league.ostersTeamId}`);
      return league.ostersTeamId;
    } catch (error) {
      console.error(`❌ Error reading team ID from cache for league ${leagueId}:`, error);
      return null;
    }
  };

  // Build all API URLs using league-specific team IDs from cache
  const buildAllUrls = async () => {
    const urls: Array<{ url: string; leagueId: string }> = [];

    // Get team IDs from cache for all leagues in parallel
    const teamIdPromises = leagueIds.map(leagueId => getOstersTeamIdFromCache(leagueId));
    const teamIds = await Promise.all(teamIdPromises);

    // Build URLs with league-specific filtering
    for (let i = 0; i < leagueIds.length; i++) {
      const leagueId = leagueIds[i];
      const teamIdForLeague = teamIds[i];
      const baseUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches`;

      if (!teamIdForLeague || !teamId) {
        // If we couldn't find team ID or no filtering requested, fetch all matches
        urls.push({ url: baseUrl, leagueId });
        continue;
      }

      // Use API filtering with cached league-specific team ID
      if (location === 'home') {
        const url = `${baseUrl}?home-team-id=${teamIdForLeague}`;
        urls.push({ url, leagueId });
        console.log(`🏠 Home URL: ${url}`);
      } else if (location === 'away') {
        const url = `${baseUrl}?away-team-id=${teamIdForLeague}`;
        urls.push({ url, leagueId });
        console.log(`✈️ Away URL: ${url}`);
      } else {
        // Fetch both home and away with cached team ID
        const homeUrl = `${baseUrl}?home-team-id=${teamIdForLeague}`;
        const awayUrl = `${baseUrl}?away-team-id=${teamIdForLeague}`;
        urls.push({ url: homeUrl, leagueId });
        urls.push({ url: awayUrl, leagueId });
        console.log(`🏠 Home URL: ${homeUrl}`);
        console.log(`✈️ Away URL: ${awayUrl}`);
      }
    }

    return urls;
  };

  // Fetch all match data in parallel (maximum parallelization)
  const fetchAllMatches = async () => {
    const urlConfigs = await buildAllUrls();
    console.log(`🚀 Fetching ${urlConfigs.length} match API calls in parallel...`);

    const fetchPromises = urlConfigs.map(async ({ url, leagueId }) => {
      try {
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) {
          console.warn(`⚠️  Failed to fetch matches for league ${leagueId}: ${response.status} ${response.statusText}`);
          return []; // Return empty array instead of throwing
        }
        const data = await response.json();

        // Check if response is an array, if not return empty array
        if (!Array.isArray(data)) {
          console.warn(`⚠️  League ${leagueId} returned non-array data:`, typeof data);
          return [];
        }

        return data as RawMatchData[];
      } catch (error) {
        console.error(`❌ Error fetching league ${leagueId}:`, error);
        return []; // Return empty array on error
      }
    });

    const results = await Promise.all(fetchPromises);
    const flattenedMatches = results.flat();


    // Deduplicate by match-id (important when fetching home + away separately)
    const uniqueMatches = Array.from(
      new Map(flattenedMatches.map((m: RawMatchData) => [m["match-id"], m])).values()
    );

    return uniqueMatches;
  };

  // Start all expensive operations in parallel
  console.log("🏃‍♂️ Starting parallel fetch operations...");
  const startParallelTime = Date.now();

  const [allMatches, eventDataResponse, selectedMatches] = await Promise.all([
    fetchAllMatches(),
    fetch(
      "https://foundationapi-stage.ebiljett.nu/v1/247/events?FromDate=2025-04-08",
      {
        headers: {
          Authorization: `Basic ${process.env.EBILJETT_BASIC_AUTH}`,
        },
        cache: "no-store",
      }
    ),
    GetSelectedGames().catch(() => [] as SelectedTeamData[])
  ]);

  console.log(`✅ Parallel operations completed in ${Date.now() - startParallelTime}ms`);

  if (!Array.isArray(allMatches)) {
    console.error("Expected matches array but got:", allMatches);
    return [];
  }

  // Process event data
  let eventData: MatchEventData[] = [];
  try {
    const json = await eventDataResponse.json();
    if (Array.isArray(json)) {
      eventData = json as MatchEventData[];
    }
  } catch (error) {
    console.error("Failed to parse event data:", error);
  }

  // Pre-build event lookup map for O(1) lookups instead of O(n) finds
  const eventLookupMap = new Map<string, MatchEventData>();
  for (const event of eventData) {
    try {
      const eventDate = new Date(event.start_time);
      const eventDateStr = eventDate.toISOString().split("T")[0];
      eventLookupMap.set(eventDateStr, event);
    } catch (error) {
      console.error("Error processing event date:", error);
    }
  }

  function formatDate(date?: string): string {
    if (!date || date === "metapemushapi") return "";
    try {
      return new Date(date).toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Stockholm",
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "";
    }
  }

  // Map ticket URLs and custom button data by matchId for quick lookup - UPDATED
// Map ticket URLs and custom button data by matchId for quick lookup - UPDATED
const ticketDataMap = new Map<number, {
  ticketURL: string;
  soldTickets?: number;
  customButtonText?: string;
  customButtonLink?: string;
  maxTickets?: number;
}>();

for (const team of selectedMatches) {
  let parsedSelectedMatches: SelectedMatch[] = [];
  
  // Handle different data formats for selectedMatches
  if (Array.isArray(team.selectedMatches)) {
    parsedSelectedMatches = team.selectedMatches as SelectedMatch[];
  } else if (typeof team.selectedMatches === 'string') {
    try {
      parsedSelectedMatches = JSON.parse(team.selectedMatches) as SelectedMatch[];
    } catch {
      continue;
    }
  } else if (team.selectedMatches && typeof team.selectedMatches === 'object') {
    // If it's an object, try to extract an array from it
    if ('docs' in team.selectedMatches && Array.isArray(team.selectedMatches.docs)) {
      parsedSelectedMatches = team.selectedMatches.docs as SelectedMatch[];
    }
  } else {
    continue;
  }
  
  for (const match of parsedSelectedMatches) {
    // Explicitly cast 'match' to 'SelectedMatch' to satisfy the type checker
    const typedMatch = match as SelectedMatch; 
    if (
      typedMatch &&
      typeof typedMatch === 'object' &&
      'matchId' in typedMatch &&
      'ticketURL' in typedMatch &&
      typeof typedMatch.matchId === 'number' &&
      typeof typedMatch.ticketURL === 'string'
    ) {
      ticketDataMap.set(typedMatch.matchId, {
        ticketURL: typedMatch.ticketURL,
        soldTickets: typedMatch.soldTickets,
        customButtonText: typedMatch.customButtonText,
        customButtonLink: typedMatch.customButtonLink,
        maxTickets: typedMatch.maxTickets,
      });
    }
  }
}

  // Separate live matches for batch processing
  const liveMatches: RawMatchData[] = [];
  const nonLiveMatches: RawMatchData[] = [];

  allMatches.forEach(match => {
    if (match.status === "In progress") {
      liveMatches.push(match);
    } else {
      nonLiveMatches.push(match);
    }
  });


  // Optimized match processing with pre-built lookups - UPDATED
  const processMatch = (match: RawMatchData, liveStats?: NonNullable<MatchCardData["liveStats"]>): MatchCardData => {
    const matchKickoff = formatDate(match.kickoff);

    // Use pre-built map for O(1) event lookup
    let event: MatchEventData | undefined;
    try {
      const matchDate = new Date(match.kickoff.replace(" ", "T"));
      const matchDateStr = matchDate.toISOString().split("T")[0];
      event = eventLookupMap.get(matchDateStr);
    } catch (error) {
      console.error("Error matching event:", error);
    }

    const ticketData = ticketDataMap.get(match["match-id"]);

    // Use engaging teams as fallback if main team names are empty
    const homeTeam = match["home-team"] || match["home-engaging-team"] || "";
    const awayTeam = match["away-team"] || match["away-engaging-team"] || "";

    const matchData: MatchCardData = {
      matchId: match["match-id"],
      kickoff: matchKickoff,
      modifiedDate: new Date(match["modified-date"]).toLocaleString(),
      status: match["status"],
      arenaName: match["arena-name"],
      leagueId: match["league-id"],
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      roundNumber: match["round-number"],
      goalsHome: match["goals-home"] >= 0 ? match["goals-home"] : 0,
      goalsAway: match["goals-away"] >= 0 ? match["goals-away"] : 0,
      event: event
        ? {
          start_time: event.start_time,
          tickets_url: event.tickets_url,
          release_date: event.release_date,
        }
        : undefined,
      ticketURL: ticketData?.ticketURL || '',
      soldTickets: ticketData?.soldTickets,
      customButtonText: ticketData?.customButtonText,
      customButtonLink: ticketData?.customButtonLink,
      maxTickets: ticketData?.maxTickets,
    };

    return liveStats ? { ...matchData, liveStats } : matchData;
  };

  // Process non-live matches (fast)
  const processedNonLiveMatches = nonLiveMatches.map(match => processMatch(match));

  // Batch fetch live stats in parallel with limit to avoid overwhelming the API
  const LIVE_STATS_BATCH_SIZE = 5; // Adjust based on API rate limits
  const processedLiveMatches: MatchCardData[] = [];

  for (let i = 0; i < liveMatches.length; i += LIVE_STATS_BATCH_SIZE) {
    const batch = liveMatches.slice(i, i + LIVE_STATS_BATCH_SIZE);
    console.log(`📡 Fetching live stats batch ${Math.floor(i / LIVE_STATS_BATCH_SIZE) + 1}...`);

    const batchPromises = batch.map(async (match) => {
      try {
        const liveStatsUrl = `https://smc-api.telenor.no/leagues/${match["league-id"]}/matches/${match["match-id"]}/live-stats`;
        const response = await fetch(liveStatsUrl, { method: "GET", headers });

        if (!response.ok) {
          console.warn(`Failed to fetch live stats for match ${match["match-id"]}: ${response.statusText}`);
          return processMatch(match);
        }

        const liveStats = await response.json() as RawLiveStats;
        const formattedLiveStats = {
          "home-team-score": liveStats["home-team-score"],
          "away-team-score": liveStats["away-team-score"],
          "match-phase": liveStats["match-phase"],
          "game-clock-in-min": liveStats["game-clock-in-min"],
          "actual-start-of-first-half": liveStats["actual-start-of-first-half"],
          "actual-end-of-first-half": liveStats["actual-end-of-first-half"],
          "actual-start-of-second-half": liveStats["actual-start-of-second-half"],
          "actual-end-of-second-half": liveStats["actual-end-of-second-half"],
        };

        return processMatch(match, formattedLiveStats);
      } catch (error) {
        console.error(`Error fetching live stats for match ${match["match-id"]}:`, error);
        return processMatch(match);
      }
    });

    const batchResults = await Promise.all(batchPromises);
    processedLiveMatches.push(...batchResults);
  }

  const mergedMatches = [...processedNonLiveMatches, ...processedLiveMatches];

  // Sort matches efficiently
  const sortedMatches = mergedMatches.sort((a, b) => {
    // Status priority: In progress > others > Over
    if (a.status === "In progress" && b.status !== "In progress") return -1;
    if (b.status === "In progress" && a.status !== "In progress") return 1;
    if (a.status === "Over" && b.status !== "Over") return 1;
    if (b.status === "Over" && a.status !== "Over") return -1;

    // Then by kickoff date
    return new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
  });

  console.log(`🎯 Processed ${sortedMatches.length} total matches`);
  return sortedMatches;
}