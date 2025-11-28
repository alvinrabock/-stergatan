import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { lowercase } from "@/utillities/lowercase";
import { Lag, MatchCardData } from "@/types";

interface MatchCardProps {
    match: MatchCardData;
    colorTheme?: "red" | "blue" | "outline" | "outline-blue";
    teamsWithSEF?: Lag[];
}

// TeamLogo component with fallback
const TeamLogo = ({ teamName, className }: { teamName: string; className?: string }) => {
    const [hasError, setHasError] = useState(false);
    const logoPath = `/logos/${lowercase(teamName)}.svg`;

    if (hasError) {
        // Fallback: show team name initials or short version
        const initials = teamName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .slice(0, 3)
            .toUpperCase();

        return (
            <div className={`absolute inset-0 flex items-center justify-center bg-gray-600 text-white text-xs font-bold rounded ${className}`}>
                {initials}
            </div>
        );
    }

    return (
        <Image
            src={logoPath}
            alt={teamName}
            fill
            className="object-contain"
            onError={() => setHasError(true)}
        />
    );
};

const MiniMatchCard = ({ match, colorTheme = "blue" }: MatchCardProps) => {
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
    const displayTime = formattedTime === "00:00" ? "TBD" : formattedTime;

    const textColor = "text-white";
    const darkBackgroundColor =
        colorTheme === "red"
            ? "bg-custom-dark-red"
            : colorTheme === "blue"
                ? "bg-custom-blue"
                : "bg-transparent";

    return (
        <Link href={`/matcher/${match.leagueId}/${match.matchId}`}>
            <div
                key={match.matchId}
                className={`relative rounded-lg flex flex-col gap-4 items-center justify-center p-4 cursor-pointer transition-colors duration-200 hover:bg-white/10 ${darkBackgroundColor} ${textColor}`}
            >
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-start justify-center gap-2">
                        {/* Home team */}
                        <div className="flex flex-col w-20 items-center text-center">
                            {match.homeTeam ? (
                                <>
                                    <div
                                        className={`p-2 aspect-square rounded-lg flex items-center justify-center ${darkBackgroundColor}`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative">
                                            <TeamLogo teamName={match.homeTeam} />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold">{match.homeTeam}</p>
                                </>
                            ) : (
                                <>
                                    <div
                                        className={`p-2 aspect-square rounded-lg flex items-center justify-center ${darkBackgroundColor}`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                                            <span className="bg-gray-50/10 rounded-xl p-2 text-xs font-bold text-white">
                                                ?
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-300">Kommer snart</p>
                                </>
                            )}
                        </div>

                        {/* Match Info */}
                        <div className="flex flex-col items-center justify-center py-2 text-center">
                            {showScore && (
                                <>
                                    <div className="flex flex-row flex-nowrap flex-shrink-0 font-bold text-lg md:tedt-2xl lg:text-3xl">
                                        <span>{match.goalsHome}</span>
                                        <span className="mx-1">-</span>
                                        <span>{match.goalsAway}</span>
                                    </div>
                                    <div className="text-xs">Slut</div>
                                </>
                            )}
                            {LiveshowScore && match.liveStats && (
                                <>
                                    <div className="text-3xl font-bold">
                                        {match.liveStats["home-team-score"]} -{" "}
                                        {match.liveStats["away-team-score"]}
                                    </div>
                                    <div className="text-xs">
                                        {match.liveStats["match-phase"]}
                                    </div>
                                </>
                            )}
                            {match.status === "Scheduled" && (
                                <>
                                    <div className="text-xl font-semibold">{formattedDate}</div>
                                    <div className="text-md opacity-70">{displayTime}</div>
                                </>
                            )}
                        </div>

                        {/* Away team */}
                        <div className="flex flex-col w-20 items-center text-center">
                            {match.awayTeam ? (
                                <>
                                    <div
                                        className={`p-2 aspect-square rounded-lg flex items-center justify-center ${darkBackgroundColor}`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative">
                                            <TeamLogo teamName={match.awayTeam} />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold">{match.awayTeam}</p>
                                </>
                            ) : (
                                <>
                                    <div
                                        className={`p-2 aspect-square rounded-lg flex items-center justify-center ${darkBackgroundColor}`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                                            <span className="bg-gray-50/10 rounded-xl p-2 text-xs font-bold text-white">
                                                ?
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-300">Kommer snart</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MiniMatchCard;