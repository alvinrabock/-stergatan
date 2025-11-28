import { gql } from '@apollo/client';

export const GET_HEADER = gql`
query GetHeader {
  Header {
    navItems {
      layout
      link {
        type
        url
        label
        newTab
        reference {
          relationTo
          value {
            ... on Page {
              id
              slug
              title
            }
            ... on Post {
              id
              slug
              title
            }
          }
        }
      } 
      subMenu {
        link {
          type
          url
          label
          newTab
          reference {
            relationTo
            value {
              ... on Page {
                id
                slug
                title
              }
              ... on Post {
                id
                slug
                title
              }
            }
          }
        }
        image {
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
          sizes {
            thumbnail {
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
          id
        }
        subMenu {
          link {
            type
            url
            label
            newTab
            reference {
              relationTo
              value {
                ... on Page {
                  id
                  slug
                  title
                }
                ... on Post {
                  id
                  slug
                  title
                }
              }
            }
          }
          id
        }
        id
      }
      id
    }
    createdAt
    updatedAt
    socialMedia {
      id
      platform
      url
    }
  }
}
`;