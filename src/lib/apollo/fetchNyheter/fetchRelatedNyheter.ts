import { Post } from "@/types";
import { gql } from "@apollo/client";
import client from "../apolloClient";

// Helper function to deduplicate posts based on their ID
const deduplicatePosts = (posts: Post[]) => {
  const seen = new Set();
  return posts.filter(post => {
    if (seen.has(post.id)) {
      return false;
    } else {
      seen.add(post.id);
      return true;
    }
  });
};

// Modified fetchRelatedPosts function
export const fetchRelatedPosts = async (
  relatedCategoryIds: string[],
  excludePostId: string
) => {
  const whereFilter = {
    AND: [
      {
        id: { not_equals: excludePostId },
      },
      {
        categories: { in: relatedCategoryIds },
      },
    ],
  };

  try {
    // Fetch posts based on the combined categories
    const { data } = await client.query({
      query: gql`
        query GetRelatedPosts($where: Post_where) {
          Posts(where: $where) {  
            docs {
              id
              title
              slug
              publishedAt
              createdAt
              youtubeLink
              heroImage {
                url
                alt
                width
                height
                updatedAt
                sizes {
                  small {
                    url
                    width
                    height
                  }
                }
              }
              categories {
                title
                slug
              }
            }
          }
        }
      `,
      variables: {
        where: whereFilter,
      },
      fetchPolicy: 'network-only', 
    });

    // Deduplicate posts first
    const posts = data?.Posts?.docs ?? [];
    const deduplicatedPosts = deduplicatePosts(posts);

    // Sort by publishedAt (newest first)
    const sortedPosts = deduplicatedPosts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0);
      const dateB = new Date(b.publishedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime(); // Newest first
    });

    return sortedPosts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
};