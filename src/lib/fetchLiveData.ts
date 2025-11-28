"use server";

import { Corner, Event, FreeKick, GoalEvent, MatchPhaseEvent, MedicalTreatmentEvent, RedCardEvent, SubstitutionEvent, YellowCardEvent } from "@/types";

interface EventResponse {
  Events: Event[];
  "red-card": RedCardEvent[];
  "yellow-card": YellowCardEvent[];
  goal: GoalEvent[];
  "match-phase": MatchPhaseEvent[];
  "medical-treatment": MedicalTreatmentEvent[];
  substitution: SubstitutionEvent[];
  corner: Corner[];
  "free-kick": FreeKick[];
}

const fetchEvents = async (
  leagueId: string | number,
  matchId: string | number,
  eventId?: number
): Promise<EventResponse | null> => {
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

  const baseUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches/${matchId}/events`;
  const url = eventId ? `${baseUrl}?event-id=${eventId}` : baseUrl;

  const headers = {
    'Authorization': apiSecret,
    'Accept': 'application/json',
    'Cache-Control': 'no-cache', // Ensure fresh data for live events
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, { 
      method: 'GET', 
      headers,
      signal: controller.signal,
      // Add performance optimizations
      cache: 'no-store', // Don't cache live data
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // More specific error handling
      if (response.status === 404) {
        console.warn(`Events not found for match ${matchId} in league ${leagueId}`);
        return null;
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: EventResponse = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Events fetch timeout');
        return null;
      }
      console.error(`Events fetch error: ${error.message}`);
    } else {
      console.error('Unknown events fetch error:', error);
    }
    return null;
  }
};

export default fetchEvents;