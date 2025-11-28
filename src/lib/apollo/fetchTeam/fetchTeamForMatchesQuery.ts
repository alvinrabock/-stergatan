import { gql } from '@apollo/client';

export const GET_TEAMS_WITH_SEF_ENABLED = gql`
  query GetTeamsWithSEFEnabled {
    Lags(where: { fetchFromSEFAPI: { equals: true } }) {
      docs {
        id
        title
        fetchFromSEFAPI
        smcTeamId
        fogisTeamId
        fogisTeamSlug
        seasons {
          seasonYear
          tournaments {
            LeagueName
            leagueId
          }
        }
        slug
      }
    }
  }
`;
