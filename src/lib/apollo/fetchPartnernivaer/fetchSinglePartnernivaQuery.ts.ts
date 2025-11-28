import { gql } from "@apollo/client";

export const GET_SINGLE_PARTNERNIVA = gql`
  query GetPartnerNivaer($slug: String!) {
    Partnernivaers(where: { slug: { equals: $slug } }) {
      docs {
        id
        createdAt
        updatedAt
        title
        investering
        slug
        slugLock
       
        koppladepartners {
          docs {
            id
            link
            createdAt
            updatedAt
            title
            slug
            slugLock
            logotype {
              id
              alt
              filename
              mimeType
              filesize
              width
              height
              focalX
              focalY
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
                xlarge {
                  url
                  width
                  height
                  mimeType
                  filesize
                  filename
                }
              }
              createdAt
              updatedAt
              url
              thumbnailURL
            }
          }
          hasNextPage
        }
      }
    }
  }
`;
