import { gql } from "@apollo/client";

export const GET_SINGLE_FORETAGSPAKET = gql`
  query GetSingleForetagspaket($slug: String!) {
    Foretagspakets(where: { slug: { equals: $slug } }) {
      docs {
        id
        createdAt
        updatedAt
        slugLock
        _status
        publishedAt
        slug
        title
        shortDescription
        price
        foretagspaketkategorier {
          id
          createdAt
          updatedAt
          title
          slug
          slugLock
        }
        heroImage {
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
            xlarge {
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
        Ingaripaketet {
          id
          text
        }
      }
    }
  }
`;
