
import { gql } from '@apollo/client';

// GraphQL Queries
export const GET_ALL_JOBBS = gql`
  query GetAllJobbs($limit: Int!, $page: Int!, $sort: String!) {
    Jobbs(limit: $limit, page: $page, sort: $sort) {
      docs {
        id
        title
        slug
        enddate
        publishedAt
        createdAt
        updatedAt
        photo {
          id
          url
          alt
          filename
          width
          height
        }
        meta {
          title
          description
          image {
            id
            url
            alt
          }
        }
      }
      totalDocs
      totalPages
      page
      hasNextPage
      hasPrevPage
    }
  }
`;