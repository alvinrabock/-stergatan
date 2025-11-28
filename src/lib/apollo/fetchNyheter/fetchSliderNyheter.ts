import { gql } from '@apollo/client'
import client from '../apolloClient'

const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts {
    Posts(
      where: {
        isFeatured: { equals: true }
        _status: { equals: published }
      }
      sort: "-publishedAt"
      limit: 100
    ) {
              docs {
            id
            title
            slug
            createdAt
            publishedAt
            youtubeLink
            _status
            meta {
              title
              description
              image {
                id
                alt
                filename
                mimeType
                filesize
                width
                height
                focalX
                focalY
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
                }
                createdAt
                updatedAt
                url
                thumbnailURL
              }
            }
            heroImage {
                id
                alt
                filename
                mimeType
                filesize
                width
                height
                focalX
                focalY
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
                }
                createdAt
                updatedAt
                url
                thumbnailURL
              }
            categories {
              id
              title
            }
          }
    }
  }
`

export const SLIDER_POSTS_CACHE_TAG = 'posts-data';

export const fetchFeaturedPosts = async () => {
  const { data } = await client.query({
    query: GET_FEATURED_POSTS,
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { tags: [SLIDER_POSTS_CACHE_TAG] },
      },
    },
  });

  return data?.Posts?.docs || [];
};