'use server';

import { fetchSingleNyhet } from '@/lib/frontspace/adapters';
import { Post } from "@/types";

/**
 * Fetch single news post by slug
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export const fetchSinglePosts = async (slug: string): Promise<Post | null> => {
  return fetchSingleNyhet(slug);
};