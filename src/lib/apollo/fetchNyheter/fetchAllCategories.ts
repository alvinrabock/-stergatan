import { gql } from "@apollo/client";

export const FETCH_ALL_CATEGORIES = gql`
query FetchAllCategories($limit: Int, $page: Int) {
  Categories(limit: $limit, page: $page) {
      docs {
        id
        title
        slug
        publishedAt
      description
        parent {
          id
          title
        }
        breadcrumbs {
          id
          label
          url
        }
        banner {
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
