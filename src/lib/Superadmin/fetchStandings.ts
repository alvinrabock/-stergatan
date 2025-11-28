"use server"
export interface MatchForm {
    matchResult: 'W' | 'D' | 'L';
    homeTeamAbbrv: string;
    visitingTeamAbbrv: string;
    homeTeamScore: number;
    visitingTeamScore: number;
    startDate: string;
  }
  
  export interface TeamStats {
    id: string;
    name: string;
    abbrv: string;
    teamId: number;
    logoImageUrl: string;
    displayName: string;
    position: number;
    stats: {
      name: string;
      value: number;
    }[];
    form: MatchForm[];
  }
  
  export const fetchStandings = async (league?: string, season?: string): Promise<TeamStats[]> => {
    // Default to Allsvenskan 2025 if not specified
    const leagueParam = league || 'allsvenskan';
    const seasonParam = season || '2025';

    console.log('fetchStandings: Fetching standings for', { league: leagueParam, season: seasonParam });

    const res = await fetch(`https://api.sportomedia.se/v1/standings/${leagueParam}/${seasonParam}/total`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-api-key': process.env.SUPERADMIN_KEY || '', // must be public if client side
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorMsg = `API error: ${res.status} ${res.statusText}`;
      console.error('fetchStandings error:', errorMsg, { league: leagueParam, season: seasonParam });
      throw new Error(errorMsg);
    }

    const rawData = await res.json();
    const teamsArray = Object.values(rawData) as TeamStats[];

    const sortedTeams = teamsArray
      .filter(
        (team): team is TeamStats =>
          !!team &&
          typeof team.id === 'string' &&
          typeof team.position === 'number' &&
          !!team.displayName &&
          Array.isArray(team.stats)
      )
      .sort((a, b) => a.position - b.position);

    console.log('fetchStandings: Successfully fetched', sortedTeams.length, 'teams');

    return sortedTeams;
  };
  