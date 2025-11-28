import { gql } from '@apollo/client';

export const FETCH_ALL_PERSONALAVDELNINGAR = gql`
  query fetchAllPersonalAvdelningarQuery {
    Personalavdelningars(limit: 100) {
      docs {
        createdAt
        id
        updatedAt
        publishedAt
        title
        slug
        slugLock
        koppladpersonal(limit: 100) {
          docs {
            createdAt
            updatedAt
            title
            publishedAt
            email
            jobTitle
            phoneNumber
            slug
            slugLock
            id
            photo {
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
              sizes {
                thumbnail {
                  width
                  height
                  mimeType
                  filesize
                  filename
                  url
                }
                square {
                  width
                  height
                  mimeType
                  filesize
                  filename
                  url
                }
                small {
                  width
                  height
                  mimeType
                  filesize
                  filename
                  url
                }
                medium {
                  width
                  height
                  mimeType
                  filesize
                  filename
                  url
                }
                large {
                  width
                  height
                  mimeType
                  filesize
                  filename
                  url
                }
                og {
                  width
                  height
                  mimeType
                  filesize
                  filename
                  url
                }
              }
            }
          }
          hasNextPage
        }
      }
    }
  }
`;
