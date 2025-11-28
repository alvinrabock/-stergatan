import { gql } from "@apollo/client";

export const SEARCH_POSTS = gql`
  query SearchPosts($search: String) {
    Posts(
        where: {
          title: { contains: $search }
          _status: { equals: published }
        }
      ) {
     docs {
        id
        title
        slug
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
