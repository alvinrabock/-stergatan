'use server';

import { Category, Lag, Post } from "@/types";
import client from "../apolloClient";
import { cache } from "react";
import { GET_ALL_APP_POSTS } from "./fetchAllPostsToAppQuery";

const APP_POSTS_CACHE_TAG = 'posts-data';

interface PostsQueryResponse {
  Posts?: {
    docs?: Post[];
  };
}

export const fetchAppPosts = cache(
  async (limit: number, page?: number): Promise<Post[]> => {
    try {
      const { data } = await client.query<PostsQueryResponse>({
        query: GET_ALL_APP_POSTS,
        variables: { 
          limit, 
          page, 
          sort: '-publishedAt' 
        },
        fetchPolicy: 'network-only',
        context: {
          fetchOptions: {
            next: { tags: [APP_POSTS_CACHE_TAG] },
          },
        },
      });

      const posts = data?.Posts?.docs;
      if (!Array.isArray(posts)) return [];

      const cleanedPosts = posts.map((post) => ({
        ...post,
        categories: (post.categories || []).filter(
          (cat: Category | string | null | undefined): cat is Category =>
            !!cat && typeof cat === 'object' && 'id' in cat && 'title' in cat
        ),
        koppladelag: (post.koppladelag || []).filter(
          (kl: Lag | string | null | undefined): kl is Lag =>
            !!kl && typeof kl === 'object' && 'id' in kl && 'title' in kl && 'slug' in kl
        ),
      }));

      return cleanedPosts;
    } catch (error) {
      console.error("Error fetching app posts:", error);
      return [];
    }
  }
);
