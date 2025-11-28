import { gql } from "@apollo/client";
import client from "../apolloClient";

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPosts($categoryId: [JSON!], $limit: Int!, $page: Int, $sort: String) {
    Posts(
      where: {
        categories: { in: $categoryId }
        _status: { equals: published }
      }
      limit: $limit
      page: $page
      sort: $sort
    ) {
      docs {
        id
        title
        slug
        createdAt
        publishedAt
        _status
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
        categories {
          id title slug
          breadcrumbs {
            id url label
            doc { id title slug }
          }
        }
      }
    }
  }
`;

export async function fetchPostsByCategory(categoryId: string[], limit: number, page = 1) {
  const { data } = await client.query({
    query: GET_POSTS_BY_CATEGORY,
    variables: {
      categoryId,
      limit,
      page,
      sort: "-publishedAt", // 👈 ensure server sorts it
    },
    fetchPolicy: "no-cache",
  });

  return data.Posts.docs || [];
}
