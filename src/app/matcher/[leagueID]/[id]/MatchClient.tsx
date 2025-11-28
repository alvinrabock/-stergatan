"use client";

import React from 'react'
import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, notFound, useRouter, useSearchParams } from "next/navigation";
import SingleMatcherSkeleton from "@/app/components/Skeletons/SingleMatcherSkeleton";
import LiveData from "@/app/components/Match/LiveData";
import LiverapporteringNew, { getEventsWithVideos } from "@/app/components/Match/LiverapporteringNew";
import LiveStats from "@/app/components/Match/LiveStats";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import Lineup from "@/app/components/Match/Lineup";
import StandingsTable from "@/app/components/Lag/StandingsTable";
import TabellIcon from "@/app/components/Icons/TabellIcon";
import { useOptimizedMatchData } from "@/lib/useMatchData";
import { useSportomediaMatch } from "@/lib/useSportomediaMatch";
import MatchHero from '@/app/components/Heros/MatchHero';
import LineupSkeleton from "@/app/components/Skeletons/LineupSkeleton";
import LiveDataSkeleton from "@/app/components/Skeletons/LiveDataSkeleton";
import LiveStatsSkeleton from "@/app/components/Skeletons/LiveStatsSkeleton";
import { LineupIcon } from '@/app/components/Icons/LineupIcon';
import { FootballIcon } from '@/app/components/Icons/FootballIcon';
import StatisticIcon from '@/app/components/Icons/StatisticIcon';

// Valid tab values
const VALID_TABS = ['lineups', 'live', 'statistics', 'standings', 'videos'] as const;
type ValidTab = typeof VALID_TABS[number];

// Helper function to validate tab
const isValidTab = (tab: string): tab is ValidTab => {
    return VALID_TABS.includes(tab as ValidTab);
};

// Memoized tab content components for better performance
const MemoizedLineup = React.memo(Lineup);
const MemoizedLiveData = React.memo(LiveData);
const MemoizedLiveStats = React.memo(LiveStats);
const MemoizedStandingsTable = React.memo(StandingsTable);

// Memoized skeleton components
const MemoizedLineupSkeleton = React.memo(LineupSkeleton);
const MemoizedLiveDataSkeleton = React.memo(LiveDataSkeleton);

// Keep the other skeleton components for stats and standings
// Using imported LiveStatsSkeleton component instead of inline skeleton

const StandingsLoadingSkeletonComponent = () => (
    <div className="space-y-4 animate-pulse">
        <div className="bg-gray-700 h-8 w-32 rounded"></div>
        <div className="space-y-2">
            {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-gray-600 h-12 rounded"></div>
            ))}
        </div>
    </div>
);
const StandingsLoadingSkeleton = React.memo(StandingsLoadingSkeletonComponent);
StandingsLoadingSkeleton.displayName = "StandingsLoadingSkeleton";

// Memoized error display component outside the main component
const ErrorDisplay = React.memo(({ message }: { message: string }) => (
    <div className="text-white px-6 py-4 rounded-md text-center mt-6">
        <h2 className="text-2xl font-semibold mb-2">Det gick inte att hitta någon data</h2>
        <p>{message}</p>
    </div>
));
ErrorDisplay.displayName = "ErrorDisplay";

function MatchClient() {
    const { leagueID, id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get tab from URL params, fallback to 'lineups'
    const urlTab = searchParams.get('tab');
    const initialTab: ValidTab = urlTab && isValidTab(urlTab) ? urlTab : 'lineups';

    const [activeTab, setActiveTab] = useState<ValidTab>(initialTab);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Support both string IDs (SMC API 2.0 ULIDs) and numeric IDs (Fogis)
    const leagueId = (leagueID as string) || '';
    const matchId = (id as string) || '';
    const validParams = !!leagueId && !!matchId;

    // Sync activeTab with URL on mount and when URL changes
    useEffect(() => {
        const urlTab = searchParams.get('tab');
        if (urlTab && isValidTab(urlTab) && urlTab !== activeTab) {
            setActiveTab(urlTab);
        }
    }, [searchParams, activeTab]);

    // Function to update URL when tab changes
    const updateUrlTab = useCallback((newTab: ValidTab) => {
        if (!validParams) return;

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('tab', newTab);

        // Use router.replace to avoid adding to history stack
        router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
    }, [router, validParams]);

    // Handle tab change with URL update
    const handleTabChange = useCallback((newTab: string) => {
        if (isValidTab(newTab)) {
            setActiveTab(newTab);
            updateUrlTab(newTab);
        }
    }, [updateUrlTab]);

    // Use your existing optimized hook with better polling settings
    const {
        matchDetails,
        lineupData,
        liveStats,
        matchPhaseData,
        events,
        goals,
        processedGoals,
        loading,
        errors,
        refreshData,
    } = useOptimizedMatchData(leagueId, matchId, validParams, {
        enablePolling: true,
        pollingInterval: 15000, // Will be adjusted dynamically in the hook based on match status
        enableCache: true,
    });

    // Fetch Sportomedia match data for enhanced Liverapportering
    const {
        data: sportomediaData,
        loading: sportomediaLoading,
        error: _sportomediaError
    } = useSportomediaMatch(
        matchDetails?.leagueName,
        matchDetails?.season,
        matchDetails?.extMatchId
    );

    // Determine loading states for individual tabs
    const tabLoadingStates = useMemo(() => ({
        lineups: loading || !lineupData,
        live: loading || events === null,
        statistics: loading || liveStats === null,
        standings: false, // Standings has its own loading logic
        videos: sportomediaLoading,
    }), [loading, lineupData, events, liveStats, sportomediaLoading]);

    // Memoized retry button handler
    const handleRetry = useCallback(() => {
        refreshData();
    }, [refreshData]);

    // Memoized lineup content
    const lineupContent = useMemo(() => {
        if (errors.lineup) {
            return <ErrorDisplay message={errors.lineup} />;
        }
        if (tabLoadingStates.lineups) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MemoizedLineupSkeleton />
                    <MemoizedLineupSkeleton />
                </div>
            );
        }
        if (!lineupData) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MemoizedLineupSkeleton />
                    <MemoizedLineupSkeleton />
                </div>
            );
        }
        return <MemoizedLineup lineupData={lineupData} />;
    }, [errors.lineup, tabLoadingStates.lineups, lineupData]);

    // Memoized live content - use Sportomedia if available, fallback to SMC
    const liveContent = useMemo(() => {
        // If we have Sportomedia data, use the new component
        if (sportomediaData && !sportomediaLoading) {
            // Get lineup players from lineupData (which has images from Sportomedia API)
            const homeLineupPlayers = lineupData?.homeTeamLineup ? [
                ...lineupData.homeTeamLineup.starting,
                ...lineupData.homeTeamLineup.substitutes
            ] : [];

            const awayLineupPlayers = lineupData?.visitingTeamLineup ? [
                ...lineupData.visitingTeamLineup.starting,
                ...lineupData.visitingTeamLineup.substitutes
            ] : [];

            return (
                <LiverapporteringNew
                    events={sportomediaData.matchEvents}
                    homeTeamName={sportomediaData.homeTeamName}
                    visitingTeamName={sportomediaData.visitingTeamName}
                    homeTeamLogo={sportomediaData.homeTeamLogo}
                    visitingTeamLogo={sportomediaData.visitingTeamLogo}
                    onVideoClick={setSelectedVideo}
                    homeLineup={homeLineupPlayers as any}
                    awayLineup={awayLineupPlayers as any}
                />
            );
        }

        // Fallback to old LiveData component if Sportomedia not available
        if (errors.events) {
            return <ErrorDisplay message={errors.events} />;
        }
        if (tabLoadingStates.live || sportomediaLoading) {
            return <MemoizedLiveDataSkeleton />;
        }
        return (
            <MemoizedLiveData
                leagueId={leagueId}
                matchId={matchId}
                homeLineup={matchDetails?.homeLineup || { formation: "", players: [] }}
                awayLineup={matchDetails?.awayLineup || { formation: "", players: [] }}
                events={events}
                goals={goals}
                loading={tabLoadingStates.live}
                error={errors.events}
            />
        );
    }, [
        sportomediaData,
        sportomediaLoading,
        matchDetails?.homeLineup,
        matchDetails?.awayLineup,
        errors.events,
        tabLoadingStates.live,
        leagueId,
        matchId,
        lineupData,
        events,
        goals
    ]);

    // Memoized statistics content
    const statisticsContent = useMemo(() => {
        if (errors.liveStats) {
            return <ErrorDisplay message={errors.liveStats} />;
        }
        if (tabLoadingStates.statistics) {
            return <LiveStatsSkeleton />;
        }
        return (
            <MemoizedLiveStats
                leagueId={leagueId}
                matchId={matchId}
                homeTeam={matchDetails?.homeTeam || ''}
                awayTeam={matchDetails?.awayTeam || ''}
                lineupData={lineupData}
                liveStats={liveStats}
            />
        );
    }, [
        errors.liveStats,
        tabLoadingStates.statistics,
        leagueId,
        matchId,
        matchDetails?.homeTeam,
        matchDetails?.awayTeam,
        lineupData,
        liveStats
    ]);

    // Memoized standings content
    const standingsContent = useMemo(() => {
        if (tabLoadingStates.standings) {
            return <StandingsLoadingSkeleton />;
        }
        return (
            <div className="mt-6">
                <MemoizedStandingsTable
                    leagueId={leagueId}
                    homeTeamId={matchDetails?.extHomeTeamId ? Number(matchDetails.extHomeTeamId) : undefined}
                    awayTeamId={matchDetails?.extAwayTeamId ? Number(matchDetails.extAwayTeamId) : undefined}
                />
            </div>
        );
    }, [
        tabLoadingStates.standings,
        leagueId,
        matchDetails?.extHomeTeamId,
        matchDetails?.extAwayTeamId
    ]);

    // Memoized videos content
    const videosContent = useMemo(() => {
        if (sportomediaLoading || !sportomediaData) {
            return (
                <div className="text-center py-12 text-gray-400">
                    Laddar videor...
                </div>
            );
        }

        const eventsWithVideos = getEventsWithVideos(sportomediaData.matchEvents);

        if (eventsWithVideos.length === 0) {
            return (
                <div className="text-center py-12 text-gray-400">
                    Inga videor tillgängliga för denna match
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {eventsWithVideos.map((event, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedVideo(event.video!.embedVideoUrl)}
                        className="relative group text-left"
                    >
                        <div className="relative">
                            <img
                                src={event.video!.thumbnail}
                                alt={event.description}
                                className="w-full aspect-video object-cover rounded-lg border-2 border-gray-600 group-hover:border-custom_red transition-colors"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg transition-all">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-white font-semibold text-sm">{event.typeString}</p>
                            <p className="text-gray-400 text-xs">{event.description}</p>
                            {event.playerName && (
                                <p className="text-gray-300 text-xs mt-1">{event.playerName}</p>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        );
    }, [sportomediaLoading, sportomediaData]);

    const getTabIcon = (iconType: string) => {
        const iconProps = "w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0";

        switch (iconType) {
            case 'lineup':
                return <LineupIcon className={iconProps} />;
            case 'football':
                return <FootballIcon className={iconProps} />;
            case 'statistics':
                return <StatisticIcon className={iconProps} />;
            case 'table':
                return <TabellIcon className={iconProps} />;
            case 'video':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={iconProps}>
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                );
            default:
                return <TabellIcon className={iconProps} />;
        }
    };

    // Check if we should show the standings tab based on league
    const hasStandings = useMemo(() => {
        if (!matchDetails?.leagueName && !leagueId) return true; // Show by default if no league info

        // List of supported leagues for standings
        const supportedLeagues = ['allsvenskan', 'superettan', 'ettan'];

        // Check leagueName from matchDetails
        if (matchDetails?.leagueName) {
            const leagueName = matchDetails.leagueName.toLowerCase();
            const isSupported = supportedLeagues.some(league => leagueName.includes(league));
            return isSupported;
        }

        // Fallback to checking leagueId
        if (leagueId) {
            const normalizedLeagueId = String(leagueId).toLowerCase();
            const isSupported = supportedLeagues.some(league => normalizedLeagueId.includes(league));
            return isSupported;
        }

        return true; // Show by default if we can't determine
    }, [matchDetails?.leagueName, leagueId]);

    // Check if we should show the videos tab
    const hasVideos = useMemo(() => {
        if (!sportomediaData) return false;
        return getEventsWithVideos(sportomediaData.matchEvents).length > 0;
    }, [sportomediaData]);

    // Check if we have data for each tab
    const hasLineupData = useMemo(() => {
        return !loading && lineupData !== null && lineupData !== undefined;
    }, [loading, lineupData]);

    const hasLiveData = useMemo(() => {
        // Check if we have Sportomedia data or regular events
        return (!sportomediaLoading && sportomediaData !== null) ||
               (!loading && events !== null && events !== undefined && events.length > 0);
    }, [loading, events, sportomediaLoading, sportomediaData]);

    const hasStatisticsData = useMemo(() => {
        return !loading && liveStats !== null && liveStats !== undefined;
    }, [loading, liveStats]);

    // Memoized tab configuration with proper loading states
    const tabConfig = useMemo(() => {
        const tabs = [];

        // Only add lineups tab if we have lineup data
        if (hasLineupData) {
            tabs.push({
                value: "lineups" as ValidTab,
                label: "Laguppställning",
                icon: "lineup",
                content: lineupContent
            });
        }

        // Only add live tab if we have event data
        if (hasLiveData) {
            tabs.push({
                value: "live" as ValidTab,
                label: "Liverapportering",
                icon: "football",
                content: liveContent
            });
        }

        // Only add statistics tab if we have stats data
        if (hasStatisticsData) {
            tabs.push({
                value: "statistics" as ValidTab,
                label: "Statistik",
                icon: "statistics",
                content: statisticsContent
            });
        }

        // Only add standings tab if league is supported
        if (hasStandings) {
            tabs.push({
                value: "standings" as ValidTab,
                label: "Tabell",
                icon: "table",
                content: standingsContent
            });
        }

        // Only add videos tab if we have videos
        if (hasVideos) {
            tabs.push({
                value: "videos" as ValidTab,
                label: "Video",
                icon: "video",
                content: videosContent
            });
        }

        return tabs;
    }, [lineupContent, liveContent, statisticsContent, standingsContent, videosContent, hasVideos, hasStandings, hasLineupData, hasLiveData, hasStatisticsData]);

    // Auto-select first available tab if current tab is not available
    useEffect(() => {
        if (tabConfig.length > 0) {
            const currentTabExists = tabConfig.some(tab => tab.value === activeTab);
            if (!currentTabExists) {
                // Set to first available tab
                const firstTab = tabConfig[0].value;
                setActiveTab(firstTab);
                updateUrlTab(firstTab);
            }
        }
    }, [tabConfig, activeTab, updateUrlTab]);

    // Early returns with proper conditions
    if (!validParams) {
        return notFound();
    }

    // Show error if we have an error and we're not loading and no match details
    if (errors.matchDetails && !loading && !matchDetails) {
        return (
            <div className="text-red-600 text-center mt-4">
                <p className="font-semibold text-xl">Error: {errors.matchDetails}</p>
                <button
                    onClick={handleRetry}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Show skeleton ONLY if we're loading AND don't have match details yet
    if (loading && !matchDetails) {
        return <SingleMatcherSkeleton />;
    }

    // Show notFound if we're not loading and still don't have match details
    if (!loading && !matchDetails) {
        return notFound();
    }

    // Check if there's any data available in any tab
    const hasAnyData = tabConfig.length > 0;

    return (
        <div className="w-full overflow-hidden min-h-screen bg-custom_dark_dark_red">
            <MatchHero
                matchDetails={matchDetails}
                matchPhaseData={matchPhaseData}
                liveStats={liveStats}
                processedGoals={processedGoals}
            />

            <MaxWidthWrapper>
                <div className="pt-6 pb-20">
                    {!hasAnyData ? (
                        <div className="text-center py-12 text-white">
                            <h2 className="text-2xl font-semibold mb-4">Kommer snart</h2>
                            <p className="text-gray-300">Information om matchen kommer snart att finnas tillgänglig.</p>
                        </div>
                    ) : (
                    <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full mt-[-55px] z-10 relative"
                    >
                        <TabsList className={`w-full grid px-2 py-2 bg-custom_dark_red gap-1 h-auto ${
                            tabConfig.length === 5 ? 'grid-cols-5' :
                            tabConfig.length === 4 ? 'grid-cols-4' :
                            tabConfig.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
                        }`}>
                            {tabConfig.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="
                relative transition-all duration-200 border-b-2 border-transparent
                hover:bg-custom_red/20 rounded-xl
                text-[8px] sm:text-xs text-center
                shadow-none text-white font-semibold
                data-[state=active]:text-white
                data-[state=active]:border-white
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:rounded-none
                flex flex-col items-center justify-center gap-1
                px-1 py-1.5 h-auto
            "
                                >
                                    {getTabIcon(tab.icon)}
                                    <span className="leading-tight text-center break-words">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {tabConfig.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value}>
                                {tab.content}
                            </TabsContent>
                        ))}
                    </Tabs>
                    )}
                </div>
            </MaxWidthWrapper>

            {/* Video Modal Dialog */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative w-full max-w-5xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-12 right-0 text-white hover:text-custom_red text-4xl font-bold transition-colors"
                        >
                            ×
                        </button>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                                src={selectedVideo}
                                className="w-full h-full"
                                allowFullScreen
                                title="Match video"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchClient;