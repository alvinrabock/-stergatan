import { gql } from "@apollo/client";

export const GET_ALL_PARTNERNIVAER_AND_PARTNERS = gql`
  query GetAllPartnernivaers {
    Partnernivaers {
      docs {
        id
        createdAt
        updatedAt
        publishedAt
        title
        investering
        slug
        slugLock
        Ingaripaketet{
          text
          id
        }
        koppladepartners {
          docs {
            id
            createdAt
            updatedAt
            title
            slug
            slugLock
            link
            partnernivaer {
              id
              title
              investering
              slug
              slugLock
            }
            logotype {
              id
              createdAt
              updatedAt
              alt
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
                xlarge {
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
    }
  }
`;