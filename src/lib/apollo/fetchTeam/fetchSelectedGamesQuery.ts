import { gql } from '@apollo/client';

export const GET_SELECTED_GAMES = gql`
  query GetSelectedGames {
    Lags {
      docs {
        id
        title
        slug
        selectedMatches
      }
    }
  }
`;
