"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { getSingleMatch } from "@/lib/fetchSingleMatch";
import { fetchtLineupData } from "@/lib/Superadmin/fetchLineup";
import { Match, LiveStats, Event, GoalEvent, SMCMatchPhaseTypes, MatchLineup, MatchEventData } from "@/types";
import { fetchMatchDataBulk, fetchLeaguePlayers } from "./fetchMatchDataBulk";
import { getFogisLeagueId } from "@/utils/fogisLeagueMapping";

// Cache for processed data to avoid re-computation
const dataCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

// Enhanced event data fetching with aggressive caching and timeout reduction
async function fetchEventForDate(targetDate: string): Promise<MatchEventData | undefined> {
    const cacheKey = `event_${targetDate}`;
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // Reduced from 3000ms

        const eventRes = await fetch(
            `https://foundationapi-stage.ebiljett.nu/v1/247/events?FromDate=${targetDate}&ToDate=${targetDate}`,
            {
                headers: {
                    Authorization: `Basic ${process.env.EBILJETT_BASIC_AUTH}`,
                },
                signal: controller.signal,
                next: { revalidate: 1800 } // Increased cache time
            }
        );

        clearTimeout(timeoutId);

        if (!eventRes.ok) return undefined;

        const events: MatchEventData[] = await eventRes.json();
        const result = events.find(e => {
            const eventDateOnly = new Date(e.start_time).toISOString().split("T")[0];
            return eventDateOnly === targetDate;
        });

        // Cache the result
        dataCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
    } catch (error) {
        console.warn('Failed to fetch event data:', error);
        return undefined;
    }
}

interface ProcessedGoal {
    id: string;
    isHomeTeam: boolean;
    isAwayTeam: boolean;
    timeDisplay: string;
    playerName: string;
    eventScore: string;
}

interface MatchDataState {
    matchDetails: Match | null;
    lineupData: MatchLineup | null;
    liveStats: LiveStats | null;
    matchPhaseData: SMCMatchPhaseTypes | null;
    events: Event[] | null;
    goals: GoalEvent[] | null;
    processedGoals: ProcessedGoal[];
    event: MatchEventData | undefined;
    loading: boolean;
    isLoadingLiveData: boolean; // New loading state for live data specifically
    errors: {
        matchDetails: string | null;
        lineup: string | null;
        liveStats: string | null;
        events: string | null;
        goals: string | null;
        event: string | null;
    };
    isMatchLive: boolean;
}

interface UseMatchDataOptions {
    enablePolling?: boolean;
    pollingInterval?: number;
    enableCache?: boolean;
    skipLineup?: boolean; // New option to skip lineup data entirely
    skipEvents?: boolean; // New option to skip event data
}

export function useOptimizedMatchData(
    parsedLeagueId: string | number,
    parsedMatchId: string | number,
    validParams: boolean,
    options: UseMatchDataOptions = {}
) {
    console.log('🔧 Hook called with:', { parsedLeagueId, parsedMatchId, validParams });

    const [state, setState] = useState<MatchDataState>({
        matchDetails: null,
        lineupData: null,
        liveStats: null,
        matchPhaseData: null,
        events: null,
        goals: null,
        processedGoals: [],
        event: undefined,
        loading: true,
        isLoadingLiveData: true, // Start with true to show skeleton first
        errors: {
            matchDetails: null,
            lineup: null,
            liveStats: null,
            events: null,
            goals: null,
            event: null,
        },
        isMatchLive: false,
    });

    // Use refs to track current request and prevent stale updates
    const currentRequestRef = useRef<number>(0);
    const { isMatchLive, loading, matchDetails } = state;

    // Memoized goal processing function with caching
    const processGoals = useCallback((goals: GoalEvent[], matchDetails: Match, playerMap?: Map<string, string>): ProcessedGoal[] => {
        if (!goals || !Array.isArray(goals) || !matchDetails) return [];

        const cacheKey = `goals_${matchDetails.matchId}_${goals.length}`;
        const cached = dataCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        // Use provided playerMap (from league players endpoint)
        if (!playerMap || playerMap.size === 0) {
            console.log('⚠️ No player map provided for goal processing');
            return [];
        }

        console.log('🗺️ Using player map with size:', playerMap.size);

        const result = goals.map((goal, index) => {
            const playerId = goal?.['player-id'];

            // Look up player name using ULID from goal event
            const playerName = playerId ? (playerMap.get(String(playerId)) || 'Unknown Player') : 'Unknown Player';

            console.log('🎯 Processing goal:', {
                playerId,
                playerName,
                foundInMap: playerId ? playerMap.has(String(playerId)) : false,
            });

            const playerTeamId = goal?.['player-team-id'];
            const homeTeamId = matchDetails.homeTeamId;
            const awayTeamId = matchDetails.awayTeamId;

            console.log('🔍 Team ID comparison:', {
                playerTeamId,
                homeTeamId,
                awayTeamId,
                playerTeamIdType: typeof playerTeamId,
                homeTeamIdType: typeof homeTeamId,
                awayTeamIdType: typeof awayTeamId,
                isHomeMatch: String(playerTeamId) === String(homeTeamId),
                isAwayMatch: String(playerTeamId) === String(awayTeamId),
            });

            const processedGoal = {
                id: `goal-${index}`,
                isHomeTeam: String(playerTeamId) === String(homeTeamId),
                isAwayTeam: String(playerTeamId) === String(awayTeamId),
                timeDisplay: goal?.['general-event-data']?.['game-clock-in-min']
                    ? `${goal['general-event-data']['game-clock-in-min']}'`
                    : "N/A",
                playerName,
                eventScore: goal?.['general-event-data']?.['event-score'] || "N/A"
            };

            console.log('✅ Processed goal complete:', processedGoal);
            return processedGoal;
        });

        // Cache the result
        dataCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
    }, []);

    // Optimized data loading with progressive enhancement
    useEffect(() => {
        console.log('🎯 useEffect FIRED!', { validParams, parsedLeagueId, parsedMatchId });

        if (!validParams) {
            console.log('❌ Invalid params');
            setState(prev => ({ ...prev, loading: false }));
            return;
        }

        const requestId = ++currentRequestRef.current;

        const loadData = async () => {
            console.log('🚀 Starting ultra-optimized load...');
            const startTime = performance.now();

            try {
                // PHASE 1: Critical path - Match details only (fastest possible)
                console.log('📡 Phase 1: Loading critical match data...');
                const matchDetails = await getSingleMatch(String(parsedLeagueId), String(parsedMatchId));

                if (currentRequestRef.current !== requestId) return;

                if (!matchDetails) {
                    throw new Error('Match not found');
                }

                // Update UI immediately with basic match info
                setState(prev => ({
                    ...prev,
                    matchDetails,
                    loading: false, // Set to false to show basic UI
                    // Keep isLoadingLiveData: true to show skeleton while we determine what to display
                }));

                console.log(`⚡ Phase 1 complete in ${(performance.now() - startTime).toFixed(0)}ms`);


                // Quick check if match might be live
                const isLikelyLive = matchDetails.status === "In progress" ||
                    matchDetails.status === "Live" ||
                    new Date(matchDetails.kickoff) <= new Date();

                // PHASE 2: Essential live data (if needed)
                if (isLikelyLive) {
                    console.log('📡 Phase 2: Loading live data...');
                    try {
                        // Fetch player data for this league to create ULID -> name mapping
                        console.log('🔍 Fetching player map for league:', parsedLeagueId);
                        const playerMap = await fetchLeaguePlayers(parsedLeagueId);

                        // Check if we have Fogis mapping for this league/season
                        const fogisLeagueId = getFogisLeagueId(matchDetails.leagueName, matchDetails.season);
                        const canUseFogisContext = !!fogisLeagueId && !!matchDetails.extMatchId;

                        console.log('🔍 Fogis context check:', {
                            leagueName: matchDetails.leagueName,
                            season: matchDetails.season,
                            fogisLeagueId,
                            extMatchId: matchDetails.extMatchId,
                            canUseFogisContext
                        });

                        const smcData = await fetchMatchDataBulk(parsedLeagueId, parsedMatchId, {
                            includeLiveStats: true,
                            includeEvents: false, // Skip events initially
                            includeGoals: true,
                            includeMatchPhase: true,
                            includePlayerStats: false,
                            useFogisContext: canUseFogisContext,
                            extLeagueId: fogisLeagueId || undefined,
                            extMatchId: matchDetails.extMatchId,
                        });

                        if (currentRequestRef.current !== requestId) return;

                        const { liveStats, goals, matchPhase: matchPhaseData } = smcData;
                        const goalArray: GoalEvent[] = Array.isArray(goals) ? goals : (goals ? [goals] : []);
                        const processedGoals = processGoals(goalArray, matchDetails, playerMap);

                        const isMatchLive = Boolean(
                            matchDetails.status === "In progress" ||
                            matchDetails.status === "Live" ||
                            (liveStats?.["match-phase"] &&
                                !["finished", "not-started"].includes(liveStats["match-phase"]))
                        );

                        setState(prev => ({
                            ...prev,
                            liveStats: liveStats || null, // Ensure null instead of undefined
                            goals: goalArray,
                            processedGoals,
                            matchPhaseData: matchPhaseData || null, // Ensure null instead of undefined
                            isMatchLive,
                            isLoadingLiveData: false, // Live data loaded
                            matchDetails: {
                                ...prev.matchDetails!,
                                ...(liveStats && { liveStats })
                            }
                        }));

                        console.log(`⚡ Phase 2 complete in ${(performance.now() - startTime).toFixed(0)}ms`);
                    } catch (error) {
                        console.warn('Phase 2 failed, continuing...', error);
                        // Set isLoadingLiveData to false even if phase 2 fails
                        setState(prev => ({ ...prev, isLoadingLiveData: false }));
                    }
                } else {
                    // For scheduled matches, we can immediately set isLoadingLiveData to false
                    setState(prev => ({ ...prev, isLoadingLiveData: false }));
                }

                // PHASE 3: Non-critical data (background loading)
                if (!options.skipLineup && !options.skipEvents) {
                    console.log('📡 Phase 3: Loading background data...');
                    setTimeout(async () => {
                        try {
                            const kickoffDateOnly = new Date(matchDetails.kickoff).toISOString().split("T")[0];
                            const [eventResult, lineupResult, eventsResult] = await Promise.allSettled([
                                options.skipEvents ? Promise.resolve(undefined) : fetchEventForDate(kickoffDateOnly),
                                options.skipLineup ? Promise.resolve(null) : (
                                    matchDetails.leagueName && matchDetails.season && matchDetails.extMatchId
                                        ? fetchtLineupData({
                                            league: matchDetails.leagueName,
                                            season: matchDetails.season,
                                            extMatchId: matchDetails.extMatchId
                                        })
                                        : Promise.resolve(null)
                                ),
                                fetchMatchDataBulk(parsedLeagueId, parsedMatchId, {
                                    includeLiveStats: false,
                                    includeEvents: true,
                                    includeGoals: false,
                                    includeMatchPhase: false,
                                    includePlayerStats: false,
                                })
                            ]);

                            if (currentRequestRef.current !== requestId) return;

                            const event = eventResult.status === 'fulfilled' ? eventResult.value : undefined;
                            const lineupData = lineupResult.status === 'fulfilled' ? lineupResult.value as MatchLineup : null;
                            const eventsData = eventsResult.status === 'fulfilled' ? eventsResult.value?.events?.Events : null;

                            setState(prev => ({
                                ...prev,
                                event,
                                lineupData,
                                events: eventsData || null, // Ensure null instead of undefined
                                matchDetails: prev.matchDetails ? {
                                    ...prev.matchDetails,
                                    ...(event && {
                                        event: {
                                            start_time: event.start_time,
                                            tickets_url: event.tickets_url,
                                            release_date: event.release_date,
                                        }
                                    })
                                } : prev.matchDetails,
                                errors: {
                                    ...prev.errors,
                                    lineup: lineupResult.status === 'rejected'
                                        ? 'Misslyckades att ladda startelva. Antingen finns ingen data tillgänglig eller så har ingen data publicerats än.'
                                        : null,
                                    event: eventResult.status === 'rejected'
                                        ? 'Misslyckades att ladda matchdata. Antingen finns ingen data tillgänglig eller så har ingen data publicerats än.'
                                        : null,
                                    events: eventsResult.status === 'rejected'
                                        ? 'Misslyckades att ladda händelser. Antingen finns ingen data tillgänglig eller så har ingen data publicerats än.'
                                        : null,
                                }                                
                            }));

                            console.log(`⚡ Phase 3 complete in ${(performance.now() - startTime).toFixed(0)}ms`);
                        } catch (error) {
                            console.warn('Phase 3 failed:', error);
                        }
                    }, 100); // Delay background loading slightly
                }

            } catch (error) {
                if (currentRequestRef.current === requestId) {
                    console.error('❌ Error:', error);
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        errors: {
                            ...prev.errors,
                            matchDetails: error instanceof Error ? error.message : 'Failed to load match details'
                        }
                    }));
                }
            }
        };

        loadData();
    }, [validParams, parsedLeagueId, parsedMatchId, processGoals, options.skipLineup, options.skipEvents]);

    // Optimized polling effect with reduced frequency
    useEffect(() => {
        if (!options.enablePolling || !isMatchLive || !validParams || loading || !matchDetails) {
            return;
        }

        const interval = setInterval(async () => {
            console.log('🔄 Polling live data...');

            try {
                // Fetch player map for name lookups
                const playerMap = await fetchLeaguePlayers(parsedLeagueId);

                // Use same Fogis context logic as initial load
                const fogisLeagueId = getFogisLeagueId(matchDetails.leagueName, matchDetails.season);
                const canUseFogisContext = !!fogisLeagueId && !!matchDetails.extMatchId;

                const pollingData = await fetchMatchDataBulk(parsedLeagueId, parsedMatchId, {
                    includeLiveStats: true,
                    includeEvents: false, // Skip events during polling for speed
                    includeGoals: true,
                    includeMatchPhase: false,
                    includePlayerStats: false,
                    useFogisContext: canUseFogisContext,
                    extLeagueId: fogisLeagueId || undefined,
                    extMatchId: matchDetails.extMatchId,
                });

                const { liveStats: updatedLiveStats, goals: updatedGoals } = pollingData;
                const goalArray: GoalEvent[] = Array.isArray(updatedGoals) ? updatedGoals : (updatedGoals ? [updatedGoals] : []);

                setState(prev => ({
                    ...prev,
                    liveStats: updatedLiveStats || prev.liveStats, // Use previous value if new data is undefined
                    goals: goalArray.length >= 0 ? goalArray : prev.goals,
                    processedGoals: goalArray.length > 0 ? processGoals(goalArray, prev.matchDetails!, playerMap) : prev.processedGoals,
                    matchDetails: prev.matchDetails ? {
                        ...prev.matchDetails,
                        ...(updatedLiveStats && { liveStats: updatedLiveStats })
                    } : prev.matchDetails
                }));

                console.log('✅ Live data updated');
            } catch (error) {
                console.warn('⚠️ Polling failed:', error);
            }
        }, options.pollingInterval || 15000); // Increased to 15s to reduce server load

        return () => {
            console.log('⏹️ Stopping polling');
            clearInterval(interval);
        };
    }, [isMatchLive, validParams, loading, matchDetails, options.enablePolling, options.pollingInterval, parsedLeagueId, parsedMatchId, processGoals]);

    const refreshData = useCallback(() => {
        console.log('🔄 Manual refresh called');
        setState(prev => ({ ...prev, loading: true }));
    }, []);

    const stopPolling = useCallback(() => {
        console.log('⏹️ Stop polling called');
        setState(prev => ({ ...prev, isMatchLive: false }));
    }, []);

    // Memoize return object to prevent unnecessary re-renders
    return useMemo(() => ({
        ...state,
        refreshData,
        stopPolling,
    }), [state, refreshData, stopPolling]);
}