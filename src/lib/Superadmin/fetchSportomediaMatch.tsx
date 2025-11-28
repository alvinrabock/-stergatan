"use server"

export interface SportomediaMatchEvent {
    teamName?: string;
    homeTeamName: string;
    visitingTeamName: string;
    playerName?: string;
    byHomeTeam?: boolean;
    homeTeamScore: number;
    visitingTeamScore: number;
    description: string;
    rating: number;
    type: 'GOAL' | 'SHOT' | 'SHOT_ON_TARGET' | 'WARNING' | 'OFFSIDE' | 'SUBSTITUTION' | 'PERIOD_RESULT' | 'START';
    typeString: string;
    video?: {
        thumbnail: string;
        embedVideoUrl: string;
    };
}

export interface SportomediaLineupPlayer {
    id: number;
    fogisId: number;
    number: number;
    givenName: string;
    surName: string;
    position: string;
    isCaptain: boolean;
    isGoalkeeper: boolean;
    goals: number;
    assists: number;
    shots: number;
    shotsOnGoal: number;
    bookings: number;
    redCard: number;
    substitution: number;
    imageFull750?: string;
    imageHalf200?: string;
}

export interface SportomediaLineup {
    formationId: number;
    formationDescription: string;
    substitutes: SportomediaLineupPlayer[];
    [key: string]: any; // For starting XI positions
}

export interface SportomediaMatchData {
    id: number;
    fogisId: number;
    status: 'FINISHED' | 'LIVE' | 'NOT_STARTED';
    startDate: string;
    round: number;
    configLeagueName: string;
    configSeasonStartYear: number;
    isAvailablePublicly: boolean;
    homeTeamName: string;
    visitingTeamName: string;
    homeTeamFogisId: number;
    visitingTeamFogisId: number;
    homeTeamAbbrv: string;
    visitingTeamAbbrv: string;
    homeTeamScore: number;
    visitingTeamScore: number;
    matchMinute: number;
    matchMinuteWithStoppageTime: string;
    ticketUrl?: string;
    visitingTeamLogo: string;
    homeTeamLogo: string;
    arenaName: string;
    matchEvents: SportomediaMatchEvent[];
    homeTeamLineup: SportomediaLineup;
    visitingTeamLineup: SportomediaLineup;
    homeTeamForm: any[];
    visitingTeamForm: any[];
}

export async function fetchSportomediaMatch({
    league,
    season,
    matchId,
}: {
    league: string;
    season: string;
    matchId: string;
}): Promise<SportomediaMatchData> {
    const leagueLowerCase = league.toLowerCase();
    const url = `https://api.sportomedia.se/v1/matches/${leagueLowerCase}/${season}/${matchId}`;

    console.log('🔍 Fetching Sportomedia match data:', url);

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

        const data = await res.json();
        console.log('✅ Sportomedia match data fetched successfully');
        return data;
    } catch (error) {
        console.error('❌ Error fetching Sportomedia match:', error);
        throw error;
    }
}
