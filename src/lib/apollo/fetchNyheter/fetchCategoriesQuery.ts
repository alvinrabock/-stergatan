import { gql } from "@apollo/client";

export const FETCH_POSTS_BY_CATEGORY = gql`
  query FetchPostsByCategory($slug: String!) {
    Categories(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
      }
    }
  }
`;
