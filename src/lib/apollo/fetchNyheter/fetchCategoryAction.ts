'use server';

import { Post } from "@/types";
import client from "../apolloClient";
import { FETCH_POSTS_BY_CATEGORY } from "./fetchCategoriesQuery";
import { cache } from "react";

const CATEGORIES_TAG = 'categories-data';

export const fetchCategoryPosts = cache(async (slug: string): Promise<Post[]> => {
  const { data } = await client.query({
    query: FETCH_POSTS_BY_CATEGORY,
    variables: { slug },
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        next: { tags: [CATEGORIES_TAG] },
      },
    },
  });

  return data.categories?.docs[0] || [];
});
