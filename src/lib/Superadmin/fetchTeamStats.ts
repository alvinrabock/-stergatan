import { SuperAdminTeamStats } from "@/types";

export async function fetchTeamStats(): Promise<SuperAdminTeamStats | null> {
    try {
        const res = await fetch(
            'https://api.sportomedia.se/v1/statistics/teams/allsvenskan/2025',
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
            console.error(`Failed to fetch team stats: ${res.status}`);
            return null;
        }

        const allTeams: SuperAdminTeamStats[] = await res.json();

        const ostersIf = allTeams.find((team) => team.smcId === 19);

        return ostersIf || null;
    } catch (error) {
        console.error('Error fetching team stats:', error);
        return null;
    }
}