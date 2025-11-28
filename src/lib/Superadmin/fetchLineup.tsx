"use server"

export async function fetchtLineupData({
    league,
    season,
    extMatchId,
}: {
    league: string;
    season: string;
    extMatchId: string;
}) {
    const leagueLowerCase = league.toLowerCase();
    const url = `https://api.sportomedia.se/v1/lineups/${leagueLowerCase}/${season}/${extMatchId}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'x-api-key': process.env.SUPERADMIN_KEY || '',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}
