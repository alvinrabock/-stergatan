"use server";

import { GoalEvent } from "@/types";

const fetchGoalEvents = async (
  leagueId: string | number,
  matchId: string | number,
  eventId?: number,
  externalEventId?: string
): Promise<GoalEvent[] | GoalEvent | null> => {
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

  const baseUrl = `https://smc-api.telenor.no/leagues/${leagueId}/matches/${matchId}/events/goal`;

  // Build query parameters more efficiently
  const searchParams = new URLSearchParams();
  if (eventId && eventId > 0) {
    searchParams.append('event-id', eventId.toString());
  }
  if (externalEventId?.trim()) {
    searchParams.append('external-event-id', externalEventId.trim());
  }

  const url = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

  const headers = {
    'Authorization': apiSecret,
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for goal events

  try {
    const response = await fetch(url, { 
      method: 'GET', 
      headers,
      signal: controller.signal,
      cache: 'no-store', // Don't cache live goal data
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Specific error handling
      if (response.status === 404) {
        console.warn(`Goal events not found for match ${matchId} in league ${leagueId}`);
        return null;
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data) {
      return null;
    }

    // Handle both single goal and array of goals
    if (Array.isArray(data)) {
      // Validate each goal event in the array
      const validGoals = data.filter(goal => 
        goal && typeof goal === 'object' && goal['player-id']
      );
      return validGoals.length > 0 ? validGoals as GoalEvent[] : null;
    } else if (typeof data === 'object' && data['player-id']) {
      // Single goal event
      return data as GoalEvent;
    }

    // Invalid data structure
    console.warn('Invalid goal events response structure');
    return null;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Goal events fetch timeout');
        return null;
      }
      console.error(`Goal events fetch error: ${error.message}`);
    } else {
      console.error('Unknown goal events fetch error:', error);
    }
    return null;
  }
};

export default fetchGoalEvents;