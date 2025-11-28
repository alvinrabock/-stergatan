// Mapping of league names to Fogis tournament IDs
// This allows us to use Fogis context endpoints which return ext-player-id fields

interface FogisLeagueMapping {
  leagueName: string;
  season: string;
  fogisLeagueId: string; // tournamentID from /fogis/leagues
  smcLeagueId: string;   // LeagueId (ULID) from /fogis/leagues
}

// Static mappings for current seasons
const FOGIS_LEAGUE_MAPPINGS: FogisLeagueMapping[] = [
  {
    leagueName: "Allsvenskan",
    season: "2025",
    fogisLeagueId: "123864",
    smcLeagueId: "01JR052JATX2RRWKD0GN4D2WT1"
  },
  {
    leagueName: "Superettan",
    season: "2025",
    fogisLeagueId: "123863",
    smcLeagueId: "01JQV8CGVWY99E0ZNJTZNN4G2K"
  },
  {
    leagueName: "Allsvenskan",
    season: "2024",
    fogisLeagueId: "115560",
    smcLeagueId: "60"
  },
  {
    leagueName: "Superettan",
    season: "2024",
    fogisLeagueId: "115526",
    smcLeagueId: "61"
  },
  {
    leagueName: "OBOS Damallsvenskan",
    season: "2025",
    fogisLeagueId: "123860",
    smcLeagueId: "01K4T25SVCXPQD9QTJMNJBYKG4"
  },
];

/**
 * Get Fogis tournament ID (ext-league-id) from league name and season
 * This is needed for Fogis context endpoints that return ext-player-id fields
 */
export function getFogisLeagueId(leagueName: string, season?: string): string | null {
  // Try exact match with season if provided
  if (season) {
    const exactMatch = FOGIS_LEAGUE_MAPPINGS.find(
      m => m.leagueName === leagueName && m.season === season
    );
    if (exactMatch) return exactMatch.fogisLeagueId;
  }

  // Fallback: find most recent season for this league
  const matches = FOGIS_LEAGUE_MAPPINGS
    .filter(m => m.leagueName === leagueName)
    .sort((a, b) => parseInt(b.season) - parseInt(a.season));

  return matches[0]?.fogisLeagueId || null;
}

/**
 * Check if we have a Fogis mapping for this league/season combination
 */
export function hasFogisMapping(leagueName: string, season?: string): boolean {
  return getFogisLeagueId(leagueName, season) !== null;
}
