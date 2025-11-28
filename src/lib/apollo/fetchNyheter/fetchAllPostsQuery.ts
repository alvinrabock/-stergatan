import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query GetPosts($limit: Int!, $page: Int, $sort: String) {
    Posts(
      limit: $limit
      page: $page
      sort: $sort
      where: { _status: { equals: published } }
    ) {
      docs {
        id
        _status 
        title
        slug
        createdAt
        publishedAt
        youtubeLink
        koppladelag { id slug title }
        heroImage {
          id alt filename mimeType filesize width height focalX focalY url thumbnailURL
          createdAt updatedAt
          sizes {
            thumbnail { url width height filename filesize mimeType }
            square { url width height filename filesize mimeType }
            small { url width height filename filesize mimeType }
            medium { url width height filename filesize mimeType }
            large { url width height filename filesize mimeType }
            xlarge { url width height filename filesize mimeType }
          }
        }
        meta {
          title description
          image {
            id alt filename mimeType filesize width height focalX focalY url thumbnailURL
            createdAt updatedAt
            sizes {
              thumbnail { url width height filename filesize mimeType }
              square { url width height filename filesize mimeType }
              small { url width height filename filesize mimeType }
              medium { url width height filename filesize mimeType }
              large { url width height filename filesize mimeType }
              xlarge { url width height filename filesize mimeType }
            }
          }
        }
        categories { id title }
      }
    }
  }
`;
