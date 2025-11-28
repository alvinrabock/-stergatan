import { gql } from "@apollo/client";
import { Partner } from "@/types";
import client from "../apolloClient";

export const GET_OSTERISAMHALLET_PARTNERS = gql`
  query GetAllPartners {
    Partners(where: { osterISamhallet: { equals: true } }) {
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
    }
  }
`;

const PARTNERS_TAG = 'partners-data';

export const fetchPartnersOsterISamhallet = async (): Promise<Partner[]> => {
  try {
    const { data } = await client.query({
      query: GET_OSTERISAMHALLET_PARTNERS,
      variables: {},
      fetchPolicy: 'network-only',
      context: {
        fetchOptions: {
          next: { tags: [PARTNERS_TAG] },
        },
      },
    });

    return data?.Partners?.docs || []
  } catch (error) {
    console.error('Error fetching partners in Östernätverket:', error)
    return []
  }
}