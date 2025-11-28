import type { PlayerStats } from '@/types';
import React from 'react'
import DistanceIcon from '../Icons/DistanceIcon';
import FastIcon from '../Icons/FastIcon';
import { Card } from '../ui/card'

interface PlayerStatsCardProps {
    playerName: string;
    stats: PlayerStats;
    isFastest: boolean;
    isLongestDistance: boolean;
    isHomeTeam: boolean;
}

const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({ playerName, stats, isFastest, isLongestDistance }) => {

    return (
        <Card className="p-4 overflow-hidden border-t-2" key={stats["player-id"]}>
            <div>
                <div className='flex flex-row gap-4 items-center'>
                    <p className='text-2xl font-bold oswald-font'>
                        {playerName}
                    </p>
                    {isFastest && (
                        <span className="flex items-center gap-1 text-sm text-green-600 bg-green-200 px-2 py-1 rounded-full">
                            <FastIcon className="w-4 h-4 fill-green-600" /> Högst maxhastighet
                        </span>
                    )}

                    {isLongestDistance && (
                        <span className="ml-2 flex items-center gap-1 text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                            <DistanceIcon className="w-4 h-4 fill-blue-600" /> Längst distans
                        </span>
                    )}
                </div>
                <ul className="space-y-3 mt-4">
                    {stats["ball-wins"] !== undefined && stats["ball-wins"] !== null && (
                        <li className="flex justify-between">
                            <span className="font-medium">Bollvinster:</span>
                            <span>{stats["ball-wins"]}</span>
                        </li>
                    )}
                    {stats["ball-losses"] !== undefined && stats["ball-losses"] !== null && (
                        <li className="flex justify-between">
                            <span className="font-medium">Bollförluster:</span>
                            <span>{stats["ball-losses"]}</span>
                        </li>
                    )}
                    {stats["ball-time"] !== undefined && stats["ball-time"] !== null && (
                        <li className="flex justify-between">
                            <span className="font-medium">Bolltid:</span>
                            <span>{stats["ball-time"]} sek</span>
                        </li>
                    )}
                </ul>

                <div className="grid grid-cols-4 gap-2 mb-3">
                    {stats.distance !== undefined && stats.distance !== null && (
                        <StatBox
                            label="Distans"
                            value={stats.distance}
                            unit="m"
                        />
                    )}
                    {stats["max-speed"] !== undefined && stats["max-speed"] !== null && (
                        <StatBox
                            label="Maxhastighet"
                            value={stats["max-speed"]}
                            unit="km/h"
                        />
                    )}
                    {stats["ball-wins"] !== undefined && stats["ball-wins"] !== null && (
                        <StatBox
                            label="Bollvinster"
                            value={stats["ball-wins"]}
                        />
                    )}
                    {stats["ball-losses"] !== undefined && stats["ball-losses"] !== null && (
                        <StatBox
                            label="Bollförluster"
                            value={stats["ball-losses"]}
                        />
                    )}
                    {stats["ball-time"] !== undefined && stats["ball-time"] !== null && (
                        <StatBox
                            label="Bolltid"
                            value={`${stats["ball-time"]} sek`}
                        />
                    )}
                </div>

                {(stats.passes || stats["failed-passes"]) ? (
                    <div className="flex flex-col flex-1">
                        <div className="text-left mb-2">
                            <span className="text-sm uppercase oswald-font">
                                Pass Precision
                            </span>
                        </div>

                        <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted/20">
                                <div
                                    style={{
                                        width: `${(stats.passes ?? 0) / ((stats.passes ?? 0) + (stats["failed-passes"] ?? 0)) * 100}%`,
                                        backgroundColor: "#4CAF50",
                                    }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                ></div>
                                <div
                                    style={{
                                        width: `${(stats["failed-passes"] ?? 0) / ((stats.passes ?? 0) + (stats["failed-passes"] ?? 0)) * 100}%`,
                                        backgroundColor: "#F44336",
                                    }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                                ></div>
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            {stats.passes !== undefined && stats.passes !== null && (
                                <div>
                                    <span className="text-sm uppercase text-custom-dark-green oswald-font">
                                        {stats.passes} Passningar
                                    </span>
                                </div>
                            )}
                            {stats["failed-passes"] !== undefined && stats["failed-passes"] !== null && (
                                <div>
                                    <span className="text-sm uppercase text-custom-dark-red oswald-font">
                                        {stats["failed-passes"]} Misslyckade Passningar
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {(
                    stats["high-intensity-run-distance"] ||
                    stats["mid-intensity-run-distance"] ||
                    stats["low-intensity-run-distance"]
                ) && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs">Intensitetsfördelning</span>
                            </div>
                            <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-muted">
                                <div
                                    style={{
                                        width: `${((stats["high-intensity-run-distance"] || 0) /
                                            ((stats["high-intensity-run-distance"] || 0) +
                                                (stats["mid-intensity-run-distance"] || 0) +
                                                (stats["low-intensity-run-distance"] || 0) || 1)) * 100}%`,
                                        backgroundColor: "#ef4444",
                                    }}
                                    className="h-full"
                                />
                                <div
                                    style={{
                                        width: `${((stats["mid-intensity-run-distance"] || 0) /
                                            ((stats["high-intensity-run-distance"] || 0) +
                                                (stats["mid-intensity-run-distance"] || 0) +
                                                (stats["low-intensity-run-distance"] || 0) || 1)) * 100}%`,
                                        backgroundColor: "#f97316",
                                    }}
                                    className="h-full"
                                />
                                <div
                                    style={{
                                        width: `${((stats["low-intensity-run-distance"] || 0) /
                                            ((stats["high-intensity-run-distance"] || 0) +
                                                (stats["mid-intensity-run-distance"] || 0) +
                                                (stats["low-intensity-run-distance"] || 0) || 1)) * 100}%`,
                                        backgroundColor: "#22c55e",
                                    }}
                                    className="h-full"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-1 mt-1">
                                {stats["high-intensity-run-distance"] !== undefined && stats["high-intensity-run-distance"] !== null && (
                                    <div className="flex items-center text-[10px] text-center text-muted-foreground">
                                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full mr-1"></div>
                                        Hög: {stats["high-intensity-run-distance"]} meter
                                    </div>
                                )}
                                {stats["mid-intensity-run-distance"] !== undefined && stats["mid-intensity-run-distance"] !== null && (
                                    <div className="flex items-center text-[10px] text-center text-muted-foreground">
                                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-1"></div>
                                        Medel: {stats["mid-intensity-run-distance"]} meter
                                    </div>
                                )}
                                {stats["low-intensity-run-distance"] !== undefined && stats["low-intensity-run-distance"] !== null && (
                                    <div className="flex items-center text-[10px] text-center text-muted-foreground">
                                        <div className="w-2.5 h-2.5 bg-green-600 rounded-full mr-1"></div>
                                        Låg: {stats["low-intensity-run-distance"]} meter
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

            </div>
        </Card>
    )
}
function StatBox({
    label,
    value,
    unit,
}: {
    label: string
    value?: number | string;
    unit?: string
}) {
    return (
        <div className="flex flex-col items-center justify-center p-1 rounded-md bg-muted/30">
            <div className="text-[10px] text-muted-foreground">
                <span>{label}</span>
            </div>
            <div className="text-sm font-medium">
                {value !== undefined && value !== null ? value : "N/A"}
                {unit ? ` ${unit}` : ""}
            </div>
        </div>
    )
}

export default PlayerStatsCard