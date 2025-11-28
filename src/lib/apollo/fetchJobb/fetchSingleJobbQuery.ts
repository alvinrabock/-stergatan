import { gql } from '@apollo/client';

export const GET_JOBB_BY_SLUG = gql`
  query GetJobbBySlug($slug: String!) {
    Jobbs(where: { slug: { equals: $slug } }, limit: 1) {
      docs {
        id
        title
        slug
        content
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
          mimeType
          filesize
        }
        meta {
          title
          description
          image {
            id
            url
            alt
            filename
            width
            height
          }
        }
      }
    }
  }
`;