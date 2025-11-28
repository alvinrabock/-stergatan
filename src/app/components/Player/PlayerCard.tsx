import React from "react";
import Image from "next/image";
import { TruppPlayers } from "@/types";

interface PlayerCardProps {
    player: TruppPlayers;
}


const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    const { sefImagePng } = player.images;
    const shirtNumber = player.currentClub[0]?.shirtNumber;
    // Extract current season stats
    const { goals, assists, matchesPlayed } = player.currentSeasonStats;

    return (
        <div
            className="relative bg-custom_dark_red rounded-2xl overflow-hidden group aspect-[4/5] bg-cover bg-center flex flex-col justify-end"

        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-3 bg-[linear-gradient(to_top,_#000000_5%,_transparent_80%,_transparent_100%)]" />

            {/* Shirt number at the top */}
            {shirtNumber && (
                <span className="absolute top-4 left-4 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-custom-red">
                    {shirtNumber}
                </span>
            )}

            {/* Player details */}
            <div className="relative z-10 p-2 md:p-4 text-white">
                <h2 className="text-sm xs:text-md font-bold sm:text-lg md:text-xl lg:text-2xl">
                    <span className="block lg:inline">{player.givenName}</span>{' '}
                    <span className="block lg:inline">{player.surName}</span>
                </h2>

                <div className="flex flex-row gap-6 py-[1px] sm:py-2 text-[10px] sm:text-sm">
                    <p>{player.position?.primary}</p>
                    <p>{player.nationality}</p>
                </div>

                {/* Display current season stats */}
                <div className="text-[10px] sm:text-xs md:text-sm grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <p className="font-bold">{matchesPlayed}</p>
                        <p>Matcher</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">{goals}</p>
                        <p>Mål</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">{assists}</p>
                        <p>Assist</p>
                    </div>
                </div>
            </div>

            {/* Use Next.js Image component */}
            {sefImagePng && (
                <div className="absolute inset-0 w-full h-full z-1">
                    <Image
                        src={sefImagePng}
                        alt={`${player.givenName} ${player.surName}`}
                        fill
                        objectFit="cover"
                    />
                </div>
            )}
        </div>
    );
};

export default PlayerCard;
