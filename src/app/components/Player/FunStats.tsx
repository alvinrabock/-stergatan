import React from "react";
import { FootballIcon } from "../Icons/FootballIcon";
import FootballKick from "../Icons/FootballKick";
import RedCard from "../Icons/RedCard";
import YellowCard from "../Icons/YellowCard";
import Image from 'next/image';

import { TruppPlayers } from "@/types"; 

interface FunStatsProps {
    players: TruppPlayers[];
}

const FunStats: React.FC<FunStatsProps> = ({ players }) => {
    const topGoalScorer = players.reduce((prev, curr) => {
        return curr.currentSeasonStats.goals > prev.currentSeasonStats.goals ? curr : prev;
    }, players[0]);

    const mostAssists = players.reduce((prev, curr) => {
        return curr.currentSeasonStats.assists > prev.currentSeasonStats.assists ? curr : prev;
    }, players[0]);

    const mostYellowCards = players.reduce((prev, curr) => {
        return curr.currentSeasonStats.yellowCards > prev.currentSeasonStats.yellowCards ? curr : prev;
    }, players[0]);

    const mostRedCards = players.reduce((prev, curr) => {
        return curr.currentSeasonStats.redCards > prev.currentSeasonStats.redCards ? curr : prev;
    }, players[0]);

    const fastestPlayer = players.reduce((prev, curr) => {
        return curr.currentSeasonStats.highestSpeed > prev.currentSeasonStats.highestSpeed ? curr : prev;
    }, players[0]);

    const PlayerCardMini: React.FC<{
        player: TruppPlayers;
        statName: string;
        statValue: number;
    }> = ({ player, statName, statValue }) => {
        const isSpeed = statName === "Högsta Hastighet";

        const getIcon = () => {
            switch (statName) {
                case "Mål":
                    return <FootballIcon className="w-5 h-5 fill-white" />;
                case "Assists":
                    return <FootballKick className="w-5 h-5 fill-white" />;
                case "Gula Kort":
                    return <YellowCard className="w-5 h-5" />;
                case "Röda Kort":
                    return <RedCard className="w-5 h-5" />;
                default:
                    return null;
            }
        };

        const icon = getIcon();

        return (
            <div className="flex items-center p-3 border border-white/30 text-white rounded-lg">
                <Image
                    src={player.images.sefImagePng || "/placeholder.png"}
                    alt={player.fullName}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full mr-4 object-cover"
                />

                <div className="flex flex-col text-left">
                    <span className="font-semibold text-lg">{player.fullName}</span>
                    <span className="text-md flex items-center gap-2">

                        <span className="font-thin text-xl flex items-center flex-wrap gap-1">
                            {isSpeed ? (
                                <>{statValue} km/h</>
                            ) : (
                                <>
                                    {statValue}
                                    {Array.from({ length: statValue }).map((_, idx) => (
                                        <span key={idx}>{icon}</span>
                                    ))}
                                </>
                            )}
                        </span>
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full px-6 py-6 bg-custom_dark_red rounded-md text-white">
            <h2 className="text-3xl font-bold mb-8 text-left text-white">Spelarstatistik</h2>
            <div className="flex flex-col gap-6">
                {topGoalScorer.currentSeasonStats.goals > 0 && (
                    <div>
                        <p className="mb-2 text-xl font-bold">Toppskytt</p>
                        <PlayerCardMini player={topGoalScorer} statName="Mål" statValue={topGoalScorer.currentSeasonStats.goals} />
                    </div>
                )}
                {mostAssists.currentSeasonStats.assists > 0 && (
                    <div>
                        <p className="mb-2 text-xl font-bold">Flest Assists</p>
                        <PlayerCardMini player={mostAssists} statName="Assists" statValue={mostAssists.currentSeasonStats.assists} />
                    </div>
                )}
                {mostYellowCards.currentSeasonStats.yellowCards > 0 && (
                    <div>
                        <p className="mb-2 text-xl font-bold">Flest Gula Kort</p>
                        <PlayerCardMini player={mostYellowCards} statName="Gula Kort" statValue={mostYellowCards.currentSeasonStats.yellowCards} />
                    </div>
                )}
                {mostRedCards.currentSeasonStats.redCards > 0 && (
                    <div>
                        <p className="mb-2 text-xl font-bold">Flest Röda Kort</p>
                        <PlayerCardMini player={mostRedCards} statName="Röda Kort" statValue={mostRedCards.currentSeasonStats.redCards} />
                    </div>
                )}
                {fastestPlayer.currentSeasonStats.highestSpeed > 0 && (
                    <div>
                        <p className="mb-2 text-xl font-bold">Snabbaste Spelare</p>
                        <PlayerCardMini player={fastestPlayer} statName="Högsta Hastighet" statValue={fastestPlayer.currentSeasonStats.highestSpeed} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FunStats;
