"use server";

import { Match, Player, Referee } from "@/types";
import { GetSelectedGames } from "./apollo/fetchTeam/GetSelectedGamesAction";

// Add server-side caching
const serverCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Updated type definition for selected match data
interface SelectedMatchData {
    matchId: number;
    ticketURL: string;
    soldTickets?: number;
    customButtonText?: string;
    customButtonLink?: string;
    maxTickets?: number;
}

// Add interface for event data
interface EventData {
    start_time: string;
    tickets_url: string;
    release_date: string;
}

export async function getSingleMatch(leagueId: string, matchId: string): Promise<Match> {
    const apiSecret = process.env.SMC_SECRET;

    if (!apiSecret) {
        throw new Error("SMC_SECRET is missing! Check your .env file.");
    }

    // Check cache first
    const cacheKey = `match_${leagueId}_${matchId}`;
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('🎯 Cache hit for match:', cacheKey);
        return cached.data;
    }

    // Fetch match details, ticket data, and event data in parallel
    const [matchDetailsResult, ticketDataResult, eventDataResult] = await Promise.allSettled([
        fetchMatchDetails(leagueId, matchId, apiSecret),
        getMatchTicketData(matchId),
        fetchEventData()
    ]);

    if (matchDetailsResult.status === 'rejected') {
        throw new Error(`Failed to fetch match details: ${matchDetailsResult.reason}`);
    }

    const matchDetails = matchDetailsResult.value;
    const ticketData = ticketDataResult.status === 'fulfilled' ? ticketDataResult.value : {
        ticketURL: '',
        soldTickets: undefined,
        customButtonText: undefined,
        customButtonLink: undefined,
        maxTickets: undefined
    };
    const eventData = eventDataResult.status === 'fulfilled' ? eventDataResult.value : [];

    // Find matching event for this match
    let matchingEvent: EventData | undefined = undefined;
    try {
        const matchDate = new Date(matchDetails.kickoff);
        const matchDateStr = matchDate.toISOString().split("T")[0];
        matchingEvent = eventData.find((event: EventData) => {
            const eventDate = new Date(event.start_time);
            const eventDateStr = eventDate.toISOString().split("T")[0];
            return eventDateStr === matchDateStr;
        });
    } catch (error) {
        console.error("Error matching event:", error);
    }
    
    // Build match object with all ticket data
    // Use engaging teams as fallback if main team names are empty
    const homeTeamValue = String(matchDetails["home-team"]);
    const awayTeamValue = String(matchDetails["away-team"]);
    const homeEngagingTeamValue = String(matchDetails["home-engaging-team"]);
    const awayEngagingTeamValue = String(matchDetails["away-engaging-team"]);

    const match: Match = {
        matchId: formatNumber(matchDetails["match-id"]),
        extMatchId: String(matchDetails["ext-match-id"]),
        kickoff: matchDetails.kickoff,
        modifiedDate: formatDate(matchDetails["modified-date"]),
        matchTotalTime: formatNumber(matchDetails["match-total-time"]),
        statusId: formatNumber(matchDetails["status-id"]),
        status: String(matchDetails["status"]),
        seasonId: formatNumber(matchDetails["season-id"]),
        season: String(matchDetails["season"]),
        arenaId: formatNumber(matchDetails["arena-id"]),
        arenaName: String(matchDetails["arena-name"]),
        leagueId: formatNumber(matchDetails["league-id"]),
        leagueName: String(matchDetails["league-name"]),
        homeTeam: homeTeamValue || homeEngagingTeamValue,
        homeTeamId: String(matchDetails["home-team-id"]),
        extHomeTeamId: String(matchDetails["ext-home-team-id"]),
        awayTeam: awayTeamValue || awayEngagingTeamValue,
        awayTeamId: String(matchDetails["away-team-id"]),
        extAwayTeamId: String(matchDetails["ext-away-team-id"]),
        roundNumber: formatNumber(matchDetails["round-number"]),
        homeEngagingTeam: homeEngagingTeamValue,
        awayEngagingTeam: awayEngagingTeamValue,
        attendees: matchDetails["attendees"] ? Number(matchDetails["attendees"]) : null,
        goalsHome: formatNumber(matchDetails["goals-home"]),
        goalsAway: formatNumber(matchDetails["goals-away"]),
        homeLineup: formatLineup(matchDetails["home-lineup"]),
        awayLineup: formatLineup(matchDetails["away-lineup"]),
        referees: formatReferees(matchDetails.referees),
        // Updated to include all ticket data
        ticketURL: ticketData.ticketURL,
        soldTickets: ticketData.soldTickets,
        customButtonText: ticketData.customButtonText,
        customButtonLink: ticketData.customButtonLink,
        maxTickets: ticketData.maxTickets,
        event: matchingEvent ? {
            start_time: matchingEvent.start_time,
            tickets_url: matchingEvent.tickets_url,
            release_date: matchingEvent.release_date,
        } : undefined,
    };

    // Cache the result
    serverCache.set(cacheKey, { data: match, timestamp: Date.now() });
    console.log('💾 Cached match:', cacheKey);

    return match;
}

// Updated function to get all ticket data when needed
export async function getMatchTicketData(matchId: number | string): Promise<{
    ticketURL: string;
    soldTickets?: number;
    customButtonText?: string;
    customButtonLink?: string;
    maxTickets?: number;
}> {
    const cacheKey = `ticketdata_${matchId}`;
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const selectedMatches = await GetSelectedGames();
        const ticketDataMap = new Map<number, {
            ticketURL: string;
            soldTickets?: number;
            customButtonText?: string;
            customButtonLink?: string;
            maxTickets?: number;
        }>();

        for (const team of selectedMatches) {
            if (Array.isArray(team.selectedMatches)) {
                for (const match of team.selectedMatches as SelectedMatchData[]) {
                    if (match.matchId) {
                        ticketDataMap.set(match.matchId, {
                            ticketURL: match.ticketURL || '',
                            soldTickets: match.soldTickets,
                            customButtonText: match.customButtonText,
                            customButtonLink: match.customButtonLink,
                            maxTickets: match.maxTickets
                        });
                    }
                }
            }
        }

        // Convert matchId to number for lookup if it's a string
        const numericMatchId = typeof matchId === 'string' ? parseInt(matchId, 10) : matchId;
        const ticketData = ticketDataMap.get(numericMatchId) ?? {
            ticketURL: '',
            soldTickets: undefined,
            customButtonText: undefined,
            customButtonLink: undefined,
            maxTickets: undefined
        };

        serverCache.set(cacheKey, { data: ticketData, timestamp: Date.now() });
        return ticketData;
    } catch (error) {
        console.warn('Failed to fetch ticket data:', error);
        return {
            ticketURL: '',
            soldTickets: undefined,
            customButtonText: undefined,
            customButtonLink: undefined,
            maxTickets: undefined
        };
    }
}

// Keep the original getMatchTicketURL for backward compatibility
export async function getMatchTicketURL(matchId: number | string): Promise<string> {
    const ticketData = await getMatchTicketData(matchId);
    return ticketData.ticketURL;
}

// Function to fetch event data
async function fetchEventData(): Promise<EventData[]> {
    try {
        const response = await fetch(
            "https://foundationapi-stage.ebiljett.nu/v1/247/events?FromDate=2025-04-08",
            {
                headers: {
                    Authorization: `Basic ${process.env.EBILJETT_BASIC_AUTH}`,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            console.warn('Failed to fetch event data:', response.statusText);
            return [];
        }

        const json = await response.json();
        return Array.isArray(json) ? json as EventData[] : [];
    } catch (error) {
        console.error('Error fetching event data:', error);
        return [];
    }
}

// Optimized fetch with better timeout and caching for new SMC API 2.0
async function fetchMatchDetails(leagueId: string, matchId: string, apiSecret: string) {
    const matchUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches/${matchId}`;

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
        const response = await fetch(matchUrl, {
            method: "GET",
            headers: {
                "Authorization": apiSecret,
                "Accept": "application/json",
            },
            signal: controller.signal,
            next: { revalidate: 60 } // Cache for 60 seconds (more frequent for live matches)
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch match details: ${response.statusText}. Details: ${errorText}`);
        }

        const data = await response.json();
        const matchDetails = data["match-details"];

        if (!matchDetails) {
            throw new Error("Missing match details in API response.");
        }

        return {
            ...matchDetails,
            kickoff: formatDate(matchDetails.kickoff)
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

// Keep existing helper functions (optimized)
function formatDate(date: string): string {
    if (!date) return "";
    try {
        return new Date(date).toISOString();
    } catch (e) {
        console.error("Date formatting error:", e);
        return "";
    }
}

function formatNumber(value: number): number {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
}

// Optimized lineup formatting
const formatLineup = (lineup: { formation?: string; players?: Player[] } | undefined) => {
    if (!lineup) return { formation: "", players: [] };
    
    return {
        formation: lineup.formation || "",
        players: lineup.players?.map((player: Player) => ({
            "player-id": formatNumber(player["player-id"]),
            "ext-player-id": formatNumber(player["ext-player-id"]),
            "player-name": String(player["player-name"] || ""),
            "given-name": String(player["given-name"] || ""),
            "surname": String(player["surname"] || ""),
            position: String(player.position || ""),
            "position-index-from-back-right": String(player["position-index-from-back-right"] || ""),
            "shirt-number": formatNumber(player["shirt-number"]),
        })) || [],
    };
};

// Optimized referee formatting
const formatReferees = (referees: {
    "referee-id": number;
    "ext-referee-id": string;
    "referee-name": string;
    "role-name": string;
    "main-referee": boolean;
}[]): Referee[] => {
    if (!referees || !Array.isArray(referees)) return [];
    
    return referees.map((referee) => ({
        refereeId: formatNumber(referee["referee-id"]),
        extRefereeId: String(referee["ext-referee-id"] || ""),
        name: String(referee["referee-name"] || ""),
        role: String(referee["role-name"] || ""),
        mainReferee: Boolean(referee["main-referee"]),
    }));
};