"use client";

import { useState } from "react";
import RedCard from "../Icons/RedCard";
import YellowCard from "../Icons/YellowCard";
import { FootballIcon } from "../Icons/FootballIcon";
import TransferIArrowcon from "../Icons/TransferIArrowcon";
import Image from "next/image";
import FootballField from "./FootballField";
import { lineupPlayer, MatchLineup } from "@/types";
import LineupSkeleton from "../Skeletons/LineupSkeleton";

const ICON_CLASSES = "bg-white rounded p-1 shadow-sm border border-gray-200 w-5 h-5 sm:w-6 sm:h-6";

const renderPlayerStatusIcons = (player: lineupPlayer, isSubstitute = false) => {
    const icons = [];

    // Priority order: Red Card > Goals > Yellow Card > Substituted
    if (player.hasRedCard) {
        icons.push({
            key: "red-card",
            component: (
                <RedCard className={`${ICON_CLASSES} text-red-700`}>
                    <title>Red Card</title>
                </RedCard>
            )
        });
    }

    if (player.hasScored) {
        const goalIcon = (
            <FootballIcon className={`${ICON_CLASSES} text-red-500`}>
                <title>Scored</title>
            </FootballIcon>
        );

        const goalComponent = player.goals > 1 ? (
            <div className="relative">
                {goalIcon}
                <span className="absolute -top-2 -right-1.5 text-white bg-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {player.goals}
                </span>
            </div>
        ) : goalIcon;

        icons.push({
            key: "scored",
            component: goalComponent
        });
    }

    if (player.hasWarning) {
        icons.push({
            key: "warning",
            component: (
                <YellowCard className={`${ICON_CLASSES} text-orange-500`}>
                    <title>Warning</title>
                </YellowCard>
            )
        });
    }

    if (player.hasBeenSubstituted) {
        icons.push({
            key: "substituted",
            component: (
                <TransferIArrowcon className={`${ICON_CLASSES} text-yellow-500`}>
                    <title>Substituted</title>
                </TransferIArrowcon>
            )
        });
    }

    if (icons.length === 0) return null;

    // Different layouts for main players vs substitutes
    if (isSubstitute) {
        // For substitutes: maximum 3 icons vertically
        const maxIcons = 3;
        const visibleIcons = icons.slice(0, maxIcons);
        const remainingIcons = icons.length - maxIcons;

        return (
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 z-10">
                <div className="flex flex-col gap-0.5">
                    {visibleIcons.map((icon) => (
                        <div key={icon.key} className="shrink-0">
                            {icon.component}
                        </div>
                    ))}
                    {remainingIcons > 0 && (
                        <div className="shrink-0">
                            <div className={`${ICON_CLASSES} bg-gray-600 text-white flex items-center justify-center`}>
                                <span className="text-[8px] font-bold">+{remainingIcons}</span>
                                <title>+{remainingIcons} more</title>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // For main players: distribute on left and right sides
    const maxIconsPerSide = 2; // Max 2 icons per side to prevent overcrowding
    const leftIcons = icons.slice(0, maxIconsPerSide);
    const rightIcons = icons.slice(maxIconsPerSide, maxIconsPerSide * 2);
    const remainingIcons = icons.length - (leftIcons.length + rightIcons.length);

    return (
        <>
            {/* Left side icons */}
            {leftIcons.length > 0 && (
                <div className="absolute -left-2 top-0 z-10">
                    <div className="flex flex-col gap-1">
                        {leftIcons.map((icon) => (
                            <div key={icon.key} className="shrink-0">
                                {icon.component}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Right side icons */}
            {rightIcons.length > 0 && (
                <div className="absolute -right-2 top-0 z-10">
                    <div className="flex flex-col gap-1">
                        {rightIcons.map((icon) => (
                            <div key={icon.key} className="shrink-0">
                                {icon.component}
                            </div>
                        ))}
                        {/* Show overflow indicator on right side if there are more icons */}
                        {remainingIcons > 0 && (
                            <div className="shrink-0">
                                <div className={`${ICON_CLASSES} bg-gray-600 text-white flex items-center justify-center`}>
                                    <span className="text-[8px] font-bold">+{remainingIcons}</span>
                                    <title>+{remainingIcons} more</title>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const getFormationRows = (formation: string) => {
    if (typeof formation !== "string") return [];
    const formationArray = formation.split("-").map((num) => parseInt(num, 10));
    if (formationArray.some(isNaN)) return [];
    return formationArray.map((numPlayers) => Array(numPlayers).fill(null));
};

const PlayerCard = ({ player, isGoalkeeper = false }: { player: lineupPlayer; isGoalkeeper?: boolean }) => {
    const imageSize = isGoalkeeper ? 100 : 80; // Increased sizes for better readability
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const getImageSrc = () => {
        const hasValidImage = player.image && player.image.trim() !== '';
        return (!hasValidImage || imageError) ? '/1496042.webp' : player.image;
    };

    return (
        <div className="relative flex-1 flex flex-col items-center max-w-[70px] min-w-[45px] sm:max-w-[80px] sm:min-w-[50px] md:max-w-[90px] md:min-w-[55px]">
            {renderPlayerStatusIcons(player, false)}

            <div className="w-full flex flex-col items-center">
                <Image
                    src={getImageSrc()}
                    alt={`${player.givenName} ${player.surName}`}
                    width={imageSize}
                    height={imageSize}
                    className="object-cover w-full h-auto rounded-tl-lg rounded-tr-lg"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."
                    onError={handleImageError}
                    priority={isGoalkeeper}
                    placeholder="blur"
                    sizes="95px"
                />
                <div className="bg-custom-dark-red p-0.5 sm:p-1 text-center rounded-md w-full min-w-0">
                    <p className="text-[8px] sm:text-[9px] md:text-[11px] font-medium text-white leading-tight">
                        <span className="text-custom-red font-bold">
                            #{player.shirtNumber}
                        </span>{" "}
                        <span className="block truncate">
                            {player.surName}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const SubstituteCard = ({ player, teamLabel }: { player: lineupPlayer; teamLabel?: string }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const getImageSrc = () => {
        const hasValidImage = player.image && player.image.trim() !== '';
        return (!hasValidImage || imageError) ? '/1496042.webp' : player.image;
    };

    return (
        <div className="relative">
            {renderPlayerStatusIcons(player, true)}

            <div className="border border-white/20 overflow-hidden rounded-xl w-full flex items-center gap-2">
                <Image
                    src={getImageSrc()}
                    alt={`${player.givenName} ${player.surName}`}
                    width={50}
                    height={50}
                    className="object-cover w-12 h-12 flex-shrink-0"
                    onError={handleImageError}
                    quality={60} // Lower quality for substitute images
                    sizes="48px" // Fixed size for substitutes
                />
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-medium text-white leading-tight">
                        <span className="text-custom-red font-bold">
                            #{player.shirtNumber}
                        </span>{" "}
                        <span className="block truncate">
                            {player.surName}
                        </span>
                        {teamLabel && (
                            <span className="text-[8px] text-gray-400 block">
                                {teamLabel}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

const TeamLineup = ({
    title,
    formation,
    lineup,
    showSubstitutes = false,
}: {
    title: string;
    formation: string;
    lineup: {
        starting: lineupPlayer[];
        substitutes: lineupPlayer[];
    };
    showSubstitutes?: boolean;
}) => {
    const rows = getFormationRows(formation);
    const goalkeeper = lineup.starting.find(player => parseInt(player.position, 10) === 1);

    // Create a more robust sorting and positioning system
    const createPlayerPositionMap = () => {
        const outfieldPlayers = lineup.starting.filter(player => parseInt(player.position, 10) !== 1);

        // Sort by positionIndexFromBackRight, with fallback to position
        const sortedPlayers = outfieldPlayers.sort((a, b) => {
            const posA = parseInt(a.positionIndexFromBackRight, 10) || parseInt(a.position, 10);
            const posB = parseInt(b.positionIndexFromBackRight, 10) || parseInt(b.position, 10);
            return posA - posB;
        });

        // Create position map
        const positionMap = new Map();
        let playerIndex = 0;

        rows.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                if (playerIndex < sortedPlayers.length) {
                    positionMap.set(`${rowIndex}-${colIndex}`, sortedPlayers[playerIndex]);
                    playerIndex++;
                }
            });
        });

        return positionMap;
    };

    const playerPositionMap = createPlayerPositionMap();

    const getPlayerForPosition = (rowIndex: number, colIndex: number) => {
        return playerPositionMap.get(`${rowIndex}-${colIndex}`) || null;
    };

    return (
        <div className="mb-6 text-white">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm mb-4">{formation}</p>

            <div className="relative w-full max-w-full h-[80vh] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] mx-auto overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <FootballField />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col-reverse justify-between p-2 sm:p-3 md:p-4">
                    {/* Goalkeeper */}
                    {goalkeeper && (
                        <div className="flex justify-center items-center mb-1">
                            <div className="w-16 sm:w-18 md:w-20">
                                <PlayerCard player={goalkeeper} isGoalkeeper />
                            </div>
                        </div>
                    )}

                    {/* Outfield players */}
                    {rows.map((row, rowIndex) => (
                        <div
                            key={`row-${rowIndex}`}
                            className="flex justify-center items-center gap-1 sm:gap-1.5 md:gap-2 mb-1 w-full"
                        >
                            {row.map((_, colIndex) => {
                                const player = getPlayerForPosition(rowIndex, colIndex);

                                return player ? (
                                    <PlayerCard key={player.id} player={player} />
                                ) : (
                                    <div key={`empty-${rowIndex}-${colIndex}`} className="w-16 sm:w-18 md:w-20" />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Individual team substitutes (only show if showSubstitutes is true) */}
            {showSubstitutes && lineup.substitutes.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-lg sm:text-xl font-semibold mb-3 pb-2 border-b border-white/20">
                        Ersättare - {title}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                        {lineup.substitutes.map((player) => (
                            <SubstituteCard key={player.id} player={player} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Combined substitutes component
const CombinedSubstitutes = ({
    homeSubstitutes,
    awaySubstitutes,
    homeTeamName = "Hemma",
    awayTeamName = "Borta"
}: {
    homeSubstitutes: lineupPlayer[];
    awaySubstitutes: lineupPlayer[];
    homeTeamName?: string;
    awayTeamName?: string;
}) => {
    const hasSubstitutes = homeSubstitutes.length > 0 || awaySubstitutes.length > 0;

    if (!hasSubstitutes) return null;

    return (
        <div className="mt-8 text-white">
            <h4 className="text-lg sm:text-xl font-semibold mb-4 pb-2 border-b border-white/20 text-center">
                Ersättare
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Home team substitutes */}
                {homeSubstitutes.length > 0 && (
                    <div>
                        <h5 className="text-md font-medium mb-3 text-center text-gray-300">
                            {homeTeamName}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {homeSubstitutes.map((player) => (
                                <SubstituteCard
                                    key={`home-${player.id}`}
                                    player={player}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Away team substitutes */}
                {awaySubstitutes.length > 0 && (
                    <div>
                        <h5 className="text-md font-medium mb-3 text-center text-gray-300">
                            {awayTeamName}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {awaySubstitutes.map((player) => (
                                <SubstituteCard
                                    key={`away-${player.id}`}
                                    player={player}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Lineup = ({
    lineupData,
    homeTeamName,
    awayTeamName
}: {
    lineupData: MatchLineup | null;
    homeTeamName?: string;
    awayTeamName?: string;
}) => {
    if (!lineupData) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <LineupSkeleton />
                <LineupSkeleton />
            </div>
        );
    }

    const isHomeTeamLineupEmpty = !lineupData.homeTeamLineup?.starting?.length;
    const isVisitingTeamLineupEmpty = !lineupData.visitingTeamLineup?.starting?.length;

    if (isHomeTeamLineupEmpty && isVisitingTeamLineupEmpty) {
        return (
            <div className="py-10 text-center text-white">
                <h5 className="text-2xl font-semibold mb-2">
                    Ingen Laguppställning publicerad
                </h5>
                <p className="text-gray-300">Lineup information is not available for this game.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Team lineups without individual substitutes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-10">
                {!isHomeTeamLineupEmpty && lineupData.homeTeamLineup && (
                    <TeamLineup
                        title={homeTeamName || "Hemma"}
                        formation={lineupData.homeTeamLineup.formation}
                        lineup={lineupData.homeTeamLineup}
                        showSubstitutes={false} // Don't show individual team substitutes
                    />
                )}
                {!isVisitingTeamLineupEmpty && lineupData.visitingTeamLineup && (
                    <TeamLineup
                        title={awayTeamName || "Borta"}
                        formation={lineupData.visitingTeamLineup.formation}
                        lineup={lineupData.visitingTeamLineup}
                        showSubstitutes={false} // Don't show individual team substitutes
                    />
                )}
            </div>

            {/* Combined substitutes section at the bottom */}
            <CombinedSubstitutes
                homeSubstitutes={lineupData.homeTeamLineup?.substitutes || []}
                awaySubstitutes={lineupData.visitingTeamLineup?.substitutes || []}
                homeTeamName={homeTeamName}
                awayTeamName={awayTeamName}
            />
        </div>
    );
};

export default Lineup;