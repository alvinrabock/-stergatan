import { Jobb } from "@/types";
import client from "../apolloClient";
import { GET_JOBB_BY_SLUG } from "./fetchSingleJobbQuery";

export interface JobbBySlugResponse {
  Jobbs: {
    docs: Jobb[];
  };
}

export const JOBBS_CACHE_TAG = 'jobb-data';

export async function fetchJobbBySlug(slug: string): Promise<Jobb | null> {
  try {
    const { data } = await client.query<JobbBySlugResponse>({
      query: GET_JOBB_BY_SLUG,
      variables: {
        slug,
      },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      context: {
        fetchOptions: {
          next: { tags: [JOBBS_CACHE_TAG] },
        },
      },
    });

    // Handle potential undefined docs array
    return data?.Jobbs?.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching jobb by slug:', error);
    throw error;
  }
}