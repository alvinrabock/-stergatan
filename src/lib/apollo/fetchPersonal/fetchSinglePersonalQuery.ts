import { gql } from "@apollo/client";

export const GET_SINGLE_PERSONAL = gql`
  query GetAllPersonals ($slug: String!) {
    Personals(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        email
        jobTitle
        phoneNumber
        publishedAt
        photo {
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
        slugLock
        createdAt
        updatedAt
        slug
      }
    }
  }
`;
