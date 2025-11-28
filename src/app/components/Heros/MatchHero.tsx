"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LiveStats, Match, SMCMatchPhaseTypes } from "@/types";
import { getTeamLogoPath } from "@/utils/getTeamLogoPath";
import { FootballIcon } from "@/app/components/Icons/FootballIcon";
import TicketIcon from "@/app/components/Icons/TicketIcon";
import { FootballFieldIcon } from "../Icons/FootballFieldIcon";
import { Button } from "@/app/components/ui/Button";
import MaxWidthWrapper from "../MaxWidthWrapper";
import GoalDisplay from "../Match/GoalDisplay";
import { useUIContext } from "@/providers/ui-context";
import CalenderIcon from "../Icons/CalenderIcon";

interface ProcessedGoal {
    id: string;
    isHomeTeam: boolean;
    isAwayTeam: boolean;
    timeDisplay: string;
    playerName: string;
    eventScore: string;
}

interface MatchHeroProps {
    matchDetails: Match | null;
    matchPhaseData: SMCMatchPhaseTypes | null;
    liveStats: LiveStats | null;
    processedGoals?: ProcessedGoal[];
    isLoadingLiveData?: boolean; // New prop to indicate if live data is still loading
}

// Loading skeleton component for the score area
function ScoreLoadingSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-3">
            <div className="animate-pulse">
                <div className="bg-white/20 rounded-lg h-12 w-24 mb-2"></div>
                <div className="bg-white/10 rounded h-4 w-16 mx-auto"></div>
            </div>
        </div>
    );
}

export default function MatchHero({
    matchDetails,
    matchPhaseData,
    liveStats,
    processedGoals = [],
    isLoadingLiveData = false,
}: MatchHeroProps) {
    const { setIsHeroVisible } = useUIContext();

    // State to track which logos failed to load
    const [homeLogoError, setHomeLogoError] = useState(false);
    const [awayLogoError, setAwayLogoError] = useState(false);

    useEffect(() => {
        setIsHeroVisible(true);
        return () => setIsHeroVisible(false);
    }, [setIsHeroVisible]);

    // Helper function to check if Östers IF is the home team
    const isOstersHome = (homeTeamId?: string | number, homeTeam?: string, extHomeTeamId?: string | number): boolean => {
        // Check team ID (old system)
        if (homeTeamId === "19" || homeTeamId === 19) return true;

        // Check external team ID (new Sportomedia API)
        if (extHomeTeamId === "01JVVHS4ESCV6K0GYXXB0K1NHS") return true;

        // Check team name
        if (homeTeam) {
            const normalizedName = homeTeam.toLowerCase();
            if (normalizedName.includes('öster') || normalizedName === 'oif') return true;
        }

        return false;
    };

    // Helper function to get shortened team name
    const getShortenedTeamName = (teamName: string): string => {
        // Extract first 3 letters of each word and join them
        const words = teamName.split(' ');
        if (words.length === 1) {
            // For single word team names, take first 3-4 letters
            return teamName.substring(0, Math.min(4, teamName.length)).toUpperCase();
        }
        // For multi-word names, take first letter of each word (max 3 letters)
        return words
            .slice(0, 3)
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    };

    // Component for team logo with fallback
    const TeamLogo = ({ teamName, isHome, className }: { teamName: string; isHome: boolean; className?: string }) => {
        const logoError = isHome ? homeLogoError : awayLogoError;
        const setLogoError = isHome ? setHomeLogoError : setAwayLogoError;

        if (logoError) {
            // Show shortened team name as fallback - use same size as logo container
            const shortName = getShortenedTeamName(teamName);
            return (
                <div className={`bg-gray-50/10 rounded-xl flex items-center justify-center text-center ${className || "w-12 sm:w-20 h-20"}`}>
                    <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {shortName}
                    </span>
                </div>
            );
        }

        return (
            <div className={`relative ${className || "w-12 sm:w-20 h-20"}`}>
                <Image
                    src={getTeamLogoPath(teamName)}
                    alt={`${teamName} logo`}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                />
            </div>
        );
    };

    // Early return if no match details
    if (!matchDetails) {
        return null;
    }

    // Check for start phase - now handling single object instead of array
    const hasStartPhase = matchPhaseData?.["event-type"] === "start-phase";

    const formattedDate = new Date(matchDetails.kickoff).toLocaleDateString(
        "sv-SE",
        {
            month: "long",
            day: "numeric",
        }
    );

    const formattedTime = new Date(matchDetails.kickoff).toLocaleTimeString(
        "sv-SE",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }
    );

    const isMatchLive = (
        startFirstHalf: string | null,
        startSecondHalf: string | null,
        endSecondHalf: string | null
    ) => {
        if (!startFirstHalf) return false;

        const now = new Date();
        const firstHalfStarted = new Date(startFirstHalf) < now;
        const secondHalfStarted = startSecondHalf && new Date(startSecondHalf) < now;
        const matchEnded = endSecondHalf && new Date(endSecondHalf) < now;

        return (firstHalfStarted || secondHalfStarted) && !matchEnded;
    };

    const matchIsLive = isMatchLive(
        liveStats?.["actual-start-of-first-half"] ?? null,
        liveStats?.["actual-start-of-second-half"] ?? null,
        liveStats?.["actual-end-of-second-half"] ?? null
    );

    // Enhanced logic to determine what to show in the center
    const getCenterContent = () => {
        // PRIORITY 1: Always show loading skeleton until we have liveStats data OR confirmed it's not available
        if (isLoadingLiveData) {
            return <ScoreLoadingSkeleton />;
        }

        // PRIORITY 2: Now that we have attempted to load liveStats, make the decision
        // Check if match is scheduled using the status field
        const isScheduled = matchDetails.status === "Scheduled" || matchDetails.statusId === 1;

        // Check if match has ACTUALLY started (only check after we have liveStats or failed to get them)
        const matchHasStarted = !isScheduled && (
            hasStartPhase ||
            (liveStats && liveStats["actual-start-of-first-half"]) ||
            (liveStats && liveStats["match-phase"] &&
                liveStats["match-phase"] !== "not-started" &&
                liveStats["match-phase"] !== "upcoming") ||
            // Fallback: if we have goals data, match has likely started
            (matchDetails.goalsHome > 0 || matchDetails.goalsAway > 0)
        );

        // Check if match is finished
        const matchIsFinished = liveStats?.["match-phase"] === "finished" ||
            (liveStats?.["actual-end-of-second-half"] &&
                new Date(liveStats["actual-end-of-second-half"]) <= new Date());

        // If match has started OR is finished, ALWAYS show score (never date/time in center)
        if (matchHasStarted || matchIsFinished) {
            // Only use live stats scores if available, otherwise check if match is finished to use matchDetails
            // Don't show matchDetails scores for ongoing matches without live data
            const hasLiveScoreData = liveStats?.["home-team-score"] !== undefined &&
                                     liveStats?.["home-team-score"] !== null &&
                                     liveStats?.["away-team-score"] !== undefined &&
                                     liveStats?.["away-team-score"] !== null;

            const homeScore = liveStats?.["home-team-score"];
            const awayScore = liveStats?.["away-team-score"];

            // Only show scores if we have live data OR if match is finished (then use matchDetails as fallback)
            const shouldShowScore = hasLiveScoreData || matchIsFinished;
            const displayHomeScore = hasLiveScoreData ? homeScore : matchDetails.goalsHome;
            const displayAwayScore = hasLiveScoreData ? awayScore : matchDetails.goalsAway;

            // Show score for started/finished matches only if we have score data
            return (
                <div className="text-4xl sm:text-6xl font-bold text-white text-center px-2 py-3">
                    {/* Live indicator */}
                    {matchIsLive && !matchIsFinished && (
                        <div className="flex flex-row items-center justify-center mb-1">
                            <span className="flex items-center gap-2 text-green-500 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded-xl">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                LIVE
                            </span>
                        </div>
                    )}

                    {/* Score - only show if we have actual score data */}
                    {shouldShowScore ? (
                        <>{displayHomeScore} - {displayAwayScore}</>
                    ) : (
                        <div className="animate-pulse text-gray-400">- -</div>
                    )}

                    <div className="flex flex-row gap-4 justify-center items-center">
                        {/* Game clock only for live matches */}
                        {matchIsLive && !matchIsFinished && liveStats?.["game-clock-in-min"] && (
                            <div className="text-center text-slate-300">
                                <p className="text-sm font-semibold text-white">
                                    {liveStats["game-clock-in-min"]}′
                                </p>
                            </div>
                        )}

                        {/* Match phase info */}
                        {liveStats?.["match-phase"] && (
                            <p className="text-xs font-normal text-slate-300">
                                {liveStats["match-phase"] === "finished" ? "Slutspelad" :
                                    liveStats["match-phase"] === "first-half" ? "1:a halvlek" :
                                        liveStats["match-phase"] === "second-half" ? "2:a halvlek" :
                                            liveStats["match-phase"] === "half-time" ? "Paus" :
                                                liveStats["match-phase"] === "not-started" ? "" :
                                                    liveStats["match-phase"]}
                            </p>
                        )}
                    </div>
                </div>
            );
        } else {
            // ONLY show date/time in center for clearly scheduled matches
            return (
                <div className="flex flex-col text-center px-6 py-3">
                    <p className="text-2xl font-semibold">{formattedDate}</p>
                    <p className="text-lg">{formattedTime}</p>
                </div>
            );
        }
    };

    // Helper function to determine if we should show date in match info
    const shouldShowDateInMatchInfo = () => {
        // Don't show date info while still loading liveStats
        if (isLoadingLiveData) return false;

        const isScheduled = matchDetails.status === "Scheduled" || matchDetails.statusId === 1;
        const matchHasStarted = !isScheduled && (
            hasStartPhase ||
            (liveStats && liveStats["actual-start-of-first-half"]) ||
            (liveStats && liveStats["match-phase"] &&
                liveStats["match-phase"] !== "not-started" &&
                liveStats["match-phase"] !== "upcoming") ||
            // Fallback: if we have goals data, match has likely started
            (matchDetails.goalsHome > 0 || matchDetails.goalsAway > 0)
        );
        const matchIsFinished = liveStats?.["match-phase"] === "finished" ||
            (liveStats?.["actual-end-of-second-half"] &&
                new Date(liveStats["actual-end-of-second-half"]) <= new Date());

        // Show date in match info if match has started or is finished
        return matchHasStarted || matchIsFinished;
    };

    // Determine if this is an Östers IF home match
    const isOstersHomeMatch = isOstersHome(
        matchDetails.homeTeamId,
        matchDetails.homeTeam,
        matchDetails.extHomeTeamId
    );

    return (
        <div className="relative w-full">
            <div className="relative flex flex-row items-center justify-center w-full min-h-[65vh] pt-36 pb-15">
                <Image
                    src={
                        isOstersHomeMatch
                            ? "/visma-arena-kvallen.jpg"
                            : "/bortamatch-bild.webp"
                    }
                    alt="Stadium background"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-custom_dark_dark_red via-custom_dark_dark_red/70 to-custom_dark_dark_red/50 z-10" />

                <div className="relative z-10 text-white w-full h-full">
                    <MaxWidthWrapper>
                        <div className="flex flex-row items-center justify-center gap-2">
                            {/* Home Team */}
                            <div className="flex flex-col-reverse gap-1 md:flex-row items-center justify-center text-center md:text-right md:justify-end flex-1">
                                {matchDetails.homeTeam ? (
                                    <>
                                        <div>
                                            <h2 className="text-sm sm:text-lg md:text-xl lg:text-3xl font-bold mb-1">
                                                {matchDetails.homeTeam}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-300">Hemma</p>
                                        </div>
                                        <TeamLogo
                                            teamName={matchDetails.homeTeam}
                                            isHome={true}
                                            className="w-12 sm:w-20 h-20 mx-4"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold mb-1 text-gray-300">
                                                Kommer snart
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-400">Hemma</p>
                                        </div>
                                        <div className="bg-gray-50/10 rounded-xl flex items-center justify-center text-center w-12 sm:w-20 h-20 mx-4">
                                            <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                                                ?
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Score and Status - Now with proper loading states */}
                            <div className="flex flex-col items-center justify-center">
                                {getCenterContent()}
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col gap-2 md:flex-row items-center justify-center text-center md:text-left md:justify-start flex-1">
                                {matchDetails.awayTeam ? (
                                    <>
                                        <TeamLogo
                                            teamName={matchDetails.awayTeam}
                                            isHome={false}
                                            className="w-12 sm:w-20 h-20 mx-4"
                                        />
                                        <div>
                                            <h2 className="text-sm sm:text-lg md:text-xl lg:text-3xl font-bold mb-1">
                                                {matchDetails.awayTeam}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-300">Borta</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gray-50/10 rounded-xl flex items-center justify-center text-center w-12 sm:w-20 h-20 mx-4">
                                            <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                                                ?
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold mb-1 text-gray-300">
                                                Kommer snart
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-400">Borta</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Ticket Button - Only show if not loading live data */}
                        {!isLoadingLiveData && !matchIsLive && liveStats?.["match-phase"] !== "finished" && (

                            <div className="mt-6 flex flex-col items-center gap-3">

                                {matchDetails.soldTickets !== undefined && matchDetails.maxTickets && (
                                    <div className="w-full max-w-md relative py-4">
                                        <div className="w-full bg-white/20 rounded-full h-2 relative">
                                            <div
                                                className="bg-red-500 h-2 rounded-full transition-all duration-300 relative"
                                                style={{
                                                    width: `${Math.min((matchDetails.soldTickets / matchDetails.maxTickets) * 100, 100)}%`
                                                }}
                                            >
                                                <span
                                                    className="absolute right-0 top-3 text-white text-xs whitespace-nowrap"
                                                    style={{ transform: 'translateX(50%)' }}
                                                >
                                                    {matchDetails.soldTickets} sålda
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 gap-4 flex justify-center">
                                    {matchDetails.event?.tickets_url ? (
                                        <Link href={matchDetails.event.tickets_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="red" className="flex items-center gap-2">
                                                <TicketIcon className="w-5 h-5" />
                                                Köp biljett
                                            </Button>
                                        </Link>
                                    ) : matchDetails.ticketURL ? (
                                        <Link href={matchDetails.ticketURL} target="_blank" rel="noopener noreferrer">
                                            <Button variant="red" className="flex items-center gap-2">
                                                <TicketIcon className="w-5 h-5" />
                                                Köp biljett
                                            </Button>
                                        </Link>
                                    ) : null}
                                    {matchDetails.customButtonText && matchDetails.customButtonLink && (
                                        <Link
                                            href={matchDetails.customButtonLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline" className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-red-600">
                                                {matchDetails.customButtonText}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Goals - Now using the optimized goal display component */}
                        {processedGoals && processedGoals.length > 0 && !isLoadingLiveData && (
                            <GoalDisplay goals={processedGoals} />
                        )}

                        {/* Match Info */}
                        <div className="flex flex-col gap-3 justify-center items-center text-center mt-10 text-white">
                            <div className="flex flex-row flex-wrap gap-4 sm:gap-10 justify-center items-center text-sm sm:text-base">
                                <div className="flex items-center gap-1">
                                    <FootballFieldIcon className="w-6 h-6 fill-white" />
                                    <p className="text-xs md:text-lg">{matchDetails.arenaName}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FootballIcon className="w-6 h-6 fill-white" />
                                    <p className="text-xs md:text-lg">
                                        {matchDetails.leagueName} Runda {matchDetails.roundNumber}
                                    </p>
                                </div>
                                {/* Show date with calendar icon for started/finished matches */}
                                {shouldShowDateInMatchInfo() && (
                                    <div className="flex items-center gap-1">
                                        <CalenderIcon className="w-6 h-6 fill-white" />
                                        <p className="text-xs md:text-lg">
                                            {formattedDate} {formattedTime}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </MaxWidthWrapper>
                </div>
            </div>
        </div>
    );
}