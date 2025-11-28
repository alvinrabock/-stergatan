"use server";

import { LiveStats, PlayerStats, Event, GoalEvent, SMCMatchPhaseTypes } from "@/types";

// Shared configuration
const API_CONFIG = {
  baseURL: 'https://smc-api.telenor.no',
  timeout: 5000, // Reduced from 8-10s
  retries: 2,
};

// Define proper types for card events
interface CardEvent {
  "event-id": number;
  "player-id": number;
  "player-team-id": number;
  "general-event-data": {
    "game-clock-in-min": string;
    "event-score": string;
  };
}

interface MedicalEvent {
  "event-id": number;
  "player-id": number;
  "player-team-id": number;
  "general-event-data": {
    "game-clock-in-min": string;
  };
}

interface SubstitutionEvent {
  "event-id": number;
  "player-id": number;
  "substitute-player-id": number;
  "player-team-id": number;
  "general-event-data": {
    "game-clock-in-min": string;
  };
}

interface CornerEvent {
  "event-id": number;
  "player-team-id": number;
  "general-event-data": {
    "game-clock-in-min": string;
  };
}

interface FreeKickEvent {
  "event-id": number;
  "player-team-id": number;
  "general-event-data": {
    "game-clock-in-min": string;
  };
}

interface MatchPhaseEvent {
  "event-id": number;
  "event-type": string;
  "general-event-data": {
    "game-clock-in-min": string;
  };
}

// Shared headers factory
const createHeaders = () => {
  const apiSecret = process.env.SMC_SECRET;

  if (!apiSecret) {
    throw new Error("SMC_SECRET is missing");
  }

  return {
    'Authorization': apiSecret,
    'Accept': 'application/json',
    'Connection': 'keep-alive', // Reuse connections
  };
};

// Optimized fetch utility with connection pooling and retry logic
const fetchWithRetry = async (
  url: string, 
  options: RequestInit = {},
  retries = API_CONFIG.retries
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Add performance optimizations
      keepalive: true, // Keep connections alive
      cache: 'no-store', // Ensure fresh data
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Exponential backoff for rate limits
        await new Promise(resolve => setTimeout(resolve, 1000 * (API_CONFIG.retries - retries + 1)));
        return fetchWithRetry(url, options, retries - 1);
      }
      
      if (response.status === 404) {
        throw new Error(`Resource not found: ${response.status}`);
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        if (retries > 0) {
          console.warn(`Request timeout, retrying... (${retries} attempts left)`);
          return fetchWithRetry(url, options, retries - 1);
        }
        throw new Error('Request timeout after retries');
      }
    }
    
    throw error;
  }
};

// Input validation utility
const validateInputs = (leagueId: string | number, matchId: string | number): boolean => {
  return !!leagueId && !!matchId;
};

// OPTIMIZED LIVE STATS FETCH
export const fetchLiveStats = async (
  leagueId: string | number,
  matchId: string | number
): Promise<LiveStats | null> => {
  if (!validateInputs(leagueId, matchId)) {
    console.error("Invalid leagueId or matchId provided");
    return null;
  }

  try {
    const url = `${API_CONFIG.baseURL}/leagues/${leagueId}/matches/${matchId}/live-stats`;
    const headers = createHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data as LiveStats;
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn(`Live stats not available for match ${matchId}`);
      return null;
    }
    
    console.error(`Live stats fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// OPTIMIZED PLAYER STATS FETCH
export const fetchMatchPlayerStats = async (
  leagueId: string | number,
  matchId: string | number,
  showHomeTeam: boolean = false,
  showAwayTeam: boolean = true
): Promise<PlayerStats | null> => {
  if (!validateInputs(leagueId, matchId)) {
    console.error("Invalid leagueId or matchId provided");
    return null;
  }

  try {
    const searchParams = new URLSearchParams({
      showHomeTeam: showHomeTeam.toString(),
      showAwayTeam: showAwayTeam.toString(),
    });

    const url = `${API_CONFIG.baseURL}/leagues/${leagueId}/matches/${matchId}/live-tracking/stats/individual?${searchParams}`;
    const headers = createHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return data as PlayerStats;
  } catch (error) {
    console.error(`Player stats fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// OPTIMIZED EVENTS FETCH
interface EventResponse {
  Events: Event[];
  "red-card": CardEvent[];
  "yellow-card": CardEvent[];
  goal: GoalEvent[];
  "match-phase": MatchPhaseEvent[];
  "medical-treatment": MedicalEvent[];
  substitution: SubstitutionEvent[];
  corner: CornerEvent[];
  "free-kick": FreeKickEvent[];
}

export const fetchEvents = async (
  leagueId: string | number,
  matchId: string | number,
  eventId?: number
): Promise<EventResponse | null> => {
  if (!validateInputs(leagueId, matchId)) {
    console.error("Invalid leagueId or matchId provided");
    return null;
  }

  try {
    const searchParams = new URLSearchParams();
    if (eventId && eventId > 0) {
      searchParams.append('event-id', eventId.toString());
    }

    const url = `${API_CONFIG.baseURL}/leagues/${leagueId}/matches/${matchId}/events${searchParams.toString() ? `?${searchParams}` : ''}`;
    const headers = createHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data as EventResponse;
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn(`Events not available for match ${matchId}`);
      return null;
    }
    
    console.error(`Events fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// FETCH LEAGUE PLAYERS TO GET PLAYER NAMES BY ULID
export const fetchLeaguePlayers = async (
  leagueId: string | number
): Promise<Map<string, string>> => {
  if (!leagueId) {
    console.error("Invalid leagueId provided");
    return new Map();
  }

  try {
    const url = `${API_CONFIG.baseURL}/leagues/${leagueId}/players`;
    console.log('🔗 Fetching league players:', url);

    const headers = createHeaders();
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('✅ League players response (first 3):', Array.isArray(data) ? data.slice(0, 3) : data);

    if (!Array.isArray(data)) {
      console.error('Expected array of players, got:', typeof data);
      return new Map();
    }

    // Create a map of player ULID to player name
    const playerMap = new Map<string, string>();
    data.forEach((player: any) => {
      const playerId = player['player-id'];
      const playerName = player['player-name'] || player['name'];

      if (playerId && playerName) {
        playerMap.set(String(playerId), playerName);
      }
    });

    console.log(`✅ Created player map with ${playerMap.size} players from league data`);
    return playerMap;
  } catch (error) {
    console.error("Error fetching league players:", error);
    return new Map();
  }
};

// OPTIMIZED GOAL EVENTS FETCH WITH FOGIS CONTEXT SUPPORT
export const fetchGoalEvents = async (
  leagueId: string | number,
  matchId: string | number,
  eventId?: number,
  externalEventId?: string,
  useFogisContext?: boolean,  // New parameter to use Fogis context
  extLeagueId?: string,        // Fogis league ID
  extMatchId?: string          // Fogis match ID
): Promise<GoalEvent[] | GoalEvent | null> => {
  if (!validateInputs(leagueId, matchId)) {
    console.error("Invalid leagueId or matchId provided");
    return null;
  }

  try {
    const searchParams = new URLSearchParams();
    if (eventId && eventId > 0) {
      searchParams.append('event-id', eventId.toString());
    }
    if (externalEventId?.trim()) {
      searchParams.append('external-event-id', externalEventId.trim());
    }

    // Log all parameters for debugging
    console.log('🔍 fetchGoalEvents parameters:', {
      useFogisContext,
      extLeagueId,
      extMatchId,
      leagueId,
      matchId,
      typeOfExtLeagueId: typeof extLeagueId,
      typeOfExtMatchId: typeof extMatchId,
    });

    // Use Fogis context endpoint if ext IDs are provided
    let url: string;
    if (useFogisContext && extLeagueId && extMatchId) {
      console.log('🔑 Attempting Fogis context for goal events:', { extLeagueId, extMatchId });
      url = `${API_CONFIG.baseURL}/fogis/leagues/${extLeagueId}/matches/${extMatchId}/events/goal${searchParams.toString() ? `?${searchParams}` : ''}`;
    } else {
      console.log('🔑 Using regular goal events endpoint', {
        reason: !useFogisContext ? 'useFogisContext is false' :
                !extLeagueId ? 'extLeagueId is missing' :
                !extMatchId ? 'extMatchId is missing' : 'unknown'
      });
      url = `${API_CONFIG.baseURL}/leagues/${leagueId}/matches/${matchId}/events/goal${searchParams.toString() ? `?${searchParams}` : ''}`;
    }

    console.log('🔗 Goal events URL:', url);
    const headers = createHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('✅ Goal events response:', data);
    
    if (!data) {
      return null;
    }

    // Handle both single goal and array of goals
    if (Array.isArray(data)) {
      const validGoals = data.filter(goal => 
        goal && typeof goal === 'object' && goal['player-id']
      );
      return validGoals.length > 0 ? validGoals as GoalEvent[] : null;
    } else if (typeof data === 'object' && data['player-id']) {
      return data as GoalEvent;
    }

    return null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn(`Goal events not available for match ${matchId}`);
      return null;
    }
    
    console.error(`Goal events fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// OPTIMIZED MATCH PHASE FETCH
export const fetchMatchPhase = async (
  leagueId: string | number,
  matchId: string | number
): Promise<SMCMatchPhaseTypes | null> => {
  if (!validateInputs(leagueId, matchId)) {
    console.error("Invalid leagueId or matchId provided");
    return null;
  }

  try {
    const url = `${API_CONFIG.baseURL}/leagues/${leagueId}/matches/${matchId}/events/match-phase`;
    const headers = createHeaders();

    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data as SMCMatchPhaseTypes;
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn(`Match phase not available for match ${matchId}`);
      return null;
    }
    
    console.error(`Match phase fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// Define proper return type for bulk fetch
interface BulkFetchResult {
  liveStats?: LiveStats | null;
  events?: EventResponse | null;
  goals?: GoalEvent[] | GoalEvent | null;
  matchPhase?: SMCMatchPhaseTypes | null;
  playerStats?: PlayerStats | null;
}

// BULK FETCH UTILITY for parallel requests with Fogis context support
export const fetchMatchDataBulk = async (
  leagueId: string | number,
  matchId: string | number,
  options: {
    includeLiveStats?: boolean;
    includeEvents?: boolean;
    includeGoals?: boolean;
    includeMatchPhase?: boolean;
    includePlayerStats?: boolean;
    useFogisContext?: boolean;    // Use Fogis context for goal events
    extLeagueId?: string;           // Fogis league ID
    extMatchId?: string;            // Fogis match ID
  } = {}
): Promise<BulkFetchResult> => {
  if (!validateInputs(leagueId, matchId)) {
    throw new Error("Invalid leagueId or matchId provided");
  }

  const {
    includeLiveStats = true,
    includeEvents = true,
    includeGoals = true,
    includeMatchPhase = true,
    includePlayerStats = false, // Optional since it might not always be needed
    useFogisContext = false,
    extLeagueId,
    extMatchId,
  } = options;

  // Create array of promises for parallel execution - using unknown for simpler type handling
  const promises: Promise<unknown>[] = [];
  const promiseKeys: (keyof BulkFetchResult)[] = [];

  if (includeLiveStats) {
    promises.push(fetchLiveStats(leagueId, matchId));
    promiseKeys.push('liveStats');
  }

  if (includeEvents) {
    promises.push(fetchEvents(leagueId, matchId));
    promiseKeys.push('events');
  }

  if (includeGoals) {
    console.log('📦 fetchMatchDataBulk calling fetchGoalEvents with:', {
      leagueId,
      matchId,
      useFogisContext,
      extLeagueId,
      extMatchId,
      typeOfExtLeagueId: typeof extLeagueId,
      typeOfExtMatchId: typeof extMatchId,
    });
    promises.push(fetchGoalEvents(leagueId, matchId, undefined, undefined, useFogisContext, extLeagueId, extMatchId));
    promiseKeys.push('goals');
  }

  if (includeMatchPhase) {
    promises.push(fetchMatchPhase(leagueId, matchId));
    promiseKeys.push('matchPhase');
  }

  if (includePlayerStats) {
    promises.push(fetchMatchPlayerStats(leagueId, matchId));
    promiseKeys.push('playerStats');
  }

  // Execute all requests in parallel
  const results = await Promise.allSettled(promises);
  
  // Map results back to named object
  const data: BulkFetchResult = {};
  results.forEach((result, index) => {
    const key = promiseKeys[index];
    if (result.status === 'fulfilled') {
      // Type assertion is safe here since we know what each key should contain
      (data as Record<string, unknown>)[key] = result.value;
    } else {
      console.warn(`Misslyckades med att hämta ${key}:`, result.reason);
      (data as Record<string, unknown>)[key] = null;
    }
  });

  return data;
};