import { gql } from '@apollo/client';

export const GET_FOOTER = gql`
  query GetFooter {
    Footer {
      createdAt
      updatedAt
      columns {
        id
        title
        blocks {
         
          ... on Image {
            id
            blockType
            image {
              id
              alt
              url
              thumbnailURL
              filename
              mimeType
              filesize
              width
              height
              focalX
              focalY
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
              }
            }
          }
        }
      }
      socialMedia {
        id
        platform
        url
      }
    }
  }
`;
