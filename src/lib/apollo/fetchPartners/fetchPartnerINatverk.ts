// In /lib/apollo/fetchPartners/fetchPartnerINatverk.js
import { gql } from "@apollo/client";
import { Partner } from "@/types";
import client from "../apolloClient";

export const GET_OSTERNATVERKET_PARTNERS = gql`
  query GetAllPartnersOsternatverket($limit: Int) {
    Partners(
      where: { osternatverket: { equals: true } }
      limit: $limit
    ) {
      docs {
        id
        createdAt
        updatedAt
        title
        slug
        slugLock
        link
        osternatverket
        osterISamhallet
        partnernivaer {
          id
          title
          investering
          slug
          slugLock
        }
        logotype {
          id
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
          thumbnailURL
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
            og {
              url
              width
              height
              mimeType
              filesize
              filename
            }
          }
        }
      }
      totalDocs
      hasNextPage
    }
  }
`;

const PARTNERS_TAG = 'partners-data';

export const fetchPartnersInOsternatverket = async (): Promise<Partner[]> => {
  try {
    const { data } = await client.query({
      query: GET_OSTERNATVERKET_PARTNERS,
      variables: {
        limit: 100 
      },
      fetchPolicy: 'network-only',
      context: {
        fetchOptions: {
          next: { tags: [PARTNERS_TAG] },
        },
      },
    });

    return data?.Partners?.docs || []
  } catch (error) {
    console.error('Error fetching partners in Östernatverket:', error)
    return []
  }
}