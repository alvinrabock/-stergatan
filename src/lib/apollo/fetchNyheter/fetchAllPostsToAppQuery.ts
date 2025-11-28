import { gql } from "@apollo/client";

export const GET_ALL_APP_POSTS = gql`
  query GetPosts($limit: Int!, $page: Int, $sort: String) {
    Posts(
      limit: $limit
      page: $page
      sort: $sort
      where: { 
        _status: { equals: published },
        publishToApp: { equals: true }
      }
    ) {
      docs {
        id
        _status 
        title
        slug
        createdAt
        publishedAt
        youtubeLink
        publishToApp
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
        meta {
          title
          description
          image {
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
        categories {
          id
          title
        }
        
      }
    }
  }
`;