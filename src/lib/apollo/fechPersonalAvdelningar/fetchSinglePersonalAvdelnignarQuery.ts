import { gql } from '@apollo/client';

export const FETCH_SINGLE_PERSONALAVDELNINGAR = gql`
  query fetchAllPersonalAvdelnignarQuery($slug: String!) {
    Personalavdelningars(where: { slug: { equals: $slug } }) {
      docs {
        createdAt
        id
        updatedAt
        title
        publishedAt
        slug
        slugLock
        koppladpersonal(limit: 100) {
          docs {
            createdAt
            publishedAt
            updatedAt
            title
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
