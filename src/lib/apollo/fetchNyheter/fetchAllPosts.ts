'use server';

import { fetchAllNyheter } from '@/lib/frontspace/adapters';
import { Post } from "@/types";

/**
 * Fetch all news posts
 * Migrated from Apollo/Payload to Frontspace CMS
 */
export async function fetchAllPosts(limit = 10, page = 1): Promise<Post[]> {
  return fetchAllNyheter(limit, page);
}
