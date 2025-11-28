import { gql } from "@apollo/client";

export const GET_ALL_PARTNERNIVAER = gql`
  query GetAllPartnernivaers($sort: String) {
    Partnernivaers(sort: $sort) {
      docs {
        id
        createdAt
        updatedAt
        publishedAt
        title
        investering
        kortbeskrivning
        slug
        slugLock
        Ingaripaketet{
          text
          id
        }
      
      }
    }
  }
`;