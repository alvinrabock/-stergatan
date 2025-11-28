import { gql } from '@apollo/client';

export const GET_ALL_TEAMS = gql`
  query GetAllTeams {
    Lags {
      docs {
        id
        title
        slug
        createdAt
        updatedAt
        publishedAt
        aLag
        Sportadminlink
      linkDirectToSportadmin
        banner {
          id
          createdAt
          updatedAt
          filename
          mimeType
          filesize
          width
          height
          focalX
          focalY
          url
          thumbnailURL
          sizes {
            thumbnail {
              url
              width
              height
              mimeType
              filesize
              filename
            }
            square {
              url
              width
              height
              mimeType
              filesize
              filename
            }
            small {
              url
              width
              height
              mimeType
              filesize
              filename
            }
            medium {
              url
              width
              height
              mimeType
              filesize
              filename
            }
            large {
              url
              width
              height
              mimeType
              filesize
              filename
            }
            og {
              url
              width
              height
              mimeType
              filesize
              filename
            }
          }
        }
      }
    }
  }
`;
