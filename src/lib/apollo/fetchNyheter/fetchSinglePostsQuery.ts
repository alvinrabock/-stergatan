import { gql } from "@apollo/client";

export const GET_SINGLE_POSTS = gql`
  query GetPosts($slug: String!) {
    Posts(
      where: {
        slug: { equals: $slug }
        _status: { equals: published }
      }
    ) {
            docs {
        id
        title
        _status 
        slug
        createdAt
        publishedAt
        youtubeLink
        content
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
          breadcrumbs {
            id
            url
            label
            doc {
              id
              title
              slug
            }
          }
        }
      }
    }
  }
`;
