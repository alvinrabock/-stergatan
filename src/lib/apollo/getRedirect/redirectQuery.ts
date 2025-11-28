import { gql } from '@apollo/client';

export const GET_REDIRECTS = gql`
  query GetRedirects {
    Redirects {
      docs {
        id
        from
        to {
          type
          url
        }
        createdAt
        updatedAt
      }
    }
  }
`;
