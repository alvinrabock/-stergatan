/**
 * Team Configuration
 * Hardcoded team data for Östers IF since we've migrated away from Payload CMS
 */

export interface TeamConfig {
  id: string;
  title: string;
  slug: string;
  smcTeamId: string;
  fogisTeamId?: string;
  fogisTeamSlug?: string;
  fetchFromSEFAPI: boolean;
  seasons: {
    seasonYear: number;
    tournaments: {
      LeagueName: string;
      leagueId: number;
    }[];
  }[];
}

/**
 * Östers IF team configuration
 * Update these values as needed for each season
 */
export const OSTERS_IF_CONFIG: TeamConfig[] = [
  {
    id: 'osters-if',
    title: 'Östers IF',
    slug: 'osters-if',
    smcTeamId: '116', // Östers IF SMC Team ID
    fogisTeamId: undefined,
    fogisTeamSlug: undefined,
    fetchFromSEFAPI: true,
    seasons: [
      {
        seasonYear: 2025,
        tournaments: [
          {
            LeagueName: 'Superettan',
            leagueId: 2, // Superettan league ID
          },
        ],
      },
      {
        seasonYear: 2024,
        tournaments: [
          {
            LeagueName: 'Superettan',
            leagueId: 2,
          },
        ],
      },
    ],
  },
];

/**
 * Get teams with SMC integration enabled
 * Replacement for the old Apollo/Payload CMS query
 */
export function getTeamsWithSMC(): TeamConfig[] {
  return OSTERS_IF_CONFIG.filter((team) => team.fetchFromSEFAPI);
}
