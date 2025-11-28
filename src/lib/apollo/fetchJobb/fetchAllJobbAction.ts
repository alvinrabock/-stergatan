import { Jobb } from "@/types";
import client from "../apolloClient";
import { GET_ALL_JOBBS } from "./fetchAllJobbQuery";

interface JobbsQueryResponse {
    Jobbs?: {
        docs?: Jobb[];
    };
}

export const JOBBS_CACHE_TAG = 'jobb-data';

export async function fetchAllJobbs(limit = 10, page = 1): Promise<Jobb[]> {
    try {
        const { data } = await client.query<JobbsQueryResponse>({
            query: GET_ALL_JOBBS,
            variables: {
                limit,
                page,
                sort: "-publishedAt",
            },
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
            context: {
                fetchOptions: {
                    next: { tags: [JOBBS_CACHE_TAG] },
                },
            },
        });

        // Handle potential undefined docs array and return empty array as fallback
        return data?.Jobbs?.docs || [];
    } catch (error) {
        console.error('Error fetching jobbs:', error);
        throw error;
    }
}