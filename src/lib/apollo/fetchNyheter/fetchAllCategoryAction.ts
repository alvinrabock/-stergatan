"use server";

import { Category } from '@/types';
import { cache } from 'react';
import client from '../apolloClient';
import { FETCH_ALL_CATEGORIES } from './fetchAllCategories';

const CATEGORIES_TAG = 'categories-data';

interface CategoriesQueryResult {
  Categories: {
    docs: Category[];
    totalPages: number;
  };
}

export const fetchAllCategoryPosts = cache(async (): Promise<Category[]> => {
  const limit = 100;
  let page = 1;
  let allCategories: Category[] = [];
  let totalPages = 1;

  try {
    do {
      const { data } = await client.query<CategoriesQueryResult>({
        query: FETCH_ALL_CATEGORIES,
        variables: { limit, page },
        fetchPolicy: 'network-only',
        context: {
          fetchOptions: {
            next: { tags: [CATEGORIES_TAG] },
          },
        },
      });

      const categories = data.Categories?.docs ?? [];
      totalPages = data.Categories?.totalPages ?? 1;

      allCategories = allCategories.concat(categories);
      page++;
    } while (page <= totalPages);

    // Sort all categories by publishedAt (descending - newest first), nulls/undefined last
    const sortedCategories = [...allCategories].sort((a, b) => {
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bDate - aDate;
    });

    return sortedCategories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
});
