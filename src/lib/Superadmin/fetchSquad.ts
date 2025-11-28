"use server"

import { TruppPlayers } from "@/types";

export async function fetchSquadData() {
    const res = await fetch(
        'https://api.sportomedia.se/v1/squad/OIF/2025?full=true',
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'x-api-key': process.env.SUPERADMIN_KEY || '',
            },
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        throw new Error(`Error fetching squad data: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    const squad: TruppPlayers[] = data.squad.filter((player: TruppPlayers) => {
        const matches = player.stats?.some((stat) => {
            return stat.teamName === "Östers IF";
        });
        return matches;
    });

    return squad;
}
