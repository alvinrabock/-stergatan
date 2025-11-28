import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { lowercase } from "@/utillities/lowercase";
import { Button } from "@/app/components/ui/Button";
import { MatchCardData } from "@/types";
import TicketIcon from "../Icons/TicketIcon";

import { FootballFieldIcon } from "../Icons/FootballFieldIcon";
import { FootballIcon } from "../Icons/FootballIcon";
import CalenderIcon from "../Icons/CalenderIcon";

interface MatchCardProps {
    match: MatchCardData;
    colorTheme?: 'red' | 'blue' | 'outline' | 'outline-blue';
    leagueName?: string;
}

const MatchCard = ({ match, colorTheme = 'blue', leagueName }: MatchCardProps) => {
    // State to track which logos failed to load
    const [homeLogoError, setHomeLogoError] = useState(false);
    const [awayLogoError, setAwayLogoError] = useState(false);

    const LiveshowScore = match.status == "In progress";
    const showScore = match.status === "Over";

    const formatDate = (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("sv-SE", {
            month: "long",
            day: "numeric",
        });

        const formattedTime = new Date(date).toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        return { formattedDate, formattedTime };
    };

    const { formattedDate, formattedTime } = formatDate(match.kickoff);

    // Determine the time to display
    const displayTime = formattedTime === "00:00" ? "TBD" : formattedTime;

    const getTeamLogoPath = (teamName: string) => {
        const formattedName = lowercase(teamName);
        return `/logos/${formattedName}.svg`;
    };

    // Component for team logo with fallback
    const TeamLogo = ({ teamName, isHome }: { teamName: string; isHome: boolean }) => {
        const logoError = isHome ? homeLogoError : awayLogoError;
        const setLogoError = isHome ? setHomeLogoError : setAwayLogoError;

        if (logoError) {
            // Shorten team name to initials if too long
            const getShortName = (name: string) => {
                if (name.length <= 8) return name;
                // Get initials from team name (e.g., "Oskarshamns AIK" -> "OAIK")
                const words = name.split(' ');
                if (words.length > 1) {
                    return words.map(word => word[0]).join('').toUpperCase();
                }
                // If single word, take first 4 chars
                return name.substring(0, 4).toUpperCase();
            };

            return (
                <div className="w-12 h-12 flex items-center justify-center text-center overflow-hidden">
                    <span className={`text-xs font-bold ${textColor} leading-tight`} title={teamName}>
                        {getShortName(teamName)}
                    </span>
                </div>
            );
        }

        return (
            <div className="w-12 h-12 relative">
                <Image
                    src={getTeamLogoPath(teamName)}
                    alt={teamName}
                    fill
                    className="object-contain !m-0"
                    onError={() => setLogoError(true)}
                />
            </div>
        );
    };

    const backgroundColor =
        colorTheme === 'red' ? 'bg-custom-dark-red' :
            colorTheme === 'blue' ? 'bg-custom-blue' :
                'bg-transparent';

    const darkBackgroundColor =
        colorTheme === 'outline' ? 'bg-custom-dark-red' :
            colorTheme === 'outline-blue' ? 'bg-custom-blue' :
                colorTheme === 'red' ? 'bg-gradient-to-r from-red-700 to-red-500' :
                    'bg-custom-dark-blue';

    const textColor =
        colorTheme === 'outline' ? 'text-white' :
            colorTheme === 'outline-blue' ? 'text-white' :
                colorTheme === 'red' ? 'text-white' :
                    'text-white';

    const buttonBorderColor =
        colorTheme === 'outline' ? 'border-custom_dark_red' :
            colorTheme === 'outline-blue' ? 'border-custom-dark-blue' :
                colorTheme === 'red' ? 'border-red-500' :
                    'border-blue-500';

    const borderColor =
        colorTheme === 'outline' || colorTheme === 'outline-blue'
            ? `border-b ${buttonBorderColor} rounded-none`
            : '';

    const liveBadgeRoundedClass =
        colorTheme === 'outline' || colorTheme === 'outline-blue'
            ? 'rounded-xl'
            : 'rounded-tl-xl rounded-br-xl';

    const padding = colorTheme?.startsWith('outline') ? 'p-7' : 'p-7';

    const showSecondButton = match.status === 'Scheduled';

    // Check for both ticket sources
    const hasEventTickets = showSecondButton && match?.event?.tickets_url;
    const hasDirectTickets = showSecondButton && match?.ticketURL;

    // NEW: Check for custom button
    const hasCustomButton = showSecondButton && match?.customButtonText && match?.customButtonLink;

    // Updated logic to account for custom button
    const hasActiveSecondButton = hasEventTickets || hasDirectTickets;
    const hasActiveThirdButton = hasCustomButton;

    // Calculate total buttons (View Match + tickets + custom)
    const totalButtons = 1 + (hasActiveSecondButton ? 1 : 0) + (hasActiveThirdButton ? 1 : 0);

    // Dynamic grid columns based on total buttons
    const gridCols = totalButtons === 3 ? 'grid-cols-3 max-[500px]:grid-cols-1' :
        totalButtons === 2 ? 'grid-cols-2 max-[200px]:grid-cols-1' :
            'grid-cols-1';

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
        match.liveStats?.["actual-start-of-first-half"] ?? null,
        match.liveStats?.["actual-start-of-second-half"] ?? null,
        match.liveStats?.["actual-end-of-second-half"] ?? null
    );

    // Use the passed league name or fallback to empty
    const matchedLeagueName = leagueName;

    return (
        <div
            key={match.matchId}
            className={`relative rounded-lg ${padding} flex flex-col xl:flex-row gap-4 sm:gap-2 items-center justify-between ${backgroundColor} ${borderColor} ${textColor} transition-colors duration-200`}
        >

            <div className="flex flex-col xl:flex-row gap-6 md:gap-8 w-full">
                <div className="flex flex-row items-start justify-center gap-2">
                    <div className="flex flex-col w-20 gap-2 items-center justify-center text-center">
                        {match.homeTeam ? (
                            <>
                                <div className={`p-1 aspect-square rounded-lg flex items-center justify-center p-2 ${darkBackgroundColor}`}>
                                    <TeamLogo teamName={match.homeTeam} isHome={true} />
                                </div>
                                <p className={`text-xs font-bold !m-0 ${textColor}`}>{match.homeTeam}</p>
                            </>
                        ) : (
                            <>
                                <div className={`p-1 aspect-square rounded-lg flex items-center justify-center p-2 ${darkBackgroundColor}`}>
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <span className="bg-gray-50/10 rounded-xl p-3 text-xs font-bold text-white">
                                            ?
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-xs font-semibold !m-0 text-gray-300`}>Kommer snart</p>
                            </>
                        )}
                    </div>

                    {matchIsLive && (
                        <div className="absolute top-0 left-0 z-10">
                            <span className={`flex items-center gap-2 text-green-500 text-xs font-semibold bg-green-500/20 px-2 py-1 ${liveBadgeRoundedClass}`}>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                LIVE
                                {match.liveStats?.["game-clock-in-min"] && (
                                    <span>{match.liveStats["game-clock-in-min"]}&apos;</span>
                                )}
                            </span>
                        </div>
                    )}

                    {showScore && (
                        <div className="flex flex-col items-center justify-center py-2">
                            <div className={`whitespace-nowrap text-3xl font-bold ${textColor}`}>
                                {match.goalsHome} - {match.goalsAway}
                            </div>
                            <div className={`text-xs ${textColor}`}>
                                Slut
                            </div>
                        </div>
                    )}

                    {/* Show goals for finished match */}
                    {LiveshowScore && match.liveStats && (
                        <div className="flex flex-col items-center justify-center py-2">
                            <div className={`whitespace-nowrap text-3xl font-bold ${textColor}`}>
                                {match.liveStats["home-team-score"]} - {match.liveStats["away-team-score"]}
                            </div>
                            <div className={`text-xs ${textColor}`}>
                                {match.liveStats["match-phase"]}
                            </div>
                        </div>
                    )}

                    {match.status === "Scheduled" && (
                        <div className="flex flex-col items-center justify-center py-2 text-center">
                            <div className={`text-lg font-semibold ${textColor}`}>
                                {formattedDate}
                            </div>
                            <div className={`text-md opacity-70 ${textColor}`}>
                                {displayTime}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col w-20 gap-2 items-center justify-center text-center">
                        {match.awayTeam ? (
                            <>
                                <div className={`aspect-square rounded-lg flex items-center justify-center p-2 ${darkBackgroundColor}`}>
                                    <TeamLogo teamName={match.awayTeam} isHome={false} />
                                </div>
                                <p className={`text-xs font-bold !m-0 ${textColor}`}>{match.awayTeam}</p>
                            </>
                        ) : (
                            <>
                                <div className={`aspect-square rounded-lg flex items-center justify-center p-2 ${darkBackgroundColor}`}>
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <span className="bg-gray-50/10 rounded-xl p-3 text-xs font-bold text-white">
                                            ?
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-xs font-semibold !m-0 text-gray-300`}>Kommer snart</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="py-4 flex flex-row flex-wrap justify-center items-center sm:items-start md:flex-row md:justify-center md:items-center mx-auto gap-x-8 gap-y-4">
                    {(match.arenaName || matchedLeagueName) && (
                        <>
                            {showScore && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <CalenderIcon className="w-4 h-4 fill-current" />
                                    <span className={`text-sm lg:text-md text-left ${textColor}`}>
                                        {formattedDate}
                                    </span>
                                </div>
                            )}
                            {matchedLeagueName && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <FootballIcon className="w-4 h-4 fill-current" />
                                    <span className={`text-sm lg:text-md text-left ${textColor}`}>
                                        {matchedLeagueName}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <FootballFieldIcon className="w-6 h-6 fill-current" />
                                <span className={`text-sm lg:text-md text-left ${textColor}`}>
                                    {match.arenaName || "Arena inte tillgänglig"}
                                </span>
                            </div>
                        </>
                    )}

                    {match.soldTickets !== undefined && match.soldTickets > 0 && match.status !== "Over" && (
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                                <TicketIcon className="w-4 h-4 fill-white" />
                                <span className={`text-sm lg:text-md  text-left ${textColor}`}>
                                    {match.soldTickets} sålda
                                </span>
                            </div>
                            {match.maxTickets && (
                                <div className="w-24 relative">
                                    <div className={`w-full ${colorTheme === 'outline' || colorTheme === 'outline-blue' ? 'bg-white/20' : 'bg-black/20'} rounded-full h-1`}>
                                        <div
                                            className={`h-1 rounded-full transition-all duration-300 relative ${colorTheme === 'red' || colorTheme === 'outline' ? 'bg-white' : 'bg-red-500'
                                                }`}
                                            style={{
                                                width: `${Math.min((match.soldTickets / match.maxTickets) * 100, 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`grid ${gridCols} gap-2 w-full lg:w-fit mt-4 lg:mt-0`}>
                <Link href={`/matcher/${match.leagueId}/${match.matchId}`}>
                    <Button
                        variant="outline"
                        className={`w-full ${colorTheme === 'outline-blue'
                            ? 'border-white text-white'
                            : 'border-custom-dark-red'
                            }`}
                    >
                        Visa match
                    </Button>
                </Link>

                {hasEventTickets && (
                    <Link
                        target="_blank"
                        href={match?.event?.tickets_url || '#'}
                        passHref
                    >
                        <Button
                            variant={
                                colorTheme === 'outline'
                                    ? 'outline'
                                    : colorTheme === 'outline-blue'
                                        ? 'lightblue'
                                        : colorTheme === 'red'
                                            ? 'lightred'
                                            : 'default'
                            }
                            className={`w-full ${colorTheme === 'outline'
                                ? 'border-custom-dark-red'
                                : colorTheme === 'outline-blue'
                                    ? 'border-blue-500'
                                    : ''
                                } flex items-center justify-center gap-2`}
                        >
                            <TicketIcon className="w-6 h-6" />
                            <span>Biljetter</span>
                        </Button>
                    </Link>
                )}

                {hasDirectTickets && !hasEventTickets && (
                    <Link href={match.ticketURL || '#'} target="_blank" passHref>
                        <Button
                            variant={
                                colorTheme === 'outline'
                                    ? 'outline'
                                    : colorTheme === 'outline-blue'
                                        ? 'lightblue'
                                        : colorTheme === 'red'
                                            ? 'lightred'
                                            : 'default'
                            }
                            className={`w-full ${colorTheme === 'outline'
                                ? 'border-custom-dark-red'
                                : colorTheme === 'outline-blue'
                                    ? 'border-blue-500'
                                    : ''
                                } flex items-center justify-center gap-2`}
                        >
                            <TicketIcon className="w-6 h-6" />
                            <span>Biljetter</span>
                        </Button>
                    </Link>
                )}

                {/* NEW: Custom Button */}
                {hasCustomButton && (
                    <Link href={match.customButtonLink || '#'} target="_blank" passHref>
                        <Button
                            variant={
                                colorTheme === 'outline'
                                    ? 'outline'
                                    : colorTheme === 'outline-blue'
                                        ? 'lightblue'
                                        : colorTheme === 'red'
                                            ? 'lightred'
                                            : 'default'
                            }
                            className={`w-full ${colorTheme === 'outline'
                                ? 'border-custom-dark-red'
                                : colorTheme === 'outline-blue'
                                    ? 'border-blue-500'
                                    : ''
                                } flex items-center justify-center gap-2`}
                        >
                            <span>{match.customButtonText}</span>
                        </Button>
                    </Link>
                )}

            </div>
        </div>
    );
};

export default MatchCard;