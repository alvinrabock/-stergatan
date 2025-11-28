import { gql } from "@apollo/client";

export const GET_POSTS_BY_LAG = gql`
query GetPostsByLag($lagId: JSON!, $limit: Int!) {
  Posts(
    where: {
      koppladelag: { equals: $lagId }
      _status: { equals: published }
    }
    limit: $limit
  ) {     
      docs {
        id
        title
        slug
        createdAt
        publishedAt
        youtubeLink
        _status
        koppladelag {
          id
          slug
          title
        }
        heroImage {
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
    }
  }
  
`;
