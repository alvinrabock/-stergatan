import { gql } from "@apollo/client";
import client from "../apolloClient";

export const GET_FORETAGSPAKET_BY_CATEGORY = gql`
  query GetForetagspaketByCategory($categoryId: [JSON], $limit: Int!, $page: Int) {
    Foretagspakets(
      where: {
        foretagspaketkategorier: { in: $categoryId }
        _status: { equals: published }
      }
      limit: $limit
      page: $page
    ) {
      docs {
        id
        createdAt
        updatedAt
        slugLock
        _status
        publishedAt
        slug
        title
        shortDescription
        price
        foretagspaketkategorier {
          id
          createdAt
          updatedAt
          title
          slug
          slugLock
        }
        heroImage {
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
            og {
              width
              height
              mimeType
              filesize
              filename
              url
            }
          }
        }
        Ingaripaketet {
          id
          text
        }
      }
    }
  }
`;

const FORETAGSPAKET_TAG = 'foretagspaket-data';


export async function fetchForetagspaketByCategory(
    categoryId: string[],
    limit: number,
    page = 1
) {
    const { data } = await client.query({
        query: GET_FORETAGSPAKET_BY_CATEGORY,
        variables: { categoryId, limit, page },
        fetchPolicy: "no-cache",
        context: {
            fetchOptions: {
                next: { tags: [FORETAGSPAKET_TAG] },
            },
        },
    });

    return data?.Foretagspakets?.docs || [];
}
